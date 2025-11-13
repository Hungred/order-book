<template>
  <div class="sidemenu">
    <h2>Order Book Demo</h2>
    <ul>
      <li>
        <router-link to="/mock">Mock Data</router-link>
      </li>
      <li>
        <router-link to="/real">Real WebSocket</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup></script>

<style scoped>
.sidemenu {
  width: 200px;
  background-color: #1a2332;
  color: #f0f4f8;
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 10px 0;
}
a {
  color: inherit;
  text-decoration: none;
}
a.router-link-active {
  font-weight: bold;
  color: #00b15d;
}
</style>
