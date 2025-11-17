<template>
  <div
    class="trade-history p-4 bg-gray-900 text-white rounded mt-2 max-h-64 overflow-auto"
  >
    <h3 class="mb-2">Recent Trades</h3>
    <el-table :data="latestTrades" stripe style="width: 100%">
      <el-table-column prop="price" label="Price"> </el-table-column>
      <el-table-column prop="amount" label="Amount"> </el-table-column>
      <el-table-column label="Time">
        <template #default="scope">
          <div>{{ new Date(scope.row.time).toLocaleTimeString() }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderBookStore } from '@/stores/orderBook';

const store = useOrderBookStore();
const { trades } = storeToRefs(store);
const latestTrades = computed(() => {
  // 取最新 10 筆
  return trades.value.slice(0, 10);
});
</script>
