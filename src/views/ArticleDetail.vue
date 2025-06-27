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
import { createApp, h } from 'vue'
import { Copy, CircleCheck } from 'lucide-vue-next'

function renderIcon(el, type = 'copy') {
  const component = type === 'circleCheck' ? CircleCheck : Copy
  const container = document.createElement('span')
  const app = createApp({ render: () => h(component, { size: 16 }) })
  app.mount(container)
  el.innerHTML = ''
  el.appendChild(container.firstElementChild)
}

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

        const convertedContent = content.replace(
          /\.\/\.\.\/\.\.\/public\/assets\//g, // 匹配 ../../public/assets/
          process.env.NODE_ENV === 'production' ? '/blog/assets/' : '/assets/'
        )

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

    // 处理代码复制功能
    const setupCodeCopy = () => {
      const copyButtons = document.querySelectorAll('.copy-button')
      copyButtons.forEach(button => {
        const iconSpan = button.querySelector('.icon')
        if (iconSpan) renderIcon(iconSpan)

        button.addEventListener('click', async () => {
          // 修改选择器以适应新的结构
          const codeBlock = button.closest('.code-block-wrapper')
          const text = Array.from(codeBlock.querySelectorAll('.code-content'))
            .map(el => el.textContent)
            .join('\n')

          try {
            await navigator.clipboard.writeText(text)
            button.setAttribute('data-copied', 'true')
            if (iconSpan) renderIcon(iconSpan, 'circleCheck')

            setTimeout(() => {
              button.setAttribute('data-copied', 'false')
              if (iconSpan) renderIcon(iconSpan)
            }, 2000)
          } catch (err) {
            console.error('复制失败:', err)
          }
        })
      })
    }

    onMounted(async () => {
      const articleId = route.params.articleId;

      if (!articleId) {
        console.error('无效的文章ID');
        return;
      }

      try {
        article.value = await getArticle(articleId);
        emit('content-loaded', article.value?.content || '');

        await incrementArticleViewCount(articleId);
        viewCount.value = await getArticleViewCount(articleId);

        // 设置代码复制功能
        setupCodeCopy();
      } catch (error) {
        console.error('加载文章失败:', error);
      }
    });

    return {
      article,
      viewCount,
      iconMap: icons
    };
  }
};
</script>

<style scoped>
@import '../css/articleDetail.css';
@import '../css/icons.css';
</style>
