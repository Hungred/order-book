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
        <div class="flex flex-row gap-x-2">
          <div class="w-1/2">Sell Orders</div>
          <div class="w-1/2">Buy Orders</div>
        </div>
        <div class="flex flex-row gap-x-2">
          <el-table :data="asks" stripe style="width: 50%">
            <el-table-column prop="price" label="Price">
              <template #default="scope">
                <div>{{ formatNumber(scope.row.price) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="size" label="Size">
              <template #default="scope">
                <div>{{ formatNumber(scope.row.size) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="Amount">
              <template #default="scope">
                <div>{{ formatNumber(scope.row.amount) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="Total">
              <template #default="scope"
                ><div class="bar-wrapper">
                  <div
                    class="bar bg-green-700"
                    :style="{
                      width: (scope.row.total / maxTotal) * 100 + '%',
                    }"
                  ></div>
                  <span>{{ scope.row.total.toLocaleString() }}</span>
                </div></template
              >
            </el-table-column>
          </el-table>
          <el-table :data="bids" stripe style="width: 50%">
            <el-table-column prop="price" label="Price">
              <template #default="scope">
                <div>{{ formatNumber(scope.row.price) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="size" label="Size">
              <template #default="scope">
                <div>{{ formatNumber(scope.row.size) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="Amount">
              <template #default="scope">
                <div>{{ formatNumber(scope.row.amount) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="Total">
              <template #default="scope"
                ><div class="bar-wrapper">
                  <div
                    class="bar bg-red-700"
                    :style="{
                      width: (scope.row.total / maxTotal) * 100 + '%',
                    }"
                  ></div>
                  <span>{{ scope.row.total.toLocaleString() }}</span>
                </div></template
              >
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="info">
      <h3>實作說明</h3>
      <ul>
        <li>透過 Binance WebSocket 取得多幣種的即時買賣盤資料 (Depth 5)</li>
        <li>計算每筆委託的 Amount（Price × Size）與累積總量（Total）</li>
        <li>依照最大累積總量（maxTotal）顯示深度進度條，呈現占比</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';

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

      bids.value = calcTotalsAndAmounts(
        processChanges(bidsData, prevBids.value)
      );
      asks.value = calcTotalsAndAmounts(
        processChanges(asksData, prevAsks.value)
      );
    }
  };
};

// 當 Tab 切換時重新連線
watch(activeTab, (newTab) => {
  if (ws) ws.close();
  connectWs(newTab);
});

onMounted(() => {
  connectWs(activeTab.value);
});

onUnmounted(() => {
  if (ws) ws.close();
});

const calcTotalsAndAmounts = (array) => {
  let total = 0;
  return array.map((item) => {
    total += item.size;
    return {
      ...item,
      total, // 累積總量
      amount: item.price * item.size, // 單筆成交量
    };
  });
};

const formatNumber = (n) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

const maxTotal = computed(() => {
  const allTotals = [
    ...bids.value.map((b) => b.total),
    ...asks.value.map((a) => a.total),
  ];

  return allTotals.length ? Math.max(...allTotals) : 0;
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
::v-deep(.el-tabs__item) {
  color: white;
}
.bar-wrapper {
  position: relative;
  width: 100%;
  line-height: 20px;
}

.bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 20px;
  opacity: 0.2;
  transition: width 0.3s ease;
}

.bar-wrapper span {
  position: relative;
  z-index: 2;
}
</style>
