<!-- ========================== 文章分类列表组件 ============================== -->
<template>
  <div class="category-container">

    <!-- 加载状态显示 -->
    <div v-if="loading" class="loading-box">
      <div class="loading-text">
        <i class="fas fa-circle-notch"></i>
        正在加载文章：{{ progress }}%
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 文章列表展示 -->
    <div v-else-if="articles.length" class="category-content">
      <TransitionGroup name="list" tag="div" class="article-list">
        <router-link v-for="article in paginatedArticles" :key="article.id"
          :to="{ name: 'article', params: { articleId: article.id } }" class="article-item">
          <div class="article-header">
            <h3 class="article-title">{{ article.title || article.id }}</h3>
            <div class="category-tag"><i class="fas fa-tag"></i> {{ article.category }}</div>
            <div class="date-info"><i class="far fa-calendar-alt"></i><span>{{ article.date }}</span></div>
          </div>
          <p class="summary">{{ article.summary }}</p>
        </router-link>
      </TransitionGroup>
    </div>
    <!-- 无文章提示 -->
    <div v-else class="no-articles">
      <i class="far fa-folder-open"></i> 暂无文章
    </div>

  </div>
  <!-- 分页导航 -->
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">上一页</button>

    <span v-for="(page, index) in pageNumbers" :key="index"
      :class="['page-btn', { active: page === currentPage, ellipsis: page === '...' }]"
      @click="page !== '...' && goPage(page)">
      {{ page }}
    </span>

    <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import fm from 'front-matter'
import dayjs from 'dayjs'

export default {
  name: 'CategoryList',
  setup() {
    const articles = ref([])
    const loading = ref(true)
    const progress = ref(0)

    // ========== 分页状态 ==========
    const currentPage = ref(1)
    const pageSize = ref(6)

    // 页面加载时恢复上次页码
    onMounted(() => {
      const savedPage = sessionStorage.getItem('categoryPage')
      if (savedPage) currentPage.value = Number(savedPage)
    })

    // 页码变化时保存
    watch(currentPage, (newPage) => {
      sessionStorage.setItem('categoryPage', newPage)
    })

    // 排序后的文章
    const sortedArticles = computed(() => {
      return [...articles.value].sort((a, b) => {
        const dateCompare = new Date(b.date) - new Date(a.date)
        return dateCompare !== 0 ? dateCompare : a.title.localeCompare(b.title)
      })
    })

    const totalPages = computed(() => Math.ceil(sortedArticles.value.length / pageSize.value))

    const paginatedArticles = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return sortedArticles.value.slice(start, start + pageSize.value)
    })

    // 页码生成（省略风格）
    const pageNumbers = computed(() => {
      const pages = []
      const total = totalPages.value
      const cur = currentPage.value

      if (total <= 7) {
        // 总页数少于等于7，全部显示
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)

        if (cur > 4) pages.push('...')

        const start = Math.max(2, cur - 1)
        const end = Math.min(total - 1, cur + 1)

        for (let i = start; i <= end; i++) pages.push(i)

        if (cur < total - 3) pages.push('...')

        pages.push(total)
      }
      return pages
    })

    const goPage = (page) => {
      if (page >= 1 && page <= totalPages.value) currentPage.value = page
    }
    const prevPage = () => goPage(currentPage.value - 1)
    const nextPage = () => goPage(currentPage.value + 1)

    // ========== 加载文章 ==========
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
                date: frontmatter.updated
                  ? dayjs(frontmatter.updated).format('YYYY-MM-DD')
                  : '未知日期',
                category: frontmatter.category || '未分类',
                summary: frontmatter.summary || body.slice(0, 100) + '...'
              }
            } catch (e) {
              console.error(`加载文章失败: ${path}`, e)
              return null
            } finally {
              loaded++
              progress.value = Math.round((loaded / total) * 100)
            }
          })
        )

        articles.value = articleData.filter(Boolean)
      } catch (e) {
        console.error('加载文章列表失败:', e)
      } finally {
        loading.value = false
      }
    }

    getArticles()

    return {
      articles,
      loading,
      progress,
      sortedArticles,
      paginatedArticles,
      currentPage,
      totalPages,
      pageNumbers,
      goPage,
      prevPage,
      nextPage
    }
  }
}
</script>

<style scoped>
@import '../css/categoryList.css';
</style>