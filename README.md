# zc's  blog

## version1

### 1 需求

1. 基础
   - 统一的导航系统
   - 全局状态管理
   - Markdown文章渲染
   - 标签系统
   - 最新文章列表
2. 页面
    - 首页：个人简介 + 最新文章
    - 关于页：开发者信息
    - 分类页：自动索引目录结构
    - 标签页：文章标签聚合
    - 文章页：Markdown内容展示

### 2. 架构设计

```text
App
├── Layout
│   ├── Sidebar (导航菜单)
│   └── Content
│       ├── Home
│       ├── About
│       ├── Category
│       │   ├── CategoryList
│       │   └── PostList
│       └── Tag
└── 全局状态管理
```

```text
App
├── src/
│    ├── assets/
│    ├── css/                   # 样式文件
│    ├── router/
│    │   └── index.js           # 路由配置
│    ├── utils/
│    │   └── markdown.js        # MD处理工具
│    ├── views/
│    │   ├── Home.vue           # 首页
│    │   ├── About.vue          # 关于页
│    │   ├── Category.vue       # 分类页
│    │   ├── Tag.vue            # 标签页
│    │   └── Post.vue           # 文章页
│    └── App.vue
│
├── index.html                  # 基础网址
├── ...
└── README.md
```
