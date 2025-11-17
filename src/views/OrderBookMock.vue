<template>
  <div class="orderbook">
    <h2>BTC-PERP Order Book</h2>

    <div class="table">
      <div class="side">
        <h3>Sell</h3>
        <div class="row header">
          <span class="price">Price</span>
          <span class="size">Size</span>
          <span class="total">Amount</span>
        </div>
        <div
          v-for="quote in bids"
          :key="quote.price"
          class="row sell"
          :class="[
            quote.priceChange === 'up'
              ? 'price-up'
              : quote.priceChange === 'down'
              ? 'price-down'
              : '',
            quote.priceChange === 'new' ? 'new' : '',
          ]"
        >
          <div
            class="bar"
            :style="{
              width: (quote.total / asks[asks.length - 1].total) * 100 + '%',
            }"
          ></div>
          <span class="price">{{ $f.formatNumber(quote.price) }}</span>
          <span
            class="size"
            :class="
              quote.sizeChange === 'up'
                ? 'size-up'
                : quote.sizeChange === 'down'
                ? 'size-down'
                : ''
            "
            >{{ $f.formatNumber(quote.size) }}</span
          >
          <span class="total">{{ $f.formatNumber(quote.amount) }}</span>
        </div>
      </div>

      <div class="side">
        <h3>Buy</h3>
        <div class="row header">
          <span class="price">Price</span>
          <span class="size">Size</span>
          <span class="total">Amount</span>
        </div>
        <div
          v-for="quote in asks"
          :key="quote.price"
          class="row buy"
          :class="[
            quote.priceChange === 'up'
              ? 'price-up'
              : quote.priceChange === 'down'
              ? 'price-down'
              : '',
            quote.priceChange === 'new' ? 'new' : '',
          ]"
        >
          <div
            class="bar"
            :style="{
              width: (quote.total / bids[bids.length - 1].total) * 100 + '%',
            }"
          ></div>
          <span class="price">{{ $f.formatNumber(quote.price) }}</span>
          <span
            class="size"
            :class="
              quote.sizeChange === 'up'
                ? 'size-up'
                : quote.sizeChange === 'down'
                ? 'size-down'
                : ''
            "
            >{{ $f.formatNumber(quote.size) }}</span
          >
          <span class="total">{{ $f.formatNumber(quote.amount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const bids = ref([]);
const asks = ref([]);

// 紀錄更新前資料
const prevBids = ref([]);
const prevAsks = ref([]);

// 建立假資料
const generateMockOrders = () => {
  const mockBids = [];
  const mockAsks = [];

  for (let i = 0; i < 10; i++) {
    const bidSize = Math.random() * 5; // 新增 size
    const askSize = Math.random() * 5;
    mockBids.push({
      price: 100 - Math.random() * 5, // 模擬價格往下浮動
      size: bidSize,
      amount: Math.random() * 2,
    });
    mockAsks.push({
      price: 100 + Math.random() * 5, // 模擬價格往上浮動
      size: askSize,
      amount: Math.random() * 2,
    });
  }

  // 價格排序
  bids.value = mockBids
    .sort((a, b) => b.price - a.price)
    .map((b) => {
      const prev = prevBids.value.find((p) => p.price === b.price);
      let priceChange = 'same';
      let sizeChange = 'same';

      if (prev) {
        if (b.price > prev.price) priceChange = 'up';
        else if (b.price < prev.price) priceChange = 'down';

        if (b.size > prev.size) sizeChange = 'up';
        else if (b.size < prev.size) sizeChange = 'down';
      } else {
        priceChange = 'new';
        sizeChange = 'new';
      }

      return { ...b, total: 0, priceChange, sizeChange };
    });
  asks.value = mockAsks
    .sort((a, b) => a.price - b.price)
    .map((b) => {
      const prev = prevAsks.value.find((p) => p.price === b.price);
      let priceChange = 'same';
      let sizeChange = 'same';

      if (prev) {
        if (b.price > prev.price) priceChange = 'up';
        else if (b.price < prev.price) priceChange = 'down';

        if (b.size > prev.size) sizeChange = 'up';
        else if (b.size < prev.size) sizeChange = 'down';
      } else {
        priceChange = 'new';
        sizeChange = 'new';
      }

      return { ...b, total: 0, priceChange, sizeChange };
    });

  // 計算累積總量
  let bidTotal = 0;
  bids.value = bids.value.map((b) => {
    bidTotal += b.size;
    return { ...b, total: bidTotal };
  });

  let askTotal = 0;
  asks.value = asks.value.map((a) => {
    askTotal += a.size;
    return { ...a, total: askTotal };
  });
};

onMounted(() => {
  generateMockOrders();

  // 每3秒更新一次假資料
  setInterval(() => {
    prevBids.value = JSON.parse(JSON.stringify(bids.value));
    prevAsks.value = JSON.parse(JSON.stringify(asks.value));
    generateMockOrders();
  }, 3000);
});
</script>
<style scoped>
.orderbook {
  max-width: 1000px;
  margin: 20px auto;
  background: #1a2332;
  padding: 20px;
  border-radius: 10px;
}
.table {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.side {
  flex: 1;
  position: relative;
}
.row {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 6px;
  transition: background-color 0.3s;
  overflow: hidden;
  .header {
    font-weight: bold;
    color: #8698aa; /* 欄位名稱顏色 */
    background-color: transparent;
  }
  .bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 6px;
    opacity: 0.2;
    z-index: 0;
    max-width: 100%;
  }
  span {
    position: relative;
    z-index: 1;
  }
}
.row:hover {
  background-color: #1e3059;
}
.price {
  width: 100px;
  text-align: left;
}
.size,
.total {
  width: 80px;
  text-align: left;
}
.sell {
  .price {
    color: #ff5b5a;
  }
  .bar {
    background-color: #ff5b5a; /* 賣單進度條 */
  }
}
.buy {
  .price {
    color: #00b15d;
  }
  .bar {
    background-color: #00b15d; /* 買單進度條 */
  }
}

.price-up {
  color: #00b15d;
  transition: color 0.5s;
}
.price-down {
  color: #ff5b5a;
  transition: color 0.5s;
}

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

.row.new {
  animation: flashRow 0.5s;
}

@keyframes flashRow {
  0% {
    background-color: rgba(0, 177, 93, 0.3);
  }
  50% {
    background-color: rgba(0, 177, 93, 0);
  }
  100% {
    background-color: rgba(0, 177, 93, 0);
  }
}
</style>
