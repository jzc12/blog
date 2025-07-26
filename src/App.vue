<!-- ========================== 主应用模板 ============================== -->
<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <Navigte />

    <!-- 主内容区域 -->
    <div class="main-content-wrapper" :class="{ 'three-col': isMarkdownRoute, 'single-col': !isMarkdownRoute }">
      <!-- 左侧大纲容器 -->
      <div class="outline-container" v-if="isMarkdownRoute">
        <OutlineItem :outline="isMarkdownRoute ? articleOutline : []" v-for="heading in articleOutline"
          :key="heading.id" :heading="heading" @scroll-to="handleScrollToHeading" />
      </div>

      <!-- 中间内容区域 -->
      <main class="content" :class="{ 'with-outline': isMarkdownRoute }" ref="mainContentRef">
        <router-view v-slot="{ Component }">
          <template v-if="isMarkdownRoute">
            <component :is="Component" @content-loaded="handleContentLoaded" ref="currentView" />
            <div class="markdown-body" ref="markdownContent" v-html="renderedContent"></div>
            <div class="tip-button-wrapper">
              <button @click="goToTipPage" class="tip-button">￥ 打赏</button>
            </div>
          </template>
          <component v-else :is="Component" />
        </router-view>
      </main>

      <!-- 右侧边栏 -->
      <Sidebar v-if="isMarkdownRoute" :content="renderedContent" />
    </div>

    <!-- 回到顶部按钮 -->
    <BackToTopButton v-if="isMarkdownRoute" :target-ref="getMainContentRef" />

    <!-- 网站信息footer -->
    <SiteFooter />
  </div>
</template>

<!-- ========================== 脚本逻辑 ============================== -->
<script>
// ========================== 依赖导入 ==============================
import Navigte from './views/Navigte.vue'
import { renderMarkdown } from './utils/markdown'
import { useSettingsStore } from './stores/settings'
import { watch, nextTick, ref, onMounted } from 'vue'
import BackToTopButton from './components/BackToTopButton.vue'
import OutlineItem from './views/OutlineItem.vue';
import Sidebar from './views/Sidebar.vue'
import SiteFooter from './components/SiteFooter.vue'
import mermaid from 'mermaid'

