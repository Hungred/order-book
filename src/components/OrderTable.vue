<template>
  <div class="order-table">
    <el-table :data="rows" stripe style="width: 100%">
      <el-table-column label="Price">
        <template #default="scope">
          <div :class="side === 'buy' ? 'text-[#00b15d]' : 'text-[#ff5b5a]'">
            {{ format(scope.row.price) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Amount">
        <template #default="scope">
          <div>{{ format(scope.row.amount) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Total">
        <template #default="scope">
          <div>{{ format(scope.row.total ?? scope.row.amount) }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderBookStore } from '@/stores/orderBook';

const props = defineProps({ side: { type: String, default: 'buy' } });

const store = useOrderBookStore();
const { bids, asks } = storeToRefs(store);

const rows = computed(() =>
  props.side === 'buy' ? bids.value.slice(0, 8) : asks.value.slice(0, 8)
);

const format = (n) =>
  Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
</script>

<style scoped>
.order-table {
  background: #0f1724;
  color: #f0f4f8;
  padding: 8px;
  border-radius: 6px;
}
</style>
