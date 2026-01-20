// 輸入：buys = [{price, amount, id}], sells = [{price, amount, id}]
// 回傳：{buys, sells, trades}
export function matchOrders(buys = [], sells = []) {
  // clone 避免副作用
  buys = buys.map((b) => ({ ...b })).sort((a, b) => b.price - a.price);
  sells = sells.map((s) => ({ ...s })).sort((a, b) => a.price - b.price);

  const trades = [];

  while (buys.length && sells.length && buys[0].price >= sells[0].price) {
    console.log('開始搓合...');
    const buy = buys[0];
    const sell = sells[0];
    const tradePrice = sell.price; // 簡化：以賣方價格成交
    const tradeAmount = Math.min(buy.amount, sell.amount);
    buy.amount -= tradeAmount;
    sell.amount -= tradeAmount;

    trades.push({
      price: tradePrice,
      amount: tradeAmount,
      buyId: buy.id,
      sellId: sell.id,
      time: Date.now(),
    });

    buy.amount -= tradeAmount;
    sell.amount -= tradeAmount;

    if (buy.amount <= 0) buys.shift();
    if (sell.amount <= 0) sells.shift();
  }

  return { buys, sells, trades };
}
