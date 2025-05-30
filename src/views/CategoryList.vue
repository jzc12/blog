<template>
  <div class="category-container">
    <h1>文章分类</h1>
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
.category-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.category-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-meta {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 0.9em;
  margin: 8px 0;
}

.summary {
  color: #666;
  line-height: 1.6;
}
</style> 