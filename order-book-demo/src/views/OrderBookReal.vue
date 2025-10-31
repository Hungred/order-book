<template>
  <div class="orderbook">
    <h2>BTC-USDT Order Book (Real)</h2>

    <div class="table">
      <!-- Sell Side -->
      <div class="side">
        <h3>Sell</h3>
        <div class="row header">
          <span class="price">Price</span>
          <span class="size">Size</span>
          <span class="total">Amount</span>
        </div>
        <div v-for="quote in asks" :key="quote.price" class="row sell">
          <div
            class="bar"
            :style="{
              width:
                (quote.total /
                  Math.max(
                    bids[bids.length - 1]?.total || 1,
                    asks[asks.length - 1]?.total || 1
                  )) *
                  100 +
                '%',
            }"
          ></div>
          <span class="price">{{ formatNumber(quote.price) }}</span>
          <span :class="['size', quote.sizeChange]">{{
            formatNumber(quote.size)
          }}</span>
          <span class="total">{{ formatNumber(quote.total) }}</span>
        </div>
      </div>

      <!-- Buy Side -->
      <div class="side">
        <h3>Buy</h3>
        <div class="row header">
          <span class="price">Price</span>
          <span class="size">Size</span>
          <span class="total">Amount</span>
        </div>
        <div v-for="quote in bids" :key="quote.price" class="row buy">
          <div
            class="bar"
            :style="{
              width:
                (quote.total /
                  Math.max(
                    bids[bids.length - 1]?.total || 1,
                    asks[asks.length - 1]?.total || 1
                  )) *
                  100 +
                '%',
            }"
          ></div>
          <span class="price">{{ formatNumber(quote.price) }}</span>
          <span :class="['size', quote.sizeChange]">{{
            formatNumber(quote.size)
          }}</span>
          <span class="total">{{ formatNumber(quote.total) }}</span>
        </div>
      </div>
    </div>
    <div class="info">
      <h3>實作說明</h3>
      <ul>
        <li>透過 Binance WebSocket 取得實時 BTC-USDT 的買賣盤 (Depth 5)</li>
        <li>計算累積總量 (Total) 並顯示進度條，長度依照最大總量比例</li>
        <li>新增漲跌動畫，當買賣盤數量變動時會閃綠/紅</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const bids = ref([]);
const asks = ref([]);
const prevBids = ref([]);
const prevAsks = ref([]);
let ws = null;

const formatNumber = (n) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  });

const calcTotals = (array) => {
  let total = 0;
  return array.map((item) => {
    total += item.size;
    return { ...item, total };
  });
};

onMounted(() => {
  ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth5@100ms');

  ws.onopen = () => console.log('Connected to Binance WebSocket');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.bids && data.asks) {
      const bidsData = data.bids
        .map(([price, size]) => ({ price: Number(price), size: Number(size) }))
        .sort((a, b) => b.price - a.price);
      const asksData = data.asks
        .map(([price, size]) => ({ price: Number(price), size: Number(size) }))
        .sort((a, b) => a.price - b.price);

      const processChanges = (newArr, prevArr) =>
        newArr.map((b) => {
          const prev = prevArr.find((p) => p.price === b.price);
          let sizeChange = 'same';
          if (prev) {
            if (b.size > prev.size) sizeChange = 'size-up';
            else if (b.size < prev.size) sizeChange = 'size-down';
          } else {
            sizeChange = 'size-up';
          }
          return { ...b, sizeChange, total: 0 };
        });

      prevBids.value = JSON.parse(JSON.stringify(bids.value));
      prevAsks.value = JSON.parse(JSON.stringify(asks.value));

      bids.value = calcTotals(processChanges(bidsData, prevBids.value));
      asks.value = calcTotals(processChanges(asksData, prevAsks.value));
    }
  };

  ws.onclose = () => console.log('WebSocket closed');
});

onUnmounted(() => {
  if (ws) ws.close();
});
</script>

<style scoped>
.orderbook {
  max-width: 1000px;
  margin: 20px auto;
  background: #1a2332;
  padding: 20px;
  border-radius: 10px;
  color: white;
}
.table {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.side {
  flex: 1;
}
.row {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 6px;
  overflow: hidden;
}
.row.header {
  font-weight: bold;
  color: #8698aa;
}
.bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 6px;
  opacity: 0.2;
  z-index: 0;
}
.sell .bar {
  background-color: #ff5b5a;
}
.buy .bar {
  background-color: #00b15d;
}
.price {
  width: 100px;
  position: relative;
  z-index: 1;
}
.size,
.total {
  width: 80px;
  text-align: right;
  position: relative;
  z-index: 1;
}

/* 漲跌動畫 */
.size-up {
  animation: flashGreen 0.5s;
}
.size-down {
  animation: flashRed 0.5s;
}

@keyframes flashGreen {
  0% {
    background-color: rgba(0, 177, 93, 0.5);
  }
  100% {
    background-color: transparent;
  }
}
@keyframes flashRed {
  0% {
    background-color: rgba(255, 91, 90, 0.5);
  }
  100% {
    background-color: transparent;
  }
}
</style>
