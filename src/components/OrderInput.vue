<template>
  <div class="order-input p-4 bg-gray-800 rounded">
    <h3 class="text-white mb-2">Place Order</h3>
    <div class="flex gap-2 mb-2 items-center">
      <el-select v-model="side" clearable placeholder="请选择">
        <el-option :key="'buy'" :label="'Buy'" :value="'buy'"> </el-option>
        <el-option :key="'sell'" :label="'Sell'" :value="'sell'"> </el-option>
      </el-select>
      <span class="text-white">Price: </span>
      <el-input placeholder="请输入價錢" v-model="price" clearable> </el-input>
      <span class="text-white">Amount: </span>
      <el-input placeholder="请输入數量" v-model="amount" clearable> </el-input>
    </div>
    <div class="flex justify-center">
      <button
        @click="submitOrder"
        class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
      >
        Place
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({});
const emit = defineEmits(['place']);

const side = ref('buy');
const price = ref(0);
const amount = ref(0);

function submitOrder() {
  if (!price.value || !amount.value) return;
  const order = {
    id: Date.now() + Math.random(),
    side: side.value,
    price: price.value,
    amount: amount.value,
  };
  emit('place', order);
  price.value = 0;
  amount.value = 0;
}
</script>

<style scoped>
.order-input input {
  background: #1f2937;
  color: #fff;
}
</style>
