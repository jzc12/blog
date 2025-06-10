<template>
  <div class="app-container">
    <!--div class="overlay"></div>-->
    <Sidebar :outline="isMarkdownRoute ? articleOutline : []" @scroll-to="handleScrollToHeading" />
    <main class="content" ref="mainContentRef">
      <router-view v-slot="{ Component }">
        <template v-if="isMarkdownRoute">
          <component :is="Component" @content-loaded="handleContentLoaded" ref="currentView" />
          <div class="markdown-body" v-html="renderedContent"></div>
          <div class="tip-button-wrapper">
            <button @click="goToTipPage" class="tip-button">打赏</button>
          </div>
        </template>
        <component v-else :is="Component" />
      </router-view>

      <BackToTopButton v-if="isMarkdownRoute" :target-ref="mainContentRef" />

    </main>
  </div>
</template>

<script>
import Sidebar from './views/Sidebar.vue'
import { renderMarkdown } from './utils/markdown'
import { useSettingsStore } from './stores/settings'
import { watch, nextTick, ref, onMounted } from 'vue'
import BackToTopButton from './views/BackToTopButton.vue'

export default {
  components: { Sidebar, BackToTopButton },
  data() {
    return {
      renderedContent: '',
      articleOutline: [],
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
        this.articleOutline = outline
      } else {
        this.renderedContent = '还没有内容哟~'
        this.articleOutline = []
      }
    },
    handleScrollToHeading(id) {
      const element = document.getElementById(id);
      const mainContent = this.mainContentRef.value;

      if (element && mainContent) {
        const elementRect = element.getBoundingClientRect();
        const contentRect = mainContent.getBoundingClientRect();

        const targetScrollTop = elementRect.top - contentRect.top + mainContent.scrollTop;

        const maxScrollTop = mainContent.scrollHeight - mainContent.clientHeight;

        const finalScrollTop = Math.min(targetScrollTop, maxScrollTop);

        mainContent.scrollTo({
          top: finalScrollTop,
          behavior: 'smooth'
        });
      }
    },
    getTarget() {
      return document.getElementById("back-top-target");
    },
    goToTipPage() {
      this.$router.push('/tip');
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

    const applyContentOpacity = (newOpacity) => {
      if (mainContentRef.value) {
        mainContentRef.value.style.setProperty('--content-bg-opacity', newOpacity)
      }
    }

    watch(() => settingsStore.currentFontSize, applyFontSize)
    watch(() => settingsStore.currentContentOpacity, applyContentOpacity)

    onMounted(() => {
      applyFontSize(settingsStore.currentFontSize)
      applyContentOpacity(settingsStore.currentContentOpacity)
    })

    return { settingsStore, mainContentRef }
  },
}
</script>

<style>
@import "./css/style.css";
@import "./css/lapis.css";
@import "./css/prism-theme.css";
@import "./css/animations.css";
@import "./css/layout.css";


.content {
  background-color: rgba(255, 255, 255, var(--content-bg-opacity, 1));
}

html {
  font-size: var(--global-font-size, 18px);
}
</style>