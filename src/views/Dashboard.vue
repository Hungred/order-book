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
