import{o,c as n,a}from"./index-23ba4857.js";const r={class:"markdown-body"},i="日常零碎记录",x="2025-07-13T00:00:00.000Z",u="2025-07-19T00:00:00.000Z",p="记录",d="细碎的知识，量多后会逐步归档",S={__name:"细碎知识",setup(s,{expose:e}){return e({frontmatter:{title:"日常零碎记录",date:"2025-07-13T00:00:00.000Z",updated:"2025-07-19T00:00:00.000Z",category:"记录",summary:"细碎的知识，量多后会逐步归档"}}),(g,t)=>(o(),n("div",r,t[0]||(t[0]=[a(`<h2>git</h2><pre><code class="language-bash">PS E:\\blog&gt; git config --global user.name
xxx
PS E:\\blog&gt; git config --global user.email
xxx@xxx
PS E:\\blog&gt; git config --global user.name &quot;xxxx&quot;
PS E:\\blog&gt; git config --global user.email &quot;xxx@xxx&quot;
</code></pre><blockquote><p>这样上传代码到仓库时，身份就是邮箱对应的身份，可以往一个仓库中加多个邮箱生成的SSH 密钥，上传时是根据设置的这个邮箱</p></blockquote><h2>js</h2><pre><code class="language-javascript">export const useSettingsStore = defineStore(&#39;settings&#39;, {
    state: () =&gt; ({
        fontSizeIndex: parseInt(localStorage.getItem(&#39;fontSizeIndex&#39;) || &#39;1&#39;),
    }),
    getters: {
        currentFontSize() { return \`\${12 + this.fontSizeIndex * 1}px\`; },
    },
</code></pre><blockquote><p>fontSizeIndex 对接滑轮的 4 档的值，不知道为什么</p><pre><code class="language-javascript">currentFontSize() { return \`\${12 + this.fontSizeIndex}px\`; },
</code></pre><p>会完全异常</p></blockquote>`,6)])))}};export{p as category,x as date,S as default,d as summary,i as title,u as updated};
