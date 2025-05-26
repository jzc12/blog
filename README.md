# zc’s  blog

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

```python
App
├── src/
│    ├── assets/
│    ├── components/
│    │   ├── Layout.vue         # 主布局组件（包含sidebar和content）
│    │   ├── Sidebar.vue        # 侧边栏导航
│    │   ├── MarkdownView.vue   # MD渲染组件
│    │   └── PostList.vue       # 文章列表组件
│    ├── contents/              # 内容目录
│    │   ├── posts/             # 所有文章
│    │   └── categories/        # 分类目录（可嵌套）
│    ├── router/
│    │   └── index.js           # 路由配置
│    ├── stores/                # Pinia状态管理
│    │   └── usePosts.js        # 文章相关状态
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
