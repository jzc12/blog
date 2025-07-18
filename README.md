# ZC's Blog

最近比较忙，总结是agument AI 总结写的，之后有时间再好好写吧

一个基于 Vue 3 的现代化个人博客系统，专为技术分享和学习记录而设计。

## 📋 项目概述

这是一个功能丰富的个人博客项目，主要用于记录技术学习、实习经历和各种知识点。项目采用现代前端技术栈，提供了优雅的阅读体验和强大的内容管理功能。

### 🎯 项目特色

- **📝 Markdown 原生支持**：直接使用 Markdown 文件作为文章内容
- **🎨 主题定制**：支持明暗主题切换和个性化设置
- **📊 数据可视化**：集成 Mermaid 图表支持
- **💬 互动功能**：留言板系统，支持 Supabase 后端
- **📱 响应式设计**：完美适配各种设备
- **⚡ 高性能**：基于 Vite 构建，快速加载

## 🛠️ 技术栈

### 核心框架

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router 4** - 官方路由管理器
- **Pinia** - Vue 状态管理库

### 内容处理

- **Markdown-it** - Markdown 解析器
- **@traptitech/markdown-it-katex** - 数学公式渲染
- **Prism.js** - 代码语法高亮
- **Highlight.js** - 多语言代码高亮
- **Mermaid** - 图表和流程图支持

### UI 增强

- **Lucide Vue Next** - 现代图标库
- **Vue Feather Icons** - 轻量级图标组件
- **KaTeX** - 数学公式渲染引擎

### 后端服务

- **Supabase** - 开源 Firebase 替代方案
- **Pinia Plugin Persistedstate** - 状态持久化

### 开发工具

- **Unplugin Vue Markdown** - Vue 中的 Markdown 支持
- **Vite Plugin Pages** - 基于文件的路由
- **Vite SVG Loader** - SVG 文件加载器

## 📁 项目结构

```text
blog/
├── src/                          # 源代码目录
│   ├── articles/                 # 📚 文章内容 (21篇技术文章)
│   │   ├── 实习随笔.md           # 实习经历分享
│   │   ├── 算法.md               # 算法学习笔记
│   │   ├── 操作系统.md           # 操作系统知识点
│   │   ├── 计算机网络.md         # 网络协议学习
│   │   ├── 设计模式.md           # 设计模式总结
│   │   ├── 软件质量管理_1.md     # 软件工程相关
│   │   └── ...                   # 更多技术文章
│   ├── assets/                   # 🖼️ 静态资源
│   │   ├── avatar_*.png          # 头像图片
│   │   ├── background*.png       # 背景图片
│   │   ├── github.svg            # 社交图标
│   │   └── ...                   # 其他资源
│   ├── css/                      # 🎨 样式文件
│   │   ├── style.css             # 主样式文件
│   │   ├── lapis.css             # 主题样式
│   │   ├── prism-theme.css       # 代码高亮主题
│   │   ├── animations.css        # 动画效果
│   │   ├── layout.css            # 布局样式
│   │   └── ...                   # 组件样式
│   ├── md/                       # 📄 静态页面
│   │   ├── home.md               # 首页内容
│   │   ├── about.md              # 关于页面
│   │   └── 404.md                # 404页面
│   ├── router/                   # 🛣️ 路由配置
│   │   └── index.js              # 路由定义
│   ├── stores/                   # 🗄️ 状态管理
│   │   └── settings.js           # 设置状态管理
│   ├── utils/                    # 🔧 工具函数
│   │   ├── markdown.js           # Markdown 渲染工具
│   │   ├── supabase.js           # 数据库操作
│   │   └── icon.js               # 图标工具
│   ├── views/                    # 📱 页面组件
│   │   ├── ArticleDetail.vue     # 文章详情页
│   │   ├── CategoryList.vue      # 文章分类列表
│   │   ├── Message.vue           # 留言板
│   │   ├── SettingsPage.vue      # 设置页面
│   │   ├── Sidebar.vue           # 侧边栏
│   │   └── ...                   # 其他组件
│   ├── App.vue                   # 🏠 根组件
│   └── main.js                   # 🚀 应用入口
├── public/                       # 📦 公共资源
│   ├── 404.html                  # GitHub Pages 404处理
│   ├── avatar.png                # 默认头像
│   └── assets/                   # 公共资源目录
├── index.html                    # 📄 HTML入口
├── vite.config.js                # ⚙️ Vite配置
├── package.json                  # 📋 项目配置
└── gitpush.ps1                   # 🔄 Git自动化脚本
```

