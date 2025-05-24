
const pages = {
    home: "home.md",
    about: "about.md",
    category: "category.md",
    tags: "tags.md"
};


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const title = document.getElementById('title');
    const spans = sidebar.getElementsByTagName('span');
    const paragraphs = sidebar.getElementsByTagName('p');

    sidebar.classList.toggle('collapsed');
    title.style.display = sidebar.classList.contains('collapsed') ? 'none' : 'block';

    const displayStyle = sidebar.classList.contains('collapsed') ? 'none' : 'block';
    for (let span of spans) {
        span.style.display = displayStyle;
    }
    for (let p of paragraphs) {
        p.style.display = displayStyle;
    }
}



marked.setOptions({
    breaks: true,
    gfm: true,
    async: true
});




const mdCache = {};
let loading = false;
let currentPage = null;

async function loadMarkdown(page) {
    if (loading || currentPage === page) {
        console.log(`loading 正在加载: ${page}`);
        return;
    }
    loading = true;
    currentPage = page;

    const url = `src/md/${page}`;
    const mainEl = document.querySelector('.main');
    mainEl.innerHTML = '<div class="markdown-body">加载中...</div>';

    try {
        if (mdCache[url]) {
            mainEl.innerHTML = `<div class="markdown-body">${mdCache[url]}</div>`;
        } else {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`加载失败: ${response.status}`);

            const md = await response.text();
            const html = await marked.parse(md);
            mdCache[url] = html;
            mainEl.innerHTML = `<div class="markdown-body">${html}</div>`;
        }
    } catch (err) {
        mainEl.innerHTML = `<div class="error">${err.message}</div>`;
    } finally {
        loading = false;
        currentPage = null;
    }
}




document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    nav.addEventListener('click', e => {
        const link = e.target.closest('li[data-page]');
        if (!link) return;
        e.preventDefault();
        const pageKey = link.getAttribute('data-page');
        if (pageKey && pages[pageKey]) {
            loadMarkdown(pages[pageKey]);
        }
    });

    loadMarkdown(pages.home);

});
