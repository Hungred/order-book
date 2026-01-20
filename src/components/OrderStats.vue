<template>
  <div class="order-stats p-4 bg-gray-900 text-white rounded mb-4">
    <div class="flex justify-between">
      <div>Total Bids(買單總量): {{ totalBids }}</div>
      <div>Total Asks(賣單總量): {{ totalAsks }}</div>
      <div>Last Trade(最後成交價): {{ lastTradePrice }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useOrderBookStore } from '@/stores/orderBook';
import { storeToRefs } from 'pinia';

const store = useOrderBookStore();
const { bids, asks, trades } = storeToRefs(store);

const totalBids = computed(() =>
  bids.value.reduce((sum, o) => sum + Number(o.amount), 0).toFixed(2)
);
const totalAsks = computed(() =>
  asks.value.reduce((sum, o) => sum + Number(o.amount), 0).toFixed(2)
);
const lastTradePrice = computed(() => trades.value[0]?.price ?? '-');
</script>
