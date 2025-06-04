# zc's  blog

## version1

### 1 需求

1. 基础
   - 统一的导航系统
   - 全局状态管理
   - Markdown文章渲染
   - 最新文章列表
2. 页面
   - 首页：个人简介 + 最新文章
   - 关于页：开发者信息
   - 文章页：Markdown内容展示
   - 留言页：

### 2. 架构设计

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
│    └── App.vue
│
├── index.html                  # 基础网址
├── ...
└── README.md
```
