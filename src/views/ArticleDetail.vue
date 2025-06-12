<template>
  <div class="article-container">

    <!-- 文章内容 -->
    <div class="article-meta" v-if="article">
      <div class="article-header">
        <div class="meta-info">
          <!-- 创建日期 -->
          <div class="meta-item" title="创建日期">
            <component :is="iconMap.calendar" class="icon" />
            <span class="date">{{ article.date }}</span>
          </div>
          <!-- 更新日期 -->
          <div class="meta-item" title="更新日期">
            <component :is="iconMap.calendarSync" class="icon" />
            <span class="date">{{ article.updated }}</span>
          </div>
          <!-- 分类 -->
          <div class="meta-item" title="文章分类">
            <component :is="iconMap.kanban" class="icon" />
            <span class="date">{{ article.category }}</span>
          </div>
          <!-- 阅读次数 -->
          <div class="meta-item" title="阅读次数">
            <component :is="iconMap.eye" class="icon" />
            <span class="date">{{ viewCount }}</span>
          </div>
        </div>
      </div>
      <div class="article-divider"></div>
    </div>

    <!-- 返回按钮 -->
    <div class="back-button-container">
      <router-link to="/category" class="back-button">
        <span>返回目录</span>
      </router-link>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { icons } from '../utils/icon.js'
import fm from 'front-matter'
import dayjs from 'dayjs'
import { getArticleViewCount, incrementArticleViewCount } from '../utils/supabase.js'

export default {
  name: 'ArticleDetail',
  emits: ['content-loaded'],

  setup(props, { emit }) {
    const article = ref(null)
    const viewCount = ref(0)
    const route = useRoute()

    const getArticle = async (id) => {
      try {
        const articleModule = await import(`../articles/${id}.md?raw`)
        const { attributes: frontmatter, body: content } = fm(articleModule.default)

        console.log('Current NODE_ENV:', process.env.NODE_ENV)
        const convertedContent = content.replace(
          /\.\.\/assets\//g,
          process.env.NODE_ENV === 'production' ? '/blog/assets/' : './../src/assets/'
        )
        console.log(convertedContent)

        return {
          id,
          title: frontmatter.title || id,
          date: dayjs(frontmatter.date).format('YYYY-MM-DD') || '未知日期',
          updated: dayjs(frontmatter.updated).format('YYYY-MM-DD') || '未知更新时间',
          category: frontmatter.category || '未分类',
          content: convertedContent.trim()
        }
      } catch (error) {
        console.error('解析文章失败:', error.message, error.stack)
        return {
          id,
          title: id,
          date: '未知日期',
          updated: '未知更新时间',
          category: '未分类',
          content: ''
        }
      }
    }

    onMounted(async () => {
      const articleId = route.params.articleId

      if (!articleId) {
        console.error('无效的文章ID')
        return
      }

      try {
        article.value = await getArticle(articleId)

        // 通知父组件内容已更新
        emit('content-loaded', article.value?.content || '')

        // 更新阅读次数
        await incrementArticleViewCount(articleId)
        viewCount.value = await getArticleViewCount(articleId)
      } catch (error) {
        console.error('加载文章失败:', error)
      }
    })

    return {
      article,
      viewCount,
      iconMap: icons
    }
  }
}
</script>

<style scoped>
@import '../css/articleDetail.css';
@import '../css/icons.css';
</style>
