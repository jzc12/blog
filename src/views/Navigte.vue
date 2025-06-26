<template>
  <!-- 侧边栏主容器 -->
  <div class="Navigte">
    <!-- 博客标题 -->
    <h2 v-show="showTitle">zc 的博客</h2>

    <!-- 导航菜单 -->
    <div class="nav">
      <router-link v-for="item in navItems" :key="item.name" :to="{ name: item.name }" :title="item.text">
        <div class="nav-li">
          <component :is="item.icon" class="icon" />
          <span>{{ item.text }}</span>
          <div class="nav-span" v-if="item.count">
            <span>{{ item.count }}</span>
          </div>
        </div>
      </router-link>
    </div>

  </div>
</template>

<script>
import { icons } from '../utils/icon.js';
import { getAllPublicMessageCount } from '../utils/supabase.js';

export default {
  name: 'Navigte',

  props: {
    outline: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      articleCount: 0,
      messageCount: 0,
      showTitle: true,
      // 导航菜单配置
      navItems: [
        { name: 'home', icon: icons.home, count: '' },
        { name: 'about', icon: icons.about, count: '' },
        { name: 'category', icon: icons.category, count: '0' },
        { name: 'message', icon: icons.message, count: '0' },
        { name: 'settings', icon: icons.settings, count: '' }
      ]
    };
  },

  computed: {
    iconMap() {
      return icons;
    }
  },

  methods: {
    // 统计文章数量
    async countArticles() {
      const articles = import.meta.glob('../articles/*.md');
      const count = Object.keys(articles).length;
      this.articleCount = count;
      this.navItems[2].count = count.toString();
    },

    // 获取留言数量
    async countMessages() {
      this.messageCount = await getAllPublicMessageCount();
      this.navItems[3].count = this.messageCount.toString();
    },

    // 检查屏幕尺寸并自动调整标题状态
    checkScreenSize() {
      this.showTitle = window.innerWidth > 768;
    },

  },

  // 生命周期钩子
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
    this.countArticles();
    this.countMessages();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  }
};
</script>

<style scoped>
@import "../css/navigte.css";
@import "../css/icons.css";
@import "../css/outline.css";
</style>
