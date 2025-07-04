<template>
  <div class="app-container">
    <Navigte />
    <div class="main-content-wrapper">
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