## ✨ 功能特点

### 🌐 页面路由系统

- **首页** (`/`) - 项目状态和开发进度展示
- **关于页面** (`/about`) - 个人介绍和联系方式
- **文章分类** (`/category`) - 文章列表和分类浏览
- **文章详情** (`/articles/:articleId`) - 文章阅读页面
- **留言板** (`/message`) - 访客留言和互动
- **设置页面** (`/settings`) - 个性化配置
- **打赏页面** (`/tip`) - 支持作者功能
- **404页面** - 友好的错误处理

### 📖 内容管理系统

#### Markdown 增强功能

- **原生 Markdown 支持**：直接使用 .md 文件作为文章
- **数学公式渲染**：支持 LaTeX 语法的数学公式
- **代码高亮**：支持多种编程语言语法高亮
- **图表支持**：集成 Mermaid 流程图和图表
- **自动目录生成**：根据标题自动生成文章大纲

#### 代码块增强

- **语法高亮**：支持 Python、C++、Java、C#等多种语言
- **行号显示**：代码块自动添加行号
- **一键复制**：便捷的代码复制功能
- **复制反馈**：复制成功的视觉提示

### 🎨 主题和个性化

#### 主题系统

- **明暗主题**：支持 Light/Dark/System 三种模式
- **自动切换**：跟随系统主题自动切换
- **背景定制**：支持纯色背景和图片背景
- **透明度调节**：可调节内容区域透明度

#### 字体和布局

- **字体大小调节**：支持多级字体大小设置
- **响应式布局**：完美适配桌面和移动设备
- **三栏布局**：文章页面支持目录、内容、侧边栏三栏布局

### 💬 互动功能

#### 留言板系统

- **实时留言**：基于 Supabase 的实时留言功能
- **私密留言**：支持私密留言选项
- **留言统计**：显示今日和总留言数量
- **邮箱通知**：支持邮箱联系方式

#### 文章统计

- **浏览量统计**：记录文章浏览次数
- **防刷机制**：48小时冷却期防止重复计数
- **阅读时间估算**：自动计算文章阅读时间

### 🎯 用户体验

#### 交互效果

- **点击特效**：全局点击粒子特效
- **平滑滚动**：页面内锚点平滑滚动
- **返回顶部**：便捷的返回顶部按钮
- **加载动画**：优雅的加载状态提示

#### 导航和浏览

- **智能目录**：文章目录自动展开/收起
- **当前位置高亮**：滚动时自动高亮当前章节
- **面包屑导航**：清晰的页面层级导航

## 📊 内容统计

### 文章分类

- **技术学习**：算法、数据结构、操作系统、计算机网络
- **编程语言**：C#、Python、Java 等
- **软件工程**：设计模式、软件质量管理、系统设计
- **实习经历**：实习随笔和工作体验分享
- **工具使用**：Redis、Nginx、ADB 等工具学习
- **学术报告**：深度学习、NLP 等学术内容

### 技术覆盖

- **前端技术**：Vue.js 生态系统
- **后端服务**：Supabase 数据库
- **开发工具**：Git、PowerShell 自动化
- **部署方案**：GitHub Pages 静态部署

## 🚀 快速开始

### 环境要求

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0 或 **yarn** >= 1.22.0
- **Git** 版本控制

### 安装步骤

```bash
# 1. 克隆项目
git clone git@github.com:jzc12/blog.git
# 或使用 HTTPS
git clone https://github.com/jzc12/blog.git

# 2. 进入项目目录
cd blog

# 3. 安装依赖
npm install
# 或使用 yarn
yarn install
```

### 开发运行

```bash
# 启动开发服务器
npm run dev

# 项目将在 http://localhost:5173 启动
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 构建 GitHub Pages 版本
npm run build:github

# 预览构建结果
npm run preview
```

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件配置 Supabase：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Vite 配置

项目使用 Vite 作为构建工具，主要配置包括：

- **Markdown 支持**：通过 `unplugin-vue-markdown` 插件
- **SVG 加载**：支持 SVG 文件作为 Vue 组件
- **路径别名**：`@` 指向 `src` 目录
- **多环境构建**：支持开发和 GitHub Pages 部署

### 主题定制

通过 `src/stores/settings.js` 可以自定义：

