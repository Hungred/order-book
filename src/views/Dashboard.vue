<template>
  <div class="dashboard">
    <div class="top">
      <OrderStats />
    </div>
    <!-- 上方兩欄: Sell & Buy Orders -->
    <div class="main grid grid-cols-2 gap-4 mb-4">
      <div>
        <h3 class="text-center font-semibold mb-2">Sell Orders</h3>
        <OrderTable side="sell" />
      </div>
      <div>
        <h3 class="text-center font-semibold mb-2">Buy Orders</h3>
        <OrderTable side="buy" />
      </div>
    </div>

    <!-- 下方兩欄: Input + Trade History -->
    <div class="center bg-gray-100 rounded">
      <OrderInput @place="placeOrder" />
      <TradeHistory />
    </div>
    <div class="info">
      <h3>實作說明</h3>
      <ul class="list-disc pl-5">
        <li>
          使用假資料模擬交易所的買賣盤快照與即時更新（下一步接上真實的 WebSocket
          資料）
        </li>
        <li>
          以 setInterval 模擬 WebSocket 持續接收市場訂單，更新合併至現有買賣盤
        </li>
        <li>將模擬的買賣盤資料合併進 store（Pinia）中，並依價格重新排序</li>
        <li>執行撮合引擎（matchEngine）模擬真實的買賣單成交邏輯</li>
        <li>Order Table 只顯示最新 8 筆市場成交（模擬交易所最新成交列表）</li>
        <li>
          Order Input 允許使用者下單，並立即進入撮合流程，並更新買賣盤與交易紀錄
        </li>
        <li>最新的買賣盤 / 成交紀錄透過 Pinia store 即時更新</li>
        <li>
          使用 Element Plus 、 Tailwind CSS 排版
          layout（左：Buy/Sell，右：Trades，中：OrderInput）
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import useOrderBook from '@/composables/useOrderBook.js';
import OrderTable from '@/components/OrderTable.vue';
import OrderInput from '@/components/OrderInput.vue';
import OrderStats from '@/components/OrderStats.vue';
import TradeHistory from '@/components/TradeHistory.vue';

const { start, stop, place } = useOrderBook();
onMounted(() => start());
onUnmounted(() => stop());

function placeOrder(order) {
  place(order);
}
</script>

<style lang="css" scoped>
.center {
  background-color: #f5f5f5;
}
</style>
