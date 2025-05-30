// vite.config.js

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItPrism from 'markdown-it-prism'

// 配置 markdown-it
const markdown = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(MarkdownItAnchor)
  .use(MarkdownItPrism)

export default defineConfig({
  base: '/blog/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      markdownIt: markdown,
      wrapperClasses: 'markdown-body'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  assetsDir: 'static',
  server: {
    historyApiFallback: true,
  },
})
