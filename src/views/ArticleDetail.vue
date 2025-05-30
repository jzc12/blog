<template>
  <div class="article-meta" v-if="article">
    <div class="meta-info">
      <span class="date">发布于: {{ article.date }}</span>
      <span v-if="article.updated" class="updated">更新于: {{ article.updated }}</span>
      <span class="category">分类: {{ article.category }}</span>
    </div>
    <div ref="markdownContent" style="display: none">{{ article.content }}</div>
  </div>
</template>

<script>
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
    }
  }
}
</script>

<style scoped>
.article-meta {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.meta-info {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.9em;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}
</style>