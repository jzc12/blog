<template>
  <div class="category-container">
    <!-- 页面标题 -->
    <div class="h1">
      <i class="fas fa-folder-open"></i>
      文章目录
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-box">
      <div class="loading-text">
        <i class="fas fa-circle-notch"></i>
        正在加载文章：{{ progress }}%
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 文章列表 -->
    <TransitionGroup 
      v-else-if="articles.length" 
      name="list" 
      tag="div" 
      class="category-content"
    >
      <div class="article-list">
        <router-link
          v-for="article in sortedArticles"
          :key="article.id"
          :to="{ name: 'article', params: { articleId: article.id }}"
          class="article-item"
        >
          <div class="article-header">
            <h3 class="article-title">{{ article.title || article.id }}</h3>
            <div class="category-tag">
              <i class="fas fa-tag"></i>
              {{ article.category }}
            </div>
            <div class="date-info">
              <i class="far fa-calendar-alt"></i>
              <span>{{ article.date }}</span>
            </div>
          </div>
          <p class="summary">{{ article.summary }}</p>
        </router-link>
      </div>
    </TransitionGroup>

    <!-- 无文章提示 -->
    <div v-else class="no-articles">
      <i class="far fa-folder-open"></i>
      暂无文章
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import fm from 'front-matter'
import dayjs from 'dayjs'

export default {
  name: 'CategoryList',
  
  setup() {
    const articles = ref([])
    const loading = ref(true)
    const progress = ref(0)

    // 排序后的文章列表
    const sortedArticles = computed(() => {
      return [...articles.value].sort((a, b) => {
        // 首先按日期排序
        const dateCompare = new Date(b.date) - new Date(a.date)
        if (dateCompare !== 0) return dateCompare
        // 如果日期相同，按标题排序
        return a.title.localeCompare(b.title)
      })
    })

    // 获取文章列表
    const getArticles = async () => {
      loading.value = true
      progress.value = 0
      
      try {
        const articleFiles = import.meta.glob('@/articles/*.md', { as: 'raw' })
        const paths = Object.keys(articleFiles)
        const total = paths.length
        let loaded = 0

        const articleData = await Promise.all(
          paths.map(async (path) => {
            try {
              const raw = await articleFiles[path]()
              const { attributes: frontmatter, body } = fm(raw)
              const fileName = path.split('/').pop().replace('.md', '')
              
              // 如果没有 frontmatter，使用默认值
              if (!raw.trim().startsWith('---')) {
                return {
                  id: fileName,
                  title: fileName,
                  date: '未知日期',
                  category: '未分类',
                  summary: body.slice(0, 100) + '...'
                }
              }

              return {
                id: fileName,
                title: frontmatter.title || fileName,
                date: dayjs(frontmatter.date).format('YYYY-MM-DD') || '未知日期',
                category: frontmatter.category || '未分类',
                summary: frontmatter.summary || body.slice(0, 100) + '...'
              }
            } catch (error) {
              console.error(`加载文章失败: ${path}`, error)
              return null
            } finally {
              loaded++
              progress.value = Math.round((loaded / total) * 100)
            }
          })
        )

        articles.value = articleData.filter(Boolean)
      } catch (error) {
        console.error('加载文章列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 初始化
    getArticles()

    return {
      articles,
      loading,
      progress,
      sortedArticles
    }
  }
}
</script>

<style scoped>
@import '../css/categoryList.css';
</style>