- **主题模式**：明亮/暗黑/跟随系统
- **字体大小**：多级字体大小调节
- **背景设置**：纯色或图片背景
- **透明度**：内容区域透明度调节

## 📝 内容管理

### 添加新文章

1. 在 `src/articles/` 目录下创建新的 `.md` 文件
2. 添加 Front Matter 元数据：

```markdown
---
date: 2025-01-01
updated: 2025-01-02
category: 技术分享
summary: 文章简介
---

# 文章标题

文章内容...
```

### 支持的 Markdown 语法

#### 基础语法

- **标题**：`# ## ### ####`
- **强调**：`**粗体**` `*斜体*`
- **列表**：有序和无序列表
- **链接**：`[文本](URL)`
- **图片**：`![alt](src)`

#### 扩展语法

- **数学公式**：`$inline$` 和 `$$block$$`
- **代码块**：支持语法高亮
- **表格**：标准 Markdown 表格
- **Mermaid 图表**：流程图和时序图

#### 代码块示例

```javascript
// JavaScript 代码示例
function hello() {
    console.log('Hello, World!');
}
```

```mermaid
graph LR
    A[开始] --> B[处理]
    B --> C[结束]
```

## 🗄️ 数据库设计

### Supabase 表结构

#### messages 表（留言系统）

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) DEFAULT '匿名',
    content TEXT NOT NULL,
    email VARCHAR(100),
    private_message BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### article_views 表（浏览统计）

```sql
CREATE TABLE article_views (
    article_name VARCHAR(100) PRIMARY KEY,
    view_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 设计系统

### 色彩方案

#### 主色调

- **主绿色**：`#a8e6cf`
- **次绿色**：`#8ed1c6`
- **强调绿**：`#75bba7`
- **文本绿**：`#4a7b62`

#### 主题色

- **明亮主题**：白色背景，深色文字
- **暗黑主题**：深色背景，浅色文字
- **自适应**：跟随系统主题设置

### 布局系统

- **响应式设计**：支持桌面、平板、手机
- **三栏布局**：目录 + 内容 + 侧边栏
- **自适应导航**：移动端折叠菜单
- **流式布局**：内容区域自适应宽度

## 🔧 开发工具

### Git 自动化

项目包含 `gitpush.ps1` PowerShell 脚本：

```powershell
# 快速提交和推送
./gitpush.ps1 "commit message"

# 使用默认消息
./gitpush.ps1
```

### 开发建议

1. **代码规范**：遵循 Vue 3 Composition API 风格
2. **组件设计**：单一职责，可复用性
3. **样式管理**：CSS 变量 + 模块化样式
4. **性能优化**：懒加载 + 代码分割

## 🚀 部署指南

### GitHub Pages 部署

1. **配置仓库**：

   - 启用 GitHub Pages
   - 选择 `gh-pages` 分支作为源
2. **自动部署**：

   ```bash
   # 构建并部署到 GitHub Pages
   npm run build:github
   npx gh-pages -d dist
   ```
3. **自定义域名**（可选）：

   - 在 `public` 目录添加 `CNAME` 文件
   - 配置 DNS 记录

### 其他部署选项

- **Vercel**：连接 GitHub 仓库自动部署
- **Netlify**：拖拽部署或 Git 集成
- **自建服务器**：nginx 静态文件服务

## 🤝 贡献指南

### 如何贡献

1. **Fork** 项目到你的 GitHub
2. **创建分支**：`git checkout -b feature/new-feature`
3. **提交更改**：`git commit -m 'Add new feature'`
4. **推送分支**：`git push origin feature/new-feature`
5. **创建 Pull Request**

### 贡献类型

- 🐛 **Bug 修复**：修复现有问题
- ✨ **新功能**：添加新的功能特性
- 📝 **文档改进**：完善项目文档
- 🎨 **UI/UX 优化**：改进用户界面和体验
- ⚡ **性能优化**：提升应用性能

### 代码规范

- 使用 **Vue 3 Composition API**
- 遵循 **ESLint** 代码规范
- 添加适当的 **注释和文档**
- 确保 **响应式设计** 兼容性

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 📞 联系方式

- **GitHub**：[@jzc12](https://github.com/jzc12)
- **邮箱**：[1765714473@qq.com](mailto:1765714473@qq.com)
- **博客**：[在线访问](https://jzc12.github.io/blog/)

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
