# ZC's Blog

## 技术栈

- Vue 3：主框架
- Vite：构建工具
- Pinia：状态管理
- Vue Router：前端路由
- Markdown 支持：内容渲染
- Prism.js：代码高亮

## 项目结构

```text
blog/
├── src/                  # 源代码目录
│   ├── assets/           # 静态资源
│   ├── articles/         # 文章内容
│   ├── css/              # 样式文件
│   ├── md/               # Markdown页面
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 应用入口
├── public/               # 公共资源
├── index.html            # HTML入口
└── vite.config.js        # Vite配置
```

## 功能特点

### 页面路由

- 首页 (`/`)
- 关于页面 (`/about`)
- 分类列表 (`/category`)
- 文章详情 (`/articles/:articleId`)
- 留言板 (`/message`)
- 设置页面 (`/settings`)
- 打赏页面 (`/tip`)

### 核心功能

- Markdown 文件直接渲染为页面
- 文章目录自动生成
- 代码块功能增强：
  - 语法高亮
  - 一键复制代码
  - 复制状态反馈
- 留言板功能
- 可自定义主题设置
- 快速的页面加载和渲染
- 响应式设计
- ⬆返回顶部功能
- 打赏功能支持

## 开发设置

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装

```bash
# 克隆项目
git clone git@github.com:jzc12/blog.git   # ssh

# 进入项目目录
cd blog

# 安装依赖
npm install
```

### run

```bash
# 启动开发服务器
npm run dev
```

## 自定义配置

### 主题设置

通过 Settings 页面，你可以自定义：

- 字体大小
- 内容透明度
- 其他主题相关设置

### Markdown 支持

- 支持标准 Markdown 语法
- 自动生成文章目录
- 代码块增强功能：
  - 语法高亮显示
  - 便捷的代码复制按钮
  - 复制成功视觉反馈

## 部署

项目可以部署到任何静态网站托管服务

- GitHub Pages

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

[MIT License](LICENSE)
