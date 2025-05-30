<template>
  <div class="app-container">
    <div class="overlay"></div>
    <Sidebar />
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
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) { }
    }
    return ''
  }
})

export default {
  components: { Sidebar },
  data() {
    return {
      renderedContent: ''
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
        this.renderedContent = md.render(content)
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