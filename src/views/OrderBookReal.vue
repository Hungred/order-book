<template>
  <div class="orderbook">
    <h2>Order Book (Real)</h2>

    <el-tabs v-model="activeTab">
      <el-tab-pane
        v-for="symbol in symbols"
        :key="symbol"
        :label="symbol"
        :name="symbol"
      >
        <OrderTable :bids="bids" :asks="asks" />
      </el-tab-pane>
    </el-tabs>

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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import OrderTable from './OrderTable.vue';

const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT']; // 幣別陣列
const activeTab = ref('BTCUSDT'); // 預設 Tab
const bids = ref([]);
const asks = ref([]);
const prevBids = ref([]);
const prevAsks = ref([]);
let ws = null;

const connectWs = (symbol) => {
  if (ws) ws.close();
  bids.value = [];
  asks.value = [];
  prevBids.value = [];
  prevAsks.value = [];

  ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth5@100ms`
  );

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
};

// 當 Tab 切換時重新連線
watch(activeTab, (newTab) => {
  connectWs(newTab);
});

onMounted(() => {
  connectWs(activeTab.value);
});

onUnmounted(() => {
  if (ws) ws.close();
});

const calcTotals = (array) => {
  let total = 0;
  return array.map((item) => {
    total += item.size;
    return { ...item, total };
  });
};
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
::v-deep(.el-tabs__item) {
  color: white;
}
</style>
