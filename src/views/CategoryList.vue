<template>
  <div class="category-container">
    <div class="h1">目录</div>

    <!-- 加载进度条 -->
    <div v-if="loading" class="loading-box">
      <div class="loading-text">加载中：{{ progress }}%</div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 加载完成后展示文章列表 -->
    <div v-else class="category-content">
      <div class="article-list">
        <router-link
          v-for="article in articles"
          :key="article.id"
          :to="{ name: 'article', params: { articleId: article.id }}"
          class="article-item"
        >
          <h2>{{ article.title }}</h2>
          <div class="article-meta">
            <span class="date">{{ article.date }}</span>
            <span class="category">{{ article.category }}</span>
          </div>
          <p class="summary">{{ article.summary }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryList',
  data() {
    return {
      articles: [],
      loading: true,
      progress: 0
    }
  },
  async created() {
    this.loading = true
    this.articles = await this.getArticles()
    this.loading = false
  },
  methods: {
    async getArticles() {
      const articleFiles = import.meta.glob('../articles/*.md')
      const paths = Object.keys(articleFiles)
      const total = paths.length
      let loaded = 0

      const articles = await Promise.all(
        paths.map(async (path) => {
          try {
            const module = await articleFiles[path]()
            const fileName = path.split('/').pop().replace('.md', '')

            return {
              id: fileName,
              title: module.frontmatter?.title || fileName,
              date: module.frontmatter?.date || '未知日期',
              category: module.frontmatter?.category || '未分类',
              summary: module.frontmatter?.summary || '暂无摘要'
            }
          } catch (error) {
            console.error(`加载文章失败: ${path}`, error)
            return null
          } finally {
            loaded++
            this.progress = Math.round((loaded / total) * 100)
          }
        })
      )

      return articles.filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  }
}
</script>

<style scoped>
@import '../css/categoryList.css';
</style>