export default {
  // ========================== 组件注册 ==============================
  components: { Navigte, BackToTopButton, OutlineItem, Sidebar, SiteFooter },

  // ========================== 组件数据 ==============================
  data() {
    return {
      // 文章相关数据
      renderedContent: '',      // 渲染后的markdown内容
      articleOutline: [],       // 文章大纲
      currentHeadingId: '',     // 当前激活的标题ID
      articleDate: '',          // 文章日期
      readingTime: 0,           // 预计阅读时间
      articleCategory: '',      // 文章分类
      recentArticles: [],       // 最近文章列表

      // 时间相关
      currentTime: '',          // 当前时间
      timeInterval: null,       // 时间更新定时器

      // 滚动相关
      scrollTimeout: null,      // 滚动防抖定时器
      isNavHidden: false,       // 导航栏是否隐藏
      lastScrollTop: 0          // 上次滚动位置
    }
  },

  // ========================== 计算属性 ==============================
  computed: {
    // 判断是否为文章路由
    isMarkdownRoute() {
      return this.$route.name === 'article'
    },

    // 获取主内容容器引用
    getMainContentRef() {
      return this.$refs.mainContentRef
    }
  },

  // ========================== 方法定义 ==============================
  methods: {
    // 处理内容加载完成事件
    handleContentLoaded(content) {
      if (content) {
        const { html, outline } = renderMarkdown(content)
        this.renderedContent = html
        this.articleOutline = this.processOutline(outline)
        this.calculateReadingTime();
        this.articleDate = new Date().toLocaleDateString();
        this.articleCategory = '技术博客';
        nextTick(() => {
          mermaid.init(undefined, this.$refs.mainContentRef.querySelectorAll('.mermaid'));
          this.setupScrollHandler();
        });
      } else {
        this.renderedContent = '还没有内容哟~'
        this.articleOutline = []
      }
    },

    //  点击特效实现 
    createClickEffect(event) {
      // 创建特效容器
      const container = document.createElement('div');
      container.className = 'click-effect';
      document.body.appendChild(container);

      // 定义粒子颜色集
      const colors = [
        '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C',
        '#FF7F50', '#00CED1', '#FF69B4', '#7B68EE', '#32CD32'
      ];

      // 生成粒子
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-effect-particle';

        // 设置粒子位置为鼠标点击位置
        particle.style.left = `${event.clientX}px`;
        particle.style.top = `${event.clientY}px`;

        // 随机设置粒子颜色和发光效果
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 10px ${color}`;

        // 随机设置粒子大小
        const size = Math.random() * 20 + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // 计算粒子运动轨迹
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        // 应用动画效果
        particle.style.animation = 'particle-animation 0.6s ease-out forwards';
        particle.style.transform = `translate(${vx}px, ${vy}px) scale(0)`;

        container.appendChild(particle);
      }

      // 动画结束后清理DOM
      setTimeout(() => {
        document.body.removeChild(container);
      }, 1000);
    },

    //  大纲处理相关 
    // 处理大纲数据，设置初始展开状态
    processOutline(outline) {
      const processNode = (node) => {
        node.expanded = false;
        if (node.children) {
          node.children = node.children.map(processNode);
        }
        return node;
      };
      return outline.map(processNode);
    },

    //  滚动处理相关 
    // 设置滚动事件监听器
    setupScrollHandler() {
      const content = this.$refs.mainContentRef;
      if (content) {
        content.addEventListener('scroll', this.handleScroll);
      }
      window.addEventListener('scroll', this.handleWindowScroll);
    },

    // 处理内容区域滚动事件
    handleScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      this.scrollTimeout = setTimeout(() => {
        const contentElement = this.$refs.mainContentRef;
        if (!contentElement) return;

        // 处理导航栏隐藏逻辑
        this.handleNavVisibility(contentElement);

        // 获取所有标题元素
        const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) return;

        // 计算当前可见的标题
        const contentTop = contentElement.getBoundingClientRect().top;
        let currentHeading = null;
        let minDistance = Infinity;

        // 找到距离当前滚动位置最近的标题
        for (const heading of headings) {
          const rect = heading.getBoundingClientRect();
          const distance = Math.abs(rect.top - contentTop - 100); // 100px 偏移量

          if (distance < minDistance && rect.top - contentTop <= 200) {
            minDistance = distance;
            currentHeading = heading;
          }
        }

        // 更新当前激活的标题
        if (currentHeading && currentHeading.id !== this.currentHeadingId) {
          this.currentHeadingId = currentHeading.id;
          this.updateOutlineExpansion(this.articleOutline, currentHeading.id);
        }
      }, 150);
    },

    //  大纲展开控制 
    // 更新大纲展开状态
    updateOutlineExpansion(outline, targetId, isParentOfTarget = false) {
      let found = false;

      for (const item of outline) {
        if (item.id === targetId) {
          found = true;
        }

        if (item.children && item.children.length > 0) {
          const containsTarget = this.updateOutlineExpansion(item.children, targetId, true);
          if (containsTarget) {
            item.expanded = true;
            found = true;
          } else if (!isParentOfTarget) {
            item.expanded = false;
          }
        }
      }

      if (!isParentOfTarget && !found) {
        for (const item of outline) {
          item.expanded = false;
        }
      }

      return found;
    },

    //  大纲跳转功能 
    // 处理大纲点击跳转到指定标题
    handleScrollToHeading(id) {
      const element = document.getElementById(id);
      const mainContent = this.$refs.mainContentRef;

      if (element && mainContent) {
        // 更新当前标题ID和大纲展开状态
        this.currentHeadingId = id;
        this.updateOutlineExpansion(this.articleOutline, id);

        // 方法1: 直接使用scrollIntoView
        try {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        } catch (error) {

          // 备用方法：手动计算滚动位置
          try {
            const elementTop = element.offsetTop;
            const targetScrollTop = elementTop - 80;

            mainContent.scrollTo({
              top: targetScrollTop,
              behavior: 'smooth'
            });
          } catch (manualError) {
          }
        }
      }
    },

    //  生命周期钩子 
    // 组件销毁前清理事件监听器
    beforeDestroy() {
      if (this.$refs.mainContentRef) {
        this.$refs.mainContentRef.removeEventListener('scroll', this.handleScroll);
      }
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      // 移除点击事件监听
      window.removeEventListener('click', this.createClickEffect);
    },

    //  工具方法 
    // 获取回到顶部目标元素
    getTarget() {
      return document.getElementById("back-top-target");
    },

    // 跳转到打赏页面
    goToTipPage() {
      this.$router.push('/tip');
    },

    //  时间相关方法 
    // 更新当前时间显示
    updateCurrentTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },

    //  文章相关方法 
    // 计算文章预计阅读时间
    calculateReadingTime() {
      if (this.renderedContent) {
        const wordCount = this.renderedContent.replace(/<[^>]*>/g, '').length;
        this.readingTime = Math.ceil(wordCount / 500);
      }
    },


  },

  // ========================== Composition API 设置 ==============================
  setup() {
    // 获取设置store
    const settings = useSettingsStore()
    const mainContentRef = ref(null)

    // 应用内容透明度
    const applyContentOpacity = (opacity) => {
      const opacityValue = opacity / 100
      document.documentElement.style.setProperty('--content-opacity', opacityValue.toString())
    }

    // 监听主题变化
    watch(() => settings.effectiveTheme, (newTheme) => {
      document.documentElement.setAttribute('data-theme', newTheme)
      settings.backgroundColor = newTheme === 'light' ? '#a1c2b8' : '#436273'
      settings.applyBackground()
    })

    // 监听字体大小变化
    watch(() => settings.fontSizeIndex, () => {
      settings.applyFontSize()
    })

    // 监听内容透明度变化
    watch(() => settings.contentOpacity, applyContentOpacity)

    // 监听背景类型变化
    watch(() => settings.backgroundType, (newType) => {
      if (newType === 'image') {
        settings.contentOpacity = 80
      } else if (newType === 'color') {
        settings.contentOpacity = 56
      }
      settings.applyBackground()
    })

    // 监听背景颜色变化
    watch(() => settings.backgroundColor, () => settings.applyBackground())

    // 组件挂载时的初始化
    onMounted(() => {
      // 初始化主题
      document.documentElement.setAttribute('data-theme', settings.effectiveTheme)

      // 初始化透明度
      applyContentOpacity(settings.contentOpacity)

      // 初始化背景
      settings.initTheme(); // 激活主题系统
      settings.applyBackground(); // 应用背景
    })

    // 返回给模板使用的数据
    return {
      settings,
      mainContentRef
    }
  },

  // ========================== 组件挂载钩子 ==============================
  mounted() {
    // 启动时间更新定时器
    this.updateCurrentTime();
    this.timeInterval = setInterval(() => this.updateCurrentTime(), 1000);

    // 绑定全局点击特效事件
    window.addEventListener('click', this.createClickEffect);

    // 确保滚动监听在所有页面都生效
    this.$nextTick(() => {
      this.setupScrollHandler();
    });
  }
}
</script>

<!-- ========================== 样式定义 ============================== -->
<style>
/* 导入基础样式文件 */
@import "./css/style.css";
/* 主要样式 */
@import "./css/lapis.css";
/* Lapis主题样式 */
@import "./css/code-blocks.css";
/* 代码块样式 */
@import "./css/prism-theme.css";
/* 代码高亮主题 */
@import "./css/animations.css";
/* 动画效果 */
@import "./css/layout.css";
/* 布局样式 */
@import "./css/outline.css";
/* 大纲样式 */
@import "./css/icons.css";
/* 图标样式 */

/* 内容区域自定义样式 */

.content {
  background-color: rgba(255, 255, 255, var(--content-bg-opacity, 1));
  position: relative;
}

:root {
  font-size: var(--global-font-size);
}
</style>