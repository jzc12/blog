// ========================== 导航栏组件 ==============================
<template>
  <!-- 侧边栏主容器 -->
  <div class="Navigte" :class="$attrs.class">
    <!-- 博客标题 -->
    <h2 v-tooltip="'你好 (◕‿◕✿) '">zc 的博客<span class="cursor">_</span></h2>

    <!-- 导航菜单 -->
    <div class="nav">
      <router-link v-for="item in navItems" :key="item.name" :to="{ name: item.name }" v-tooltip="item.text">
        <div class="nav-li">
          <component :is="item.icon" class="icon" />
          <span></span>
          <!-- <div class="nav-span" v-if="item.count">
            <span>{{ item.count }}</span>
          </div> -->
        </div>
      </router-link>
    </div>

  </div>
</template>

<script>
// ========================== 依赖导入 ==============================
import { icons } from '../utils/icon.js';
import { getAllPublicMessageCount } from '../utils/supabase.js';

export default {
  name: 'Navigte',
  inheritAttrs: false,

  // ========================== 组件属性定义 ==============================
  props: {
    // 文章大纲数据
    outline: {
      type: Array,
      default: () => []
    }
  },

  // ========================== 组件数据 ==============================
  data() {
    return {
      articleCount: 0,          // 文章总数
      messageCount: 0,          // 留言总数
      showTitle: true,          // 是否显示标题
      // 导航菜单配置项
      navItems: [
        { name: 'home', icon: icons.home, count: '', text: "首页" },           // 首页
        { name: 'about', icon: icons.about, count: '', text: "关于" },         // 关于
        { name: 'category', icon: icons.category, count: '0', text: "分类" },  // 分类
        { name: 'message', icon: icons.message, count: '0', text: "留言" },    // 留言
        { name: 'settings', icon: icons.settings, count: '', text: "设置" }    // 设置
      ]
    };
  },

  // ========================== 计算属性 ==============================
  computed: {
    iconMap() {
      return icons;
    }
  },

  // ========================== 方法定义 ==============================
  methods: {
    // 统计文章数量并更新导航菜单
    async countArticles() {
      const articles = import.meta.glob('../articles/*.md');
      const count = Object.keys(articles).length;
      this.articleCount = count;
      this.navItems[2].count = count.toString();
    },

    // 获取并更新留言数量
    async countMessages() {
      this.messageCount = await getAllPublicMessageCount();
      this.navItems[3].count = this.messageCount.toString();
    },

    // 根据屏幕尺寸调整标题显示状态
    checkScreenSize() {
      this.showTitle = window.innerWidth > 768;
    },
  },

  // ========================== 生命周期钩子 ==============================
  mounted() {
    // 初始化组件
    this.checkScreenSize();                                      // 检查屏幕尺寸
    window.addEventListener('resize', this.checkScreenSize);     // 监听窗口大小变化
    this.countArticles();                                        // 统计文章数量
    this.countMessages();                                        // 获取留言数量
  },

  beforeDestroy() {
    // 清理事件监听器
    window.removeEventListener('resize', this.checkScreenSize);
  }
};
</script>

<style scoped>
/* ========================== 样式导入 ============================== */
@import "../css/navigte.css";
@import "../css/icons.css";
@import "../css/outline.css";
</style>
