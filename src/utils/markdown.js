// markdown-it 配置及工具函数封装
import MarkdownIt from 'markdown-it';
import mk from '@traptitech/markdown-it-katex';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

// 注册语言支持
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import c from 'highlight.js/lib/languages/c';
import csharp from 'highlight.js/lib/languages/csharp';

import { icons } from './icon.js';

// 注册 highlight.js 支持的语言
hljs.registerLanguage('python', python);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('java', java);
hljs.registerLanguage('c', c);
hljs.registerLanguage('csharp', csharp);

// ========================== 工具函数 ==============================

// 预处理数学定界符，确保 KaTeX 渲染时的正确间距
function preprocessMathDelimiters(content) {
    if (!content) return '';

    // 处理行内公式，只做基本的空格处理
    content = content.replace(/\$([^$]+?)\$/g, (match, formula) => {
        return `$${formula.trim()}$`;
    });

    // 处理块级公式，只做基本的空格处理
    content = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
        return `$$${formula.trim()}$$`;
    });

    return content;
}

// 将文本转为 URL 友好的 slug，用于 heading 的锚点
function slugify(text) {
    let slug = text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // 空格转为 -
        .replace(/[^\w-]+/gu, '')       // 移除非字母数字或 -
        .replace(/--+/g, '-')           // 多个 - 合并为一个
        .replace(/^-+/, '')             // 移除开头 -
        .replace(/-+$/, '');            // 移除结尾 -

    return slug || `heading-${Date.now().toString(36)}`; // 空 slug 备用唯一 ID
}

// ======================== markdown-it 配置 ========================

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,

    highlight: function (str, lang) {
        if (lang === 'mermaid') {
            return str; // mermaid 交由前端处理
        }

        if (lang && hljs.getLanguage(lang)) {
            try {
                const highlighted = hljs.highlight(str, { language: lang }).value;
                const lines = highlighted.split('\n');

                const withLineNumbers = lines.map((line, i) => {
                    return `<div class="code-line">
                        <span class="line-number">${i + 1}</span>
                        <span class="code-content">${line || ' '}</span>
                    </div>`;
                }).join('');

                return `
                <div class="code-block-wrapper">
                    <button class="copy-button" data-copied="false">
                        <span class="icon"></span>
                    </button>
                    <pre class="hljs with-line-numbers">
                        <code>${withLineNumbers}</code>
                    </pre>
                </div>`;
            } catch (_) { }
        }

        // 没有语言或高亮失败时，输出转义后的代码
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

// 禁用 typographer 中可能导致 TAP 转换的行为
md.disable(['replacements', 'smartquotes']);

// ============ 自定义规则：重写 code_block / fence 渲染 ==============

// 普通缩进代码块（rare）
md.renderer.rules.code_block = function (tokens, idx) {
    const content = tokens[idx].content;
    return `<pre class="hljs">${md.utils.escapeHtml(content)}</pre>`;
};

// 使用 ``` 标记的代码块
md.renderer.rules.fence = function (tokens, idx, options) {
    const token = tokens[idx];
    const content = token.content;
    const lang = token.info.trim();

    if (lang === 'mermaid') {
        return `<pre class="mermaid">${content}</pre>`;
    }

    // 尝试使用 highlight 函数渲染
    if (options.highlight) {
        return options.highlight(content, lang);
    }

    // 否则手动 escape
    return `<pre class="hljs"><code>${md.utils.escapeHtml(content)}</code></pre>`;
};

// ================ 使用 KaTeX 渲染数学公式 ==================
md.use(mk, {
    throwOnError: false,
    errorColor: '#cc0000',
    strict: 'ignore',
    trust: true,
    maxSize: 100,
    maxExpand: 1000,
    macros: {
        '\\R': '\\mathbb{R}',
        '\\N': '\\mathbb{N}',
        '\\Z': '\\mathbb{Z}',
        '\\Q': '\\mathbb{Q}',
        '\\C': '\\mathbb{C}'
    },
    delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
    ]
});

// ============ 插件：抽取标题并构建大纲结构 ================

function markdownItOutlinePlugin(md) {
    md.core.ruler.after('inline', 'extract_headings', (state) => {
        let headingIdMap = new Map();
        let currentHeadings = [];
        const MAX_HEADING_LENGTH = 30;

        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i];

            if (token.type === 'heading_open') {
                const level = parseInt(token.tag.substr(1));
                const nextToken = state.tokens[i + 1];

                if (nextToken && nextToken.type === 'inline') {
                    let headingText = nextToken.content;

                    // 长标题截断
                    if (headingText.length > MAX_HEADING_LENGTH) {
                        headingText = headingText.substring(0, MAX_HEADING_LENGTH) + '...';
                    }

                    let id = slugify(headingText);
                    let counter = 1;
                    let originalId = id;

                    // 保证 ID 唯一
                    while (headingIdMap.has(id)) {
                        id = `${originalId}-${counter++}`;
                    }

                    headingIdMap.set(id, true);
                    token.attrJoin('id', id); // 设置 ID

                    currentHeadings.push({
                        level,
                        text: headingText,
                        id,
                        children: [],
                        expanded: false // 默认收起
                    });
                }
            }
        }

        // 构建层级结构
        md._headings = buildHierarchy(currentHeadings);
    });
}

// 将平面结构转为嵌套层级结构
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

// ===================== 主导出函数 ======================

/**
 * 渲染 Markdown 文本为 HTML，同时提取标题大纲
 * @param {string} content - markdown 原文
 * @returns {{ html: string, outline: array }}
 */
export function renderMarkdown(content) {
    if (!content) return { html: '', outline: [] };

    const processedContent = preprocessMathDelimiters(content);
    md._headings = []; // 清空上次大纲
    const html = md.render(processedContent);
    return {
        html,
        outline: md._headings
    };
}

export default md;
