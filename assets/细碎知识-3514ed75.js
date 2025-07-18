const n=`---
date: 2025-07-13
updated: 2025-07-19
category: 记录
summary: 细碎的知识，量多后会逐步归档
---
## git

\`\`\`bash
PS E:\\blog> git config --global user.name
xxx
PS E:\\blog> git config --global user.email
xxx@xxx
PS E:\\blog> git config --global user.name "xxxx"
PS E:\\blog> git config --global user.email "xxx@xxx"
\`\`\`

> 这样上传代码到仓库时，身份就是邮箱对应的身份，可以往一个仓库中加多个邮箱生成的SSH 密钥，上传时是根据设置的这个邮箱





## js



\`\`\`javascript
export const useSettingsStore = defineStore('settings', {
    state: () => ({
        fontSizeIndex: parseInt(localStorage.getItem('fontSizeIndex') || '1'),
    }),
    getters: {
        currentFontSize() { return \`\${12 + this.fontSizeIndex * 1}px\`; },
    },
\`\`\`

> fontSizeIndex 对接滑轮的 4 档的值，不知道为什么
>
> \`\`\`javascript
> currentFontSize() { return \`\${12 + this.fontSizeIndex}px\`; },
> \`\`\`
>
> 会完全异常



`;export{n as default};
