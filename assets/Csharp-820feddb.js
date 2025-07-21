import{o as n,c as a,a as c}from"./index-16261d0b.js";const r={class:"markdown-body"},g="2025-06-25T00:00:00.000Z",p="2025-07-19T00:00:00.000Z",m="c#",i="WPF 框架学习",u={__name:"Csharp",setup(s,{expose:e}){return e({frontmatter:{date:"2025-06-25T00:00:00.000Z",updated:"2025-07-19T00:00:00.000Z",category:"c#",summary:"WPF 框架学习"}}),(d,t)=>(n(),a("div",r,t[0]||(t[0]=[c(`<h2>字段、属性</h2><pre><code class="language-c#">private DelegateCommand _temp;
public ICommand Temp =&gt; _temp ??= new DelegateCommand(func);
</code></pre><p>字段</p><pre><code class="language-mermaid">graph LR
    A[访问命令属性] --&gt; B{值存在?}
    B -- 是 --&gt; C[返回现有值]
    B -- 否 --&gt; D[创建新实例]
    D --&gt; E[存入字段]
    E --&gt; F[返回新实例]
</code></pre><pre><code class="language-c#">public DelegateCommand _temp {get; set;}
public ICommand Temp =&gt; _temp??= new DelegateCommand(func);
// public ICommand Temp =&gt; _temp?? (_temp = new DelegateCommand(func));
</code></pre><p>属性</p><pre><code class="language-mermaid">graph LR
    A[访问命令属性] --&gt; B[调用get方法]
    B --&gt; C{值存在?}
    C -- 是 --&gt; D[返回现有值]
    C -- 否 --&gt; E[调用set方法]
    E --&gt; F[创建新实例]
    F --&gt; G[存入后台字段]
    G --&gt; H[返回新实例]
</code></pre><p>对两种方案执行100万次访问的性能对比：</p><table><thead><tr><th style="text-align:center;">场景</th><th style="text-align:center;">字段方案</th><th style="text-align:center;">属性方案</th><th style="text-align:center;">性能差异</th></tr></thead><tbody><tr><td style="text-align:center;">首次访问</td><td style="text-align:center;">15 ms</td><td style="text-align:center;">38 ms</td><td style="text-align:center;">+153%</td></tr><tr><td style="text-align:center;">后续访问</td><td style="text-align:center;">8 ms</td><td style="text-align:center;">24 ms</td><td style="text-align:center;">+200%</td></tr><tr><td style="text-align:center;">内存分配</td><td style="text-align:center;">0 bytes</td><td style="text-align:center;">48 MB</td><td style="text-align:center;">显著增加</td></tr></tbody></table><pre><code class="language-mermaid">graph LR
    subgraph View [XAML]
        UI[UI控件]
    end
    
    subgraph ViewModel
        F1[私有字段] --&gt; P1[公开属性]
        F2[私有字段] --&gt; P2[公开属性]
        F3[私有命令字段] --&gt; P3[公开命令属性]
    end
    
    ViewModel -- DataContext 设置 --&gt; View
    View -- 绑定 --&gt; ViewModel.属性
    View -- 命令绑定 --&gt; ViewModel.命令属性
</code></pre><h2>异步执行</h2><pre><code class="language-c#">// 同时执行多个异步任务
var tasks = new Task[] { task1, task2, task3 };

// 任务工厂，感觉像线程池
// 所有任务完成后执行回调
Task.Factory.ContinueWhenAll(tasks, t =&gt; 
{
    Application.Current.Dispatcher.Invoke(() =&gt; 
    {
        Refresh();
    });
});
</code></pre><blockquote><p>意思是，多线程异步执行 tasks ，都执行结束后会执行 Refresh()， 没有 Dispatcher的话还是其他的线程</p><p>有 Dispatcher 的话会用主线程执行，这样就避免的非 UI 线程 修改绑定到 UI 控件的 <code>ObservableCollection</code> 的问题</p></blockquote><blockquote><pre><code class="language-c#">Invoke() 		同步阻塞调用，等待UI线程完成操作
BeginInvoke() 	异步非阻塞调用，将操作加入UI消息队列
</code></pre></blockquote>`,14)])))}};export{m as category,g as date,u as default,i as summary,p as updated};
