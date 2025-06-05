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

// Function to slugify text for IDs
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')            // Trim - from start of text
        .replace(/-+$/, '');           // Trim - from end of text
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
                    return `<div class="code-line">
                                <span class="line-number">${i + 1}</span>
                                <span class="code-content">${line || '&nbsp;'}</span>
                            </div>`
                }).join('')

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

// Custom plugin to add IDs to headings and extract outline
function markdownItOutlinePlugin(md) {
    md.core.ruler.after('inline', 'extract_headings', (state) => {
        let headingIdMap = new Map(); // To ensure unique IDs
        let currentHeadings = []; // This will hold the flattened outline data temporarily

        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i];

            if (token.type === 'heading_open') {
                const level = parseInt(token.tag.substr(1)); // h1, h2, h3 -> 1, 2, 3
                const nextToken = state.tokens[i + 1];

                if (nextToken && nextToken.type === 'inline') {
                    const headingText = nextToken.content;
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
                        expanded: true // Default to expanded
                    });
                }
            }
        }

        // Convert flat list to hierarchical structure
        md._headings = buildHierarchy(currentHeadings);
    });
}

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

export function renderMarkdown(content) {
    if (!content) return { html: '', outline: [] };
    const processedContent = preprocessMathDelimiters(content);
    // Reset headings before each render
    md._headings = []; // Clear previous headings
    const html = md.render(processedContent);
    return { html: html, outline: md._headings };
}

export default md