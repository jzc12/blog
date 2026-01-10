<!-- ========================== 文章分类列表组件 ============================== -->
<template>
  <div class="category-container">

    <!-- 分类选择 -->
    <select v-model="selectedCategory" class="category-select" @change="handleCategoryChange"
      :disabled="loading || !categoryList.length">
      <!-- 无分类 -->
      <option v-if="!categoryList.length" disabled value="">
        暂无分类数据
      </option>

      <!-- 有分类 -->
      <option v-for="cat in categoryList" :key="cat" :value="cat">
        {{ cat }}
      </option>
    </select>

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
    <div v-else-if="paginatedArticles.length" class="category-content">
      <TransitionGroup name="list" tag="div" class="article-list">
        <router-link v-for="article in paginatedArticles" :key="article.id"
          :to="{ name: 'article', params: { articleId: article.id } }" class="article-item">
          <div class="article-header">
            <h3 class="article-title">
              {{ article.title || article.id }}
            </h3>

            <div class="category-tag">
              <i class="fas fa-tag"></i> {{ article.category }}
            </div>

            <div class="date-info">
              <i class="far fa-calendar-alt"></i>
              <span>{{ article.date }}</span>
            </div>
          </div>

          <p class="summary">{{ article.summary }}</p>
        </router-link>
      </TransitionGroup>
    </div>

    <!-- 无文章 -->
    <div v-else class="no-articles">
      <i class="far fa-folder-open"></i>
      {{ selectedCategory === 'all'
        ? '暂无文章'
        : `【${selectedCategory}】分类下暂无文章`
      }}
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">
        上一页
      </button>

      <span v-for="page in pageNumbers" :key="page" :class="['page-btn', { active: page === currentPage }]"
        @click="goPage(page)">
        {{ page }}
      </span>

      <button @click="nextPage" :disabled="currentPage === totalPages">
        下一页
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticles } from '../utils/useArticles'

/* ---------------- 路由 ---------------- */
const route = useRoute()
const router = useRouter()

/* ---------------- 数据 ---------------- */
const {
  articles,
  loading,
  progress,
  loadArticles,
  categoryList
} = useArticles()

/* ---------------- 状态 ---------------- */
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = 5

/* ---------------- 初始化 ---------------- */
onMounted(async () => {
  await loadArticles()
  const savedPage = sessionStorage.getItem('categoryPage')
  if (savedPage) currentPage.value = Number(savedPage)
  // 若 URL 无分类，但 session 有 → 用 session
  if (!route.params.category) {
    const savedCategory = sessionStorage.getItem('currentCategory')
    if (savedCategory && categoryList.value.includes(savedCategory)) {
      selectedCategory.value = savedCategory
      handleCategoryChange()
      return
    }
  }
  syncInitialCategory()
})

/* ---------------- 初始化分类选择 ---------------- */
const syncInitialCategory = () => {
  if (!categoryList.value.length) {
    selectedCategory.value = ''
    return
  }

  const routeCat = route.params.category

  if (routeCat && categoryList.value.includes(routeCat)) {
    selectedCategory.value = routeCat
  } else {
    selectedCategory.value = categoryList.value[0]
    router.replace({
      name: 'category',
      params: { category: selectedCategory.value }
    })
  }
}

/* ---------------- 路由变化 → 同步 select ---------------- */
watch(
  () => route.params.category,
  () => nextTick(syncInitialCategory)
)

/* ---------------- select → 路由 ---------------- */
const handleCategoryChange = () => {
  if (!selectedCategory.value) return

  router.push({
    name: 'category',
    params: { category: selectedCategory.value }
  })

  currentPage.value = 1
  sessionStorage.setItem('currentCategory', selectedCategory.value)
}

/* ---------------- 分类变化校验 ---------------- */
watch(categoryList, () => {
  if (
    selectedCategory.value &&
    !categoryList.value.includes(selectedCategory.value)
  ) {
    syncInitialCategory()
  }
})

/* ---------------- 分页 ---------------- */
const filteredArticles = computed(() =>
  selectedCategory.value
    ? (articles.value || []).filter(a => a.category === selectedCategory.value)
    : []
)

const totalPages = computed(() =>
  filteredArticles.value.length
    ? Math.ceil(filteredArticles.value.length / pageSize)
    : 0
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
)

/* ---------------- 分页操作 ---------------- */
const goPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
const prevPage = () => goPage(currentPage.value - 1)
const nextPage = () => goPage(currentPage.value + 1)
</script>

<style scoped>
@import '../css/categoryList.css';
</style>
