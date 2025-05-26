import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-vue-markdown'

export default defineConfig({
  base: '/blog/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown()
  ],
  server: {
    port: 5000,
    open: true,
    historyApiFallback: true,
  },
})
