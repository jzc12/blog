<template>
  <div class="category-container">
    <div class="h1">目录</div>
    <div class="category-content">
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
      articles: []
    }
  },
  async created() {
    this.articles = await this.getArticles()
  },
  methods: {
    async getArticles() {
      const articleFiles = import.meta.glob('../articles/*.md')
      const articles = []

      for (const path in articleFiles) {
        try {
          const module = await articleFiles[path]()
          const fileName = path.split('/').pop().replace('.md', '')
          
          articles.push({
            id: fileName,
            title: module.frontmatter?.title || fileName,
            date: module.frontmatter?.date || '未知日期',
            category: module.frontmatter?.category || '未分类',
            summary: module.frontmatter?.summary || '暂无摘要'
          })
        } catch (error) {
          console.error(`加载文章失败: ${path}`, error)
        }
      }

      // 按日期降序排序
      return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  }
}
</script>

<style scoped>
@import '../css/categoryList.css';
</style> 