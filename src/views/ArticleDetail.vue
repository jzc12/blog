<template>
  <router-link to="/category" class="back-button">
    <i class="back-icon"></i>
    <span>返回目录</span>
  </router-link>
  <div class="article-meta" v-if="article">
    <div class="article-header">
      <h3 class="article-title">{{ article.title }}</h3>
      <div class="meta-info">
        <div class="meta-item">
          <component :is="iconMap.calendar" class="icon" />
          <span class="date">{{ article.date }}</span>
        </div>
        <div class="meta-item">
          <component :is="iconMap.calendarSync" class="icon" />
          <span class="date">{{ article.updated }}</span>
        </div>
        <div class="meta-item">
          <component :is="iconMap.kanban" class="icon" />
          <span class="date">{{ article.category }}</span>
        </div>
        <div class="meta-item">
          <component :is="iconMap.eye" class="icon" />
          <span class="date">{{ viewCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { icons } from '../utils/icon.js';
import fm from 'front-matter'
import dayjs from 'dayjs'
import { getArticleViewCount, incrementArticleViewCount } from '../utils/supabase.js';

export default {
  name: 'ArticleDetail',
  emits: ['content-loaded'],
  data() {
    return {
      article: null,
      viewCount: 0 // Initialize viewCount
    }
  },
  async created() {
    const articleId = this.$route.params.articleId;
    this.article = await this.getArticle(articleId);

    
    // 通知父组件内容已更新
    this.$nextTick(() => {
      if (this.article && this.article.content) {
        this.$emit('content-loaded', this.article.content);
      }
    });
    // Increment view count and then get the updated count
    await incrementArticleViewCount(articleId);
    this.viewCount = await getArticleViewCount(articleId);
  },
  computed: {
    iconMap() {
      return icons;
    }
  },
  methods: {
    async getArticle(id) {
      try {
        const article = await import(`../articles/${id}.md?raw`);
        const { attributes: frontmatter, body: content } = fm(article.default);

        const convertedContent = content.replace(
          /\.\.\/assets\//g,
          './../src/assets/'
        );

        return {
          id,
          title: frontmatter.title || id,
          date: dayjs(frontmatter.date).format('YYYY-MM-DD') || '未知日期',
          updated: dayjs(frontmatter.updated).format('YYYY-MM-DD') || '未知更新时间',
          category: frontmatter.category || '未分类',
          content: convertedContent.trim()
        };
      } catch (error) {
        console.error('解析文章失败:', error.message, error.stack);
        return {
          id,
          title: id,
          date: '未知日期',
          updated: '未知更新时间',
          category: '未分类',
          content: ''
        };
      }
    },

  }
}
</script>

<style scoped>
@import '../css/articleDetail.css';
@import '../css/icons.css';
</style>
