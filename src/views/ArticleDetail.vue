<template>
  <router-link to="/category" class="back-button">
    <i class="back-icon"></i>
    <span>返回目录</span>
  </router-link>
  <div class="article-meta" v-if="article">
    <div class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="meta-info">
        <div class="meta-item">
          <component :is="iconMap.calendar" class="icon" />
          <span class="date">{{ article.date }}</span>
        </div>
        <div class="meta-item" v-if="article.updated">
          <i class="meta-icon">🔄</i>
          <span class="updated">更新于 {{ article.updated }}</span>
        </div>
        <div class="meta-item">
          <component :is="iconMap.kanban" class="icon" />
          <span class="category">{{ article.category }}</span>
        </div>
      </div>
    </div>
    <div class="article-divider"></div>
    <div ref="markdownContent" style="display: none">{{ article.content }}</div>
  </div>
</template>

<script>
import { icons } from '../utils/icon.js';
export default {
  name: 'ArticleDetail',
  data() {
    return {
      article: null
    }
  },
  async created() {
    const articleId = this.$route.params.articleId
    this.article = await this.getArticle(articleId)
    // 通知父组件内容已更新
    this.$nextTick(() => {
      this.$emit('content-loaded', this.article.content)
    })
  },
  computed: {
    iconMap() {
      return icons;
    }
  },
  methods: {
    async getArticle(id) {
      try {
        const article = await import(`../articles/${id}.md?raw`)
        // 解析 frontmatter
        const frontmatterMatch = article.default.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
        if (frontmatterMatch) {
          const [, frontmatterStr, content] = frontmatterMatch
          const frontmatter = {}
          frontmatterStr.split('\n').forEach(line => {
            const [key, ...values] = line.split(':')
            if (key && values.length) {
              frontmatter[key.trim()] = values.join(':').trim()
            }
          })

          return {
            id,
            title: frontmatter.title || id,
            date: frontmatter.date || '未知日期',
            updated: frontmatter.updated,
            category: frontmatter.category || '未分类',
            content: content.trim()
          }
        }

        return {
          id,
          title: id,
          date: '未知日期',
          category: '未分类',
          content: article.default
        }
      } catch (error) {
        console.error('加载文章失败:', error)
        this.$router.push('/404')
      }
    },
  }
}
</script>

<style scoped>
@import '../css/articleDetail.css';
</style>