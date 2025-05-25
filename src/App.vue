<template>
  <div class="app-container">
    <div class="overlay"></div>
    <Sidebar />
    <main class="content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  components: { Sidebar }
}
</script>

<style>
@import "./css/style.css";
</style>