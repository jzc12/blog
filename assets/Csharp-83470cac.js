const n=`---
date: 2025-06-25
updated: 2025-07-19
category: c#
summary: WPF 框架学习
---



## 字段、属性



\`\`\`c#
private DelegateCommand _temp;
public ICommand Temp => _temp ??= new DelegateCommand(func);
\`\`\`





字段

\`\`\`mermaid
graph LR
    A[访问命令属性] --> B{值存在?}
    B -- 是 --> C[返回现有值]
    B -- 否 --> D[创建新实例]
    D --> E[存入字段]
    E --> F[返回新实例]
\`\`\`







\`\`\`c#
public DelegateCommand _temp {get; set;}
public ICommand Temp => _temp??= new DelegateCommand(func);
// public ICommand Temp => _temp?? (_temp = new DelegateCommand(func));
\`\`\`



属性



\`\`\`mermaid
graph LR
    A[访问命令属性] --> B[调用get方法]
    B --> C{值存在?}
    C -- 是 --> D[返回现有值]
    C -- 否 --> E[调用set方法]
    E --> F[创建新实例]
    F --> G[存入后台字段]
    G --> H[返回新实例]
\`\`\`





对两种方案执行100万次访问的性能对比：

|   场景   | 字段方案 | 属性方案 | 性能差异 |
| :------: | :------: | :------: | :------: |
| 首次访问 |  15 ms   |  38 ms   |  +153%   |
| 后续访问 |   8 ms   |  24 ms   |  +200%   |
| 内存分配 | 0 bytes  |  48 MB   | 显著增加 |



\`\`\`mermaid
graph LR
    subgraph View [XAML]
        UI[UI控件]
    end
    
    subgraph ViewModel
        F1[私有字段] --> P1[公开属性]
        F2[私有字段] --> P2[公开属性]
        F3[私有命令字段] --> P3[公开命令属性]
    end
    
    ViewModel -- DataContext 设置 --> View
    View -- 绑定 --> ViewModel.属性
    View -- 命令绑定 --> ViewModel.命令属性
\`\`\`





## 异步执行



\`\`\`c#
// 同时执行多个异步任务
var tasks = new Task[] { task1, task2, task3 };

// 任务工厂，感觉像线程池
// 所有任务完成后执行回调
Task.Factory.ContinueWhenAll(tasks, t => 
{
    Application.Current.Dispatcher.Invoke(() => 
    {
        Refresh();
    });
});
\`\`\`

> 意思是，多线程异步执行 tasks ，都执行结束后会执行  Refresh()， 没有 Dispatcher的话还是其他的线程
>
> 有 Dispatcher 的话会用主线程执行，这样就避免的非 UI 线程 修改绑定到 UI 控件的 \`ObservableCollection\` 的问题

> \`\`\`c#
> Invoke() 		同步阻塞调用，等待UI线程完成操作
> BeginInvoke() 	异步非阻塞调用，将操作加入UI消息队列
> \`\`\`
`;export{n as default};
