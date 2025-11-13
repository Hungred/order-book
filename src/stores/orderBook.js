import { defineStore } from 'pinia';
import { ref } from 'vue';
import { matchOrders } from '@/utils/matchEngine';

export const useOrderBookStore = defineStore('orderBook', () => {
  const bids = ref([]); // buy side (高到低)
  const asks = ref([]); // sell side (低到高)
  const trades = ref([]); // trade history

  function replaceSnapshot(newBids, newAsks) {
    bids.value = newBids.sort((a, b) => b.price - a.price);
    asks.value = newAsks.sort((a, b) => a.price - b.price);
  }
  // 更新最新的訂單
  function applyUpdate(incomingBids, incomingAsks) {
    // 將 incoming 資料合併到現有 bids/asks（簡化：以 id 不存在就加入）
    // 更真實可依 price 聚合
    bids.value = mergeOrders(bids.value, incomingBids, 'bid');
    asks.value = mergeOrders(asks.value, incomingAsks, 'ask');

    // 嘗試搓合
    const {
      buys,
      sells,
      trades: newTrades,
    } = matchOrders(bids.value, asks.value);
    bids.value = buys;
    asks.value = sells;
    if (newTrades.length) trades.value.unshift(...newTrades);
    // keep history short
    trades.value = trades.value.slice(0, 200);
  }

  function mergeOrders(existing, incoming, side) {
    // 簡單合併：若 price 相同累加 amount，否則 push
    const all = [...existing, ...incoming];
    const merged = all.reduce((acc, order) => {
      const existingOrder = acc.find((o) => o.price === order.price);
      if (existingOrder) {
        existingOrder.amount = +(existingOrder.amount + order.amount).toFixed(
          8
        );
      } else {
        acc.push({ ...order });
      }
      return acc;
    }, []);

    const sorted = merged.sort((a, b) =>
      side === 'buy' ? b.price - a.price : a.price - b.price
    );

    return sorted;
  }

  // 使用者下單
  function placeOrder(order) {
    // order: {side:'buy'|'sell', price, amount, id}
    if (order.side === 'buy') {
      bids.value.push({ ...order });
      bids.value.sort((a, b) => b.price - a.price);
    } else {
      asks.value.push({ ...order });
      asks.value.sort((a, b) => a.price - b.price);
    }
    // 導致搓合
    const {
      buys,
      sells,
      trades: newTrades,
    } = matchOrders(bids.value, asks.value);
    bids.value = buys;
    asks.value = sells;
    if (newTrades.length) trades.value.unshift(...newTrades);
    trades.value = trades.value.slice(0, 200);
  }

  return { bids, asks, trades, replaceSnapshot, applyUpdate, placeOrder };
});
