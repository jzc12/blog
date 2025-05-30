import MarkdownIt from 'markdown-it'
import mk from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

// 预处理数学公式分隔符
function preprocessMathDelimiters(content) {
    if (!content) return ''

    // 处理单行公式 $...$ 的情况
    content = content.replace(/\$\s*(.*?)\s*\$/g, (match, formula) => {
        // 如果公式为空，则返回原始文本
        if (!formula.trim()) return match
        // 否则规范化空格
        return `$${formula.trim()}$`
    })

    // 处理多行公式 $$...$$ 的情况
    content = content.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (match, formula) => {
        // 如果公式为空，则返回原始文本
        if (!formula.trim()) return match
        // 否则规范化空格
        return `$$${formula.trim()}$$`
    })

    return content
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value
            } catch (__) { }
        }
        return ''
    }
}).use(mk, {
    throwOnError: false,
    errorColor: '#cc0000',
    strict: false,
    delimiters: 'dollars'
})

export function renderMarkdown(content) {
    if (!content) return ''
    // 在渲染前预处理数学公式
    const processedContent = preprocessMathDelimiters(content)
    return md.render(processedContent)
}

export default md 