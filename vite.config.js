// vite.config.js

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItPrism from 'markdown-it-prism'
import svgLoader from 'vite-svg-loader';
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
    }),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    assetsDir: 'assets', // 静态资源输出目录
  },
  server: {
    historyApiFallback: true,
  },
})
