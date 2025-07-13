<template>
  <div class="app-container">
    <Navigte />
    <div class="main-content-wrapper" :class="{'three-col': isMarkdownRoute, 'single-col': !isMarkdownRoute}">
      <div class="outline-container" v-if="isMarkdownRoute">
        <OutlineItem :outline="isMarkdownRoute ? articleOutline : []" v-for="heading in articleOutline" :key="heading.id" :heading="heading" @scroll-to="handleScrollToHeading" />
      </div>
      <main class="content" :class="{ 'with-outline': isMarkdownRoute }" ref="mainContentRef">
        <router-view v-slot="{ Component }">
          <template v-if="isMarkdownRoute">
            <component :is="Component" @content-loaded="handleContentLoaded" ref="currentView" />
            <div class="markdown-body" ref="markdownContent" v-html="renderedContent"></div>
            <div class="tip-button-wrapper">
              <button @click="goToTipPage" class="tip-button">打赏</button>
            </div>
          </template>
          <component v-else :is="Component" />
        </router-view>
        <BackToTopButton v-if="isMarkdownRoute" :target-ref="mainContentRef" />
      </main>
      <Sidebar v-if="isMarkdownRoute" :content="renderedContent" />
    </div>
  </div>
</template>

<script>
import Navigte from './views/Navigte.vue'
import { renderMarkdown } from './utils/markdown'
import { useSettingsStore } from './stores/settings'
import { watch, nextTick, ref, onMounted } from 'vue'
import BackToTopButton from './views/BackToTopButton.vue'
import OutlineItem from './views/OutlineItem.vue';
import Sidebar from './views/Sidebar.vue'
import mermaid from 'mermaid'

export default {
  components: { Navigte, BackToTopButton, OutlineItem, Sidebar },
  data() {
    return {
      renderedContent: '',
      articleOutline: [],
      currentHeadingId: '',
      scrollTimeout: null,
      visitorIP: '获取中...',
      visitorRegion: '获取中...',
      currentTime: '',
      articleDate: '',
      readingTime: 0,
      articleCategory: '',
      recentArticles: [],
      timeInterval: null
    }
  },
  computed: {
    isMarkdownRoute() {
      return this.$route.name === 'article'
    }
  },
  methods: {

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

    // ========================== 点击特效实现 ==============================
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

    setupScrollHandler() {
      const content = this.$refs.mainContentRef;
      if (content) {
        content.addEventListener('scroll', this.handleScroll);
      }
    },

    handleScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      this.scrollTimeout = setTimeout(() => {
        const headings = this.$refs.mainContentRef.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const contentRect = this.$refs.mainContentRef.getBoundingClientRect();
        let currentHeading = null;
        
        for (const heading of headings) {
          const rect = heading.getBoundingClientRect();
          if (rect.top >= contentRect.top && rect.top <= contentRect.bottom) {
            currentHeading = heading;
            break;
          }
        }

        if (currentHeading && currentHeading.id !== this.currentHeadingId) {
          this.currentHeadingId = currentHeading.id;
          this.updateOutlineExpansion(this.articleOutline, currentHeading.id);
        }
      }, 150);
    },

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

    handleScrollToHeading(id) {
      const element = document.getElementById(id);
      const mainContent = this.$refs.mainContentRef;

      if (element && mainContent) {
        this.currentHeadingId = id;
        this.updateOutlineExpansion(this.articleOutline, id);

        const elementRect = element.getBoundingClientRect();
        const contentRect = mainContent.getBoundingClientRect();
        const targetScrollTop = elementRect.top - contentRect.top + mainContent.scrollTop - 60;
        const maxScrollTop = mainContent.scrollHeight - mainContent.clientHeight;
        const finalScrollTop = Math.min(targetScrollTop, maxScrollTop);
        mainContent.scrollTo({
          top: finalScrollTop,
          behavior: 'smooth'
        });
      }
    },

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

    getTarget() {
      return document.getElementById("back-top-target");
    },
    
    goToTipPage() {
      this.$router.push('/tip');
    },

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

    calculateReadingTime() {
      if (this.renderedContent) {
        const wordCount = this.renderedContent.replace(/<[^>]*>/g, '').length;
        this.readingTime = Math.ceil(wordCount / 500);
      }
    }
  },
  setup() {
    const settingsStore = useSettingsStore()
    const mainContentRef = ref(null)

    const applyFontSize = (newSize) => {
      if (document.documentElement) {
        document.documentElement.style.setProperty('--global-font-size', newSize)
      }
    }

    const applyContentOpacity = (opacity) => {
      const opacityValue = opacity / 100
      document.documentElement.style.setProperty('--content-opacity', opacityValue.toString())
    }

    watch(() => settingsStore.effectiveTheme, (newTheme) => {
      document.documentElement.setAttribute('data-theme', newTheme)
    })

    watch(() => settingsStore.currentFontSize, applyFontSize)

    watch(() => settingsStore.contentOpacity, applyContentOpacity)

    onMounted(() => {
      // 初始化主题
      document.documentElement.setAttribute('data-theme', settingsStore.effectiveTheme)
      
      // 初始化字体大小
      settingsStore.applyFontSize()
      
      // 初始化透明度
      applyContentOpacity(settingsStore.contentOpacity)
    })

    return { 
      settingsStore, 
      mainContentRef
    }
  },

  mounted() {
    this.updateCurrentTime();
    this.timeInterval = setInterval(() => this.updateCurrentTime(), 1000);
    // 绑定点击事件
    window.addEventListener('click', this.createClickEffect);
  },
}
</script>

<style>
@import "./css/style.css";
@import "./css/lapis.css";
@import "./css/prism-theme.css";
@import "./css/animations.css";
@import "./css/layout.css";
@import "./css/outline.css";
@import "./css/icons.css";

.content {
  background-color: rgba(255, 255, 255, var(--content-bg-opacity, 1));
  position: relative;
}

:root {
  font-size: var(--global-font-size, 18px) !important;
}

</style>