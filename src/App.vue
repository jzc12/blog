<template>
  <div class="app-container">
    <!--div class="overlay"></div>-->
    <Sidebar :outline="isMarkdownRoute ? articleOutline : []" />
    <main class="content">
      <router-view v-slot="{ Component }">
        <template v-if="isMarkdownRoute">
          <component :is="Component" @content-loaded="handleContentLoaded" ref="currentView" />
          <div class="markdown-body" v-html="renderedContent"></div>
        </template>
        <component v-else :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<script>
import Sidebar from './views/Sidebar.vue'
import { renderMarkdown } from './utils/markdown'

export default {
  components: { Sidebar },
  data() {
    return {
      renderedContent: '',
      articleOutline: []
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
      }
    }
  }
}
</script>

<style>
@import "./css/style.css";
@import "./css/lapis.css";
@import "./css/prism-theme.css";
</style>