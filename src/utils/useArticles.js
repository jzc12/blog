import { ref, computed } from 'vue'
import fm from 'front-matter'
import dayjs from 'dayjs'

const articles = ref([])
const categoryList = ref([])
const loading = ref(false)
const progress = ref(0)
let loaded = false

export function useArticles() {
    const loadArticles = async () => {
        if (loaded) return

        loading.value = true
        progress.value = 0
        try {
            const files = import.meta.glob('@/articles/*.md', { as: 'raw' })
            const paths = Object.keys(files)
            const total = paths.length
            let count = 0

            const list = await Promise.all(
                paths.map(async (path) => {
                    try {
                        const raw = await files[path]()
                        const { attributes, body } = fm(raw)
                        const fileName = path.split('/').pop().replace('.md', '')

                        return {
                            id: fileName,
                            title: attributes.title || fileName,
                            date: attributes.date
                                ? dayjs(attributes.date).format('YYYY-MM-DD')
                                : attributes.updated
                                    ? dayjs(attributes.updated).format('YYYY-MM-DD')
                                    : '未知日期',
                            category: attributes.category || '未分类',
                            summary: attributes.summary
                                ? attributes.summary
                                : body
                                    .replace(/[#>*`\-\n]/g, '')
                                    .slice(0, 120) + '...'
                        }
                    } catch (e) {
                        console.error('文章解析失败:', path, e)
                        return null
                    } finally {
                        count++
                        progress.value = Math.round((count / total) * 100)
                    }
                })
            )
            articles.value = list.filter(Boolean)
            loaded = true

            // 2. 提取所有唯一分类并排序（去重 + 排序）
            const uniqueCategories = [...new Set(articles.value.map(item => item.category))].sort()
            categoryList.value = uniqueCategories

        } catch (e) {
            console.error('加载文章失败:', e)
        } finally {
            loading.value = false
        }
    }

    /* 默认按时间倒序 */
    const sortedArticles = computed(() => {
        return [...articles.value].sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
        })
    })

    // 3. 对外暴露分类列表（也可封装为computed确保响应式）
    const getCategories = computed(() => {
        // 确保分类列表始终是最新的（即使文章数据变化）
        return [...new Set(sortedArticles.value.map(item => item.category))].sort()
    })

    return {
        articles: sortedArticles,
        loading,
        progress,
        loadArticles,
        categoryList
    }
}