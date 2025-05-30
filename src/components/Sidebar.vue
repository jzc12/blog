

<template>

  <div class="Sidebar" :class="{ collapsed }">

    <button class="toggle-btn" @click="toggleSidebar">≡</button>
    <h2 v-show="!collapsed">zc 的博客</h2>

    <div class="nav">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
      >
        <div class="nav-li"  :data-icon="item.icon">
          {{ item.icon }} {{ item.text }}
          <div class="nav-span">
            <span v-if="!collapsed">{{ item.count }}</span>
          </div>
        </div>
      </router-link>
    </div>


    <div class="profile">
      <img src="../assets/avatar.png" alt="头像">
      <p v-show="!collapsed">0 文章 | 0 分类 | 0 标签</p>
      <div class="contact-links">
        <a href="https://github.com/jzc12" target="_blank" title="GitHub">🐙 GitHub</a>
        <a href="mailto:1765714473@qq.com" title="Email">📧 Email</a>
      </div>
    </div>

    <div class="footer" v-show="!collapsed">
      <p>© 2025 去感受、去发现</p>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      collapsed: false,
      navItems: [
        { name: 'home', icon: '🏠', text: '首页', count: '' },
        { name: 'about', icon: '👤', text: '关于', count: '' },
        { name: 'category', icon: '📂', text: '分类', count: '12' },
        { name: 'tags', icon: '🏷️', text: '标签', count: '12' }
      ]
    }
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
    checkScreenSize() {
      this.collapsed = window.innerWidth <= 768;
    }
  }
}
</script>

<style>
@import "../css/sidebar.css";
</style>
