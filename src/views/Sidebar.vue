<template>

  <div class="Sidebar" :class="{ collapsed }">

    <button class="toggle-btn" @click="toggleSidebar">≡</button>
    <h2 v-show="!collapsed">zc 的博客</h2>

    <div class="nav">
      <router-link v-for="item in navItems" :key="item.name" :to="{ name: item.name }">
        <div class="nav-li">
          <component :is="item.icon" class="icon" />
          <span v-if="!collapsed">{{ item.text }}</span>
          <div class="nav-span">
            <span v-if="!collapsed">{{ item.count }}</span>
          </div>
        </div>

      </router-link>
    </div>

    <div v-if="!collapsed && outline.length > 0" class="outline-container">
      <ul class="outline-list">
        <OutlineItem v-for="heading in outline" :key="heading.id" :heading="heading" @scroll-to="scrollToHeading" />
      </ul>
    </div>

    <div class="profile">
      <img src="../assets/avatar.png" alt="头像">
      <p v-show="!collapsed">{{ articleCount }} 文章 | 0 标签</p>
      <div class="contact-links">
        <a href="https://github.com/jzc12" target="_blank" title="GitHub">
          <component :is="iconMap.github" class="icon" />
          <span v-if="!collapsed">GitHub</span>
        </a>
        <a href="mailto:1765714473@qq.com" title="Email">
          <component :is="iconMap.mail" class="icon" />
          <span v-if="!collapsed">Email</span>
        </a>
      </div>

    </div>
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
      navItems: [
        { name: 'home', icon: icons.home, text: '首页', count: '' },
        { name: 'about', icon: icons.about, text: '关于', count: '' },
        { name: 'category', icon: icons.category, text: '目录', count: '0' },
        { name: 'message', icon: icons.message, text: '留言', count: '12' },
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
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
    checkScreenSize() {
      this.collapsed = window.innerWidth <= 980;
    },
    async countArticles() {
      const articles = import.meta.glob('../articles/*.md');
      const count = Object.keys(articles).length;
      this.articleCount = count;
      this.navItems[2].count = count.toString();
    },
    async countMessages() {
      this.messageCount = await getAllPublicMessageCount();
      this.navItems[3].count = this.messageCount.toString();
    },

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
