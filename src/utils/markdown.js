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

// 预处理数学定界符，确保KaTeX渲染时的正确间距。
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

// 将给定文本转换为 URL 友好的slug。
function slugify(text) {
    let slug = text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // 将空格替换为连字符
        .replace(/[^\w-]+/gu, '')        // 移除所有非单词字符和非连字符
        .replace(/--+/g, '-')           // 将多个连字符替换为单个连字符
        .replace(/^-+/, '')             // 移除开头的连字符
        .replace(/-+$/, '');            // 移除末尾的连字符

    // 如果生成的slug为空，则提供一个基于时间戳的唯一ID作为后备
    if (slug === '') {
        return 'heading-' + Date.now().toString(36);
    }
    return slug;
}

// markdown-it配置， 行号
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
                    return `<div class="code-line"><span class="line-number">${i + 1}</span><span class="code-content">${line || ' '}</span></div>`
                }).join('')
                return `<pre class="hljs with-line-numbers"><code>${withLineNumbers}</code></pre>`
            } catch (__) { }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
})

// 禁用所有可能导致 TAP 转换的规则
md.disable(['replacements', 'smartquotes']);

// 使用 KaTeX 插件
md.use(mk, {
    throwOnError: false,
    errorColor: '#cc0000',
    strict: false,
    delimiters: 'dollars'
})

// markdown-it的自定义插件，用于为标题添加唯一ID并构建大纲。
function markdownItOutlinePlugin(md) {
    md.core.ruler.after('inline', 'extract_headings', (state) => {
        let headingIdMap = new Map();       // To ensure unique IDs
        let currentHeadings = [];           // This will hold the flattened outline data temporarily
        const MAX_HEADING_LENGTH = 30; // 设定标题最大长度

        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i];

            if (token.type === 'heading_open') {
                const level = parseInt(token.tag.substr(1));    // h1, h2, h3 -> 1, 2, 3
                const nextToken = state.tokens[i + 1];

                if (nextToken && nextToken.type === 'inline') {
                    let headingText = nextToken.content;

                    // 截断标题文本并添加省略号
                    if (headingText.length > MAX_HEADING_LENGTH) {
                        headingText = headingText.substring(0, MAX_HEADING_LENGTH) + '...';
                    }

                    let id = slugify(headingText);
                    let counter = 1;
                    let originalId = id;

                    // Ensure unique ID
                    while (headingIdMap.has(id)) {
                        id = `${originalId}-${counter}`;
                        counter++;
                    }
                    headingIdMap.set(id, true);

                    token.attrJoin('id', id); // Add ID to the heading tag
                    currentHeadings.push({
                        level: level,
                        text: headingText,
                        id: id,
                        children: [],
                        expanded: false // Default to collapsed
                    });
                }
            }
        }

        // Convert flat list to hierarchical structure
        md._headings = buildHierarchy(currentHeadings);
    });
}

// 从平面列表中递归构建标题的层次结构。
function buildHierarchy(flatHeadings) {
    const root = { level: 0, children: [] };
    const stack = [root];

    for (const heading of flatHeadings) {
        while (stack.length > 0 && heading.level <= stack[stack.length - 1].level) {
            stack.pop();
        }
        stack[stack.length - 1].children.push(heading);
        stack.push(heading);
    }
    return root.children;
}

md.use(markdownItOutlinePlugin);

// 将markdown内容渲染为HTML并提取标题大纲。
export function renderMarkdown(content) {
    if (!content) return { html: '', outline: [] };
    const processedContent = preprocessMathDelimiters(content);
    // Reset headings before each render
    md._headings = []; // Clear previous headings
    const html = md.render(processedContent);
    return { html: html, outline: md._headings };
}

export default md