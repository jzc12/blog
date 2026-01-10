<template>
  <div class="tools">

    <!-- HTML 转 Markdown -->
    <section class="tool">
      <h2>HTML 转 Markdown</h2>

      <textarea v-model="htmlInput" rows="6" placeholder="粘贴 HTML，这里会自动转换为 Markdown">
      </textarea>

      <pre v-if="htmlToMdOutput">{{ htmlToMdOutput }}</pre>
    </section>

    <!-- Markdown 预览 -->
    <section class="tool">
      <h2>Markdown 预览</h2>

      <textarea v-model="md" rows="6" placeholder="# Hello Markdown">
      </textarea>

      <div class="preview" v-html="renderedMd"></div>
    </section>

  </div>
</template>

<script>
import { marked } from 'marked'
import TurndownService from 'turndown'
import DOMPurify from 'dompurify'

let debounceTimer = null

export default {
  name: 'SimpleTools',

  data() {
    return {
      htmlInput: '',
      htmlToMdOutput: '',
      md: ''
    }
  },

  computed: {
    renderedMd() {
      const rawHtml = marked.parse(this.md || '')
      return DOMPurify.sanitize(rawHtml)
    }
  },

  watch: {
    htmlInput(newVal) {
      clearTimeout(debounceTimer)

      if (!newVal.trim()) {
        this.htmlToMdOutput = ''
        this.md = ''
        return
      }

      debounceTimer = setTimeout(() => {
        this.convertHtmlToMd()
      }, 300)
    }
  },

  methods: {
    convertHtmlToMd() {
      try {
        const turndownService = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
          emDelimiter: '*'
        })

        // 移除无关标签
        turndownService.remove(['script', 'style'])

        const md = turndownService.turndown(this.htmlInput)

        this.htmlToMdOutput = md
        this.md = md
      } catch (e) {
        this.htmlToMdOutput = 'HTML 转换失败'
      }
    }
  }
}
</script>

<style scoped>
@import '../css/toolsList.css'
</style>
