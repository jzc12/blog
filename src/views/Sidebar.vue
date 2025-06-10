<template>
  <!-- 侧边栏主容器 -->
  <div class="Sidebar" :class="{ collapsed }">
    <!-- 折叠按钮 -->
    <button class="toggle-btn" @click="toggleSidebar" :title="collapsed ? '展开侧边栏' : '收起侧边栏'">
      {{ collapsed ? '>' : '<' }}
    </button>

    <!-- 博客标题 -->
    <h2 v-show="!collapsed">zc 的博客</h2>

    <!-- 导航菜单 -->
    <div class="nav">
      <router-link v-for="item in navItems" 
                   :key="item.name" 
                   :to="{ name: item.name }"
                   :title="item.text">
        <div class="nav-li">
          <component :is="item.icon" class="icon" />
          <span v-if="!collapsed">{{ item.text }}</span>
          <div class="nav-span" v-if="!collapsed && item.count">
            <span>{{ item.count }}</span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- 文章大纲 -->
    <div v-if="!collapsed && outline.length > 0" class="outline-container">
      <ul class="outline-list">
        <OutlineItem 
          v-for="heading in outline" 
          :key="heading.id" 
          :heading="heading" 
          @scroll-to="scrollToHeading" 
        />
      </ul>
    </div>

    <!-- 个人信息区域 -->
    <div class="profile">
      <img src="../assets/avatar.png" alt="头像" title="个人头像">
      <p v-show="!collapsed">{{ articleCount }} 文章 | 0 标签</p>
      <div class="contact-links">
        <a href="https://github.com/jzc12" 
           target="_blank" 
           title="访问我的GitHub">
          <component :is="iconMap.github" class="icon" />
          <span v-if="!collapsed">GitHub</span>
        </a>
        <a href="mailto:1765714473@qq.com" 
           title="发送邮件给我">
          <component :is="iconMap.mail" class="icon" />
          <span v-if="!collapsed">Email</span>
        </a>
      </div>
    </div>

    <!-- 页脚版权信息 -->
    <div class="footer" v-show="!collapsed">
      <p>© 2025 去感受、去发现</p>
    </div>
  </div>
</template>

<script>
import { icons } from '../utils/icon.js';
import { getAllPublicMessageCount } from '../utils/supabase';
import OutlineItem from './OutlineItem.vue';

export default {
  name: 'Sidebar',
  components: { OutlineItem },
  
  props: {
    outline: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      collapsed: false,
      articleCount: 0,
      messageCount: 0,
      // 导航菜单配置
      navItems: [
        { name: 'home', icon: icons.home, text: '首页', count: '' },
        { name: 'about', icon: icons.about, text: '关于', count: '' },
        { name: 'category', icon: icons.category, text: '目录', count: '0' },
        { name: 'message', icon: icons.message, text: '留言', count: '0' },
        { name: 'settings', icon: icons.settings, text: '设置', count: '' }
      ]
    };
  },

  computed: {
    iconMap() {
      return icons;
    }
  },

  methods: {
    // 切换侧边栏展开/收起状态
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },

    // 检查屏幕尺寸并自动调整侧边栏状态
    checkScreenSize() {
      this.collapsed = window.innerWidth <= 980;
    },

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

    // 滚动到指定标题
    scrollToHeading(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
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
@import "../css/sidebar.css";
@import "../css/icons.css";
@import "../css/outline.css";
</style>
