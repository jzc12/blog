import MarkdownIt from 'markdown-it'
import mk from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

import python from 'highlight.js/lib/languages/python'
import cpp from 'highlight.js/lib/languages/cpp'
import java from 'highlight.js/lib/languages/java'
import c from 'highlight.js/lib/languages/c'
import csharp from 'highlight.js/lib/languages/csharp'

hljs.registerLanguage('python', python)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('java', java)
hljs.registerLanguage('c', c)
hljs.registerLanguage('csharp', csharp)

function preprocessMathDelimiters(content) {
    if (!content) return ''

    content = content.replace(/\$\s*(.*?)\s*\$/g, (match, formula) => {
        if (!formula.trim()) return match
        return `$${formula.trim()}$`
    })

    content = content.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (match, formula) => {
        if (!formula.trim()) return match
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
                const highlighted = hljs.highlight(str, { language: lang }).value

                const lines = highlighted.split('\n')
                const withLineNumbers = lines.map((line, i) => {
                    return `<span class="line-number">${i + 1}</span>${line}`
                }).join('\n')

                return `<pre class="hljs with-line-numbers"><code>${withLineNumbers}</code></pre>`
            } catch (__) { }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
}).use(mk, {
    throwOnError: false,
    errorColor: '#cc0000',
    strict: false,
    delimiters: 'dollars'
})

export function renderMarkdown(content) {
    if (!content) return ''
    const processedContent = preprocessMathDelimiters(content)
    return md.render(processedContent)
}

export default md