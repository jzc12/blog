// ========================== 文章分类列表组件 ==============================
<template>
  <div class="category-container">

    <!-- 加载状态显示 -->
    <div v-if="loading" class="loading-box">
      <div class="loading-text">
        <i class="fas fa-circle-notch"></i>
        正在加载文章：{{ progress }}%
      </div>
      <!-- 加载进度条 -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 文章列表展示 -->
    <div v-else-if="articles.length" class="category-content">
      <TransitionGroup name="list" tag="div" class="article-list">
        <!-- 单篇文章项 -->
        <router-link v-for="article in sortedArticles" :key="article.id"
          :to="{ name: 'article', params: { articleId: article.id } }" class="article-item">
          <!-- 文章头部信息 -->
          <div class="article-header">
            <h3 class="article-title">{{ article.title || article.id }}</h3>
            <!-- 分类标签 -->
            <div class="category-tag">
              <i class="fas fa-tag"></i>
              {{ article.category }}
            </div>
            <!-- 发布日期 -->
            <div class="date-info">
              <i class="far fa-calendar-alt"></i>
              <span>{{ article.date }}</span>
            </div>
          </div>
          <!-- 文章摘要 -->
          <p class="summary">{{ article.summary }}</p>
        </router-link>
      </TransitionGroup>
    </div>

    <!-- 无文章提示 -->
    <div v-else class="no-articles">
      <i class="far fa-folder-open"></i>
      暂无文章
    </div>
  </div>
</template>

<script>
// ========================== 依赖导入 ==============================
import { ref, computed } from 'vue'
import fm from 'front-matter'
import dayjs from 'dayjs'

export default {
  name: 'CategoryList',

  // ========================== 组件逻辑 ==============================
  setup() {
    // ========================== 响应式状态 ==============================
    const articles = ref([])        // 文章列表数据
    const loading = ref(true)       // 加载状态
    const progress = ref(0)         // 加载进度

    // ========================== 计算属性 ==============================
    // 按日期和标题排序的文章列表
    const sortedArticles = computed(() => {
      return [...articles.value].sort((a, b) => {
        // 首先按日期排序
        const dateCompare = new Date(b.date) - new Date(a.date)
        if (dateCompare !== 0) return dateCompare
        // 如果日期相同，按标题排序
        return a.title.localeCompare(b.title)
      })
    })

    // ========================== 方法定义 ==============================
    // 获取并处理文章列表
    const getArticles = async () => {
      loading.value = true
      progress.value = 0

      try {
        // 获取所有 Markdown 文件
        const articleFiles = import.meta.glob('@/articles/*.md', { as: 'raw' })
        const paths = Object.keys(articleFiles)
        const total = paths.length
        let loaded = 0

        // 并行加载所有文章
        const articleData = await Promise.all(
          paths.map(async (path) => {
            try {
              // 读取并解析文章内容
              const raw = await articleFiles[path]()
              const { attributes: frontmatter, body } = fm(raw)
              const fileName = path.split('/').pop().replace('.md', '')

              // 处理无 frontmatter 的文章
              if (!raw.trim().startsWith('---')) {
                return {
                  id: fileName,
                  title: fileName,
                  date: '未知日期',
                  category: '未分类',
                  summary: body.slice(0, 100) + '...'
                }
              }

              // 返回处理后的文章数据
              return {
                id: fileName,
                title: frontmatter.title || fileName,
                date: dayjs(frontmatter.updated).format('YYYY-MM-DD') || '未知日期',
                category: frontmatter.category || '未分类',
                summary: frontmatter.summary || body.slice(0, 100) + '...'
              }
            } catch (error) {
              console.error(`加载文章失败: ${path}`, error)
              return null
            } finally {
              // 更新加载进度
              loaded++
              progress.value = Math.round((loaded / total) * 100)
            }
          })
        )

        // 过滤掉加载失败的文章
        articles.value = articleData.filter(Boolean)
      } catch (error) {
        console.error('加载文章列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    // ========================== 初始化 ==============================
    getArticles()

    // ========================== 返回数据 ==============================
    return {
      articles,         // 文章列表
      loading,          // 加载状态
      progress,         // 加载进度
      sortedArticles    // 排序后的文章列表
    }
  }
}
</script>

<style scoped>
/* ========================== 样式导入 ============================== */
@import '../css/categoryList.css';
</style>