<template>
  <div class="app">
    <SideMenu />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SideMenu from './components/SideMenu.vue';
</script>

<style>
.app {
  display: flex;
  height: 100vh;
}
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
