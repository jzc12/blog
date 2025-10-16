import{o as n,c as a,a as o}from"./index-649ba9d8.js";const s={class:"markdown-body"},p="2025-06-25T00:00:00.000Z",d="2025-07-29T00:00:00.000Z",g="c#",u="WPF 框架学习",k={__name:"Csharp",setup(l,{expose:t}){return t({frontmatter:{date:"2025-06-25T00:00:00.000Z",updated:"2025-07-29T00:00:00.000Z",category:"c#",summary:"WPF 框架学习"}}),(c,e)=>(n(),a("div",s,e[0]||(e[0]=[o(`<h2>字段、属性</h2><pre><code class="language-c#">private DelegateCommand _temp;
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
</code></pre></blockquote><h2>发布订阅模式</h2><blockquote><p>基于Prism.Events</p></blockquote><p>定义事件类</p><pre><code class="language-c#">using Prism.Events;
public class MessageSentEvent : PubSubEvent { }			  // 无参数
public class UserLoggedInEvent : PubSubEvent&lt;string&gt; { }  // 有参数
</code></pre><p>发布事件</p><pre><code class="language-c#">public class PublisherViewModel
{
    private readonly IEventAggregator _eventAggregator;

    // 通过依赖注入获取事件聚合器
    public PublisherViewModel(IEventAggregator eventAggregator)
    {
        _eventAggregator = eventAggregator;
    }

    public void SendMessage()
    {
        _eventAggregator.GetEvent&lt;MessageSentEvent&gt;().Publish();
        _eventAggregator.GetEvent&lt;UserLoggedInEvent&gt;().Publish(&quot;Alice&quot;);
    }
}
</code></pre><p>订阅事件</p><pre><code class="language-c#">public class SubscriberViewModel : IDisposable
{
    private SubscriptionToken _messageToken;
    private SubscriptionToken _userToken;

    public SubscriberViewModel(IEventAggregator eventAggregator)
    {
        var messageEvent = eventAggregator.GetEvent&lt;MessageSentEvent&gt;();
        _messageToken = messageEvent.Subscribe(OnMessageReceived);

        var userEvent = eventAggregator.GetEvent&lt;UserLoggedInEvent&gt;();
        _userToken = userEvent.Subscribe(
            userName =&gt; OnUserLoggedIn(userName),
            ThreadOption.UIThread, 					// 指定在 UI 线程执行
            keepSubscriberReferenceAlive: false,    // 避免内存泄漏
            filter: name =&gt; name.StartsWith(&quot;A&quot;)    // 只处理用户名以 A 开头的事件
        );
    }

    private void OnMessageReceived()
    {
        Console.WriteLine(&quot;Message received!&quot;);
    }

    private void OnUserLoggedIn(string userName)
    {
        Console.WriteLine($&quot;User logged in: {userName}&quot;);
    }
	
    // Dispose 函数需要手动调用，确保资源被正确释放
    public void Dispose()
    {
        eventAggregator.GetEvent&lt;MessageSentEvent&gt;().Unsubscribe(_messageToken);
        eventAggregator.GetEvent&lt;MessageSentEvent&gt;().Unsubscribe(_userToken);
    }
}
</code></pre><blockquote><p>Prism 框架提供了事件总线，在这个框架下使用发布-订阅模式，实现松耦合，跨模块通信的目的</p></blockquote><pre><code class="language-mermaid">graph TD
    subgraph  
        EventBus[事件总线]
        style EventBus fill:#9fefde,stroke:#333
            
        事件1[事件A]
        事件2[事件B]
    end
        
    发布者1[发布者1] --&gt;|发布事件A消息| 事件1
    发布者2[发布者2] --&gt;|发布事件B消息| 事件2
        
    事件1 --&gt;|通知| 订阅者1[订阅者1]
    事件1 --&gt;|通知| 订阅者2[订阅者2]
    事件2 --&gt;|通知| 订阅者2
    事件2 --&gt;|通知| 订阅者3[订阅者3]
        
    classDef publisher fill:#ffd6cc,stroke:#333;
    classDef subscriber fill:#ccddff,stroke:#333;
    classDef topic fill:#e6f9e6,stroke:#333;
    classDef _graph fill:#e6f9e6,stroke:#333;
        
    class 发布者1,发布者2,发布者3 publisher
    class 事件1,事件2,事件3 topic
    class 订阅者1,订阅者2,订阅者3,订阅者4 subscriber
</code></pre><h2>Summary</h2><h3>知识点总结</h3><h4>（1）MVVM模式总结</h4><blockquote><p>部分组件前后端都进行更改的话，前后端的值可能要单独进行设置</p></blockquote><p>例如 ： TreeView 的 IsSelected 的项，如果需要后端设置默认的值，但是前端初始化是没有选择的项的，需要手动设置</p><blockquote><p>多个子模块的大型程序，子模块的初始化时机</p></blockquote><p>prism 通信，某些模块未初始化，而且首次启动、初始化有明显时延，影响用户体验</p><blockquote><p>静态类、单例模式、DI + 单例模式</p></blockquote><blockquote><p>Parallel.For 并行化</p></blockquote><pre><code class="language-c#">using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void Main()
    {
        const int N = 10000000;
        long total = 0;

        // 顺序执行版本
        var watch = System.Diagnostics.Stopwatch.StartNew();
        for (int i = 0; i &lt; N; i++)
        {
            total += (long)i * i;
        }
        watch.Stop();
        Console.WriteLine($&quot;顺序执行: 总和 = {total}, 耗时 = {watch.ElapsedMilliseconds}ms&quot;);

        total = 0; // 重置计数器

        // 并行执行版本（线程不安全示例 - 仅用于演示错误结果）
        watch.Restart();
        Parallel.For(0, N, i =&gt;
        {
            // 警告：这是线程不安全的操作！
            // 多个线程同时修改total会导致数据竞争和错误结果
            total += (long)i * i;
        });
        watch.Stop();
        Console.WriteLine($&quot;并行执行（不安全）: 总和 = {total}, 耗时 = {watch.ElapsedMilliseconds}ms&quot;);
        Console.WriteLine($&quot;注意：不安全版本的结果 {total} 是错误的（应接近 {3333332833333330000})&quot;);

        total = 0; // 重置计数器

        // 解决方案1：使用Interlocked实现原子操作（适合简单操作）
        watch.Restart();
        Parallel.For(0, N, i =&gt;
        {
            long square = (long)i * i;
            Interlocked.Add(ref total, square); // 原子加法操作
        });
        watch.Stop();
        Console.WriteLine($&quot;\\n方案1 (Interlocked): 总和 = {total}, 耗时 = {watch.ElapsedMilliseconds}ms&quot;);

        total = 0; // 重置计数器

        // 解决方案2：使用锁（适合复杂操作）
        object lockObj = new object();
        watch.Restart();
        Parallel.For(0, N, i =&gt;
        {
            long square = (long)i * i;
            lock (lockObj) // 确保每次只有一个线程访问total
            {
                total += square;
            }
        });
        watch.Stop();
        Console.WriteLine($&quot;方案2 (Lock): 总和 = {total}, 耗时 = {watch.ElapsedMilliseconds}ms&quot;);

        total = 0; // 重置计数器

        // 解决方案3：使用线程本地存储（最高效的方法）
        watch.Restart();
        Parallel.For&lt;long&gt;( // 指定线程本地状态类型为long
            0,              // 起始索引（包含）
            N,              // 结束索引（不包含）
            () =&gt; 0,        // 初始化每个线程的本地状态（初始值0）
            (i, loopState, localSum) =&gt; // 循环体委托
            {
                // 使用线程本地变量进行计算（无竞争）
                return localSum + (long)i * i; 
            },
            (finalLocalSum) =&gt; // 合并每个线程的最终结果
            {
                // 原子操作合并结果
                Interlocked.Add(ref total, finalLocalSum);
            }
        );
        watch.Stop();
        Console.WriteLine($&quot;方案3 (线程本地存储): 总和 = {total}, 耗时 = {watch.ElapsedMilliseconds}ms&quot;);
    }
}
</code></pre><h4>（2）</h4><p>$\\color{red} \\text{问题：需要由执行函数去调用下一个执行，这样栈内存的占用就一直没释放}$ ，执行函数长回调，递归深度问题，栈溢出风险</p><blockquote><p>初始版本循环查询IsCancellationRequested，长回调，递归深度可能很深，栈迟迟不释放，可能导致栈溢出风险</p></blockquote><pre><code class="language-c#">private async Task ProcessTaskQueueAsync(CancellationToken token)
{
    while (!token.IsCancellationRequested)
    {
        TaskInfoModel task;
        if (pendingTasks.Count == 0) return;
        task = pendingTasks.Dequeue();

        try
        {
            var taskError = await TaskExecuteService.TaskExecute(task, token);
            await ExecuteSingleTask(task, token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, &quot;Task failed&quot;);
        }
    }
}
</code></pre><blockquote><p>初步优化， <code>Task.Run</code>包装递归调用，转移栈的需求到线程池中</p></blockquote><pre><code class="language-c#">private async Task ProcessTaskQueueAsync(CancellationToken token)
{
    TaskInfoModel task;
    if (pendingTasks.Count == 0) return;
    task = pendingTasks.Dequeue();

    try
    {
		var taskError = await TaskExecuteService.TaskExecute()
        TaskInfoModel next = pendingTasks.FirstOrDefault();
        await Task.Run(() =&gt; ExecuteTaskInBackground(next, token));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, &quot;Task failed&quot;);
    }
}
</code></pre><blockquote><p>上述始终没有解决一个问题，需要由执行函数去调用下一个执行，这样栈内存的占用就一直没释放</p><p>最终</p></blockquote><pre><code class="language-c#">public class TaskProcessor : IDisposable
{
    private readonly Channel；
</code></pre><p>Channel 本质上是一个线程安全的队列，它改变了任务处理的方式：</p><p>传统递归 vs Channel 方案对比</p><table><thead><tr><th>特性</th><th>递归方案</th><th>Channel 方案</th></tr></thead><tbody><tr><td>调用结构</td><td>嵌套调用</td><td>循环迭代</td></tr><tr><td>栈行为</td><td>深度增长</td><td>恒定深度</td></tr><tr><td>内存占用</td><td>O(n) 增长</td><td>O(1) 恒定</td></tr><tr><td>任务处理</td><td>链式执行</td><td>队列消费</td></tr><tr><td>资源释放</td><td>任务完成后</td><td>每个任务完成后立即释放</td></tr></tbody></table><pre><code class="language-c#">await foreach (var task in _taskQueue.Reader.ReadAllAsync(globalToken))
{
    await ProcessSingleTask(task);
}
</code></pre><ol><li><p>异步状态机工作原理：</p><p>• 编译器将 <code>async/await</code> 转换为状态机</p><p>• 每次 <code>await</code> 时，当前方法&quot;返回&quot;，释放栈帧</p><p>• 任务完成后，从上次中断处继续执行</p></li><li><p>栈帧复用：</p><p>• 每个任务完成后，整个调用栈完全释放</p><p>• 处理下一个任务时，重用相同的调用层级</p><p>• 无论处理多少任务，栈深度保持恒定</p></li><li><p>内存效率：</p><pre><code class="language-mermaid">graph LR
A[任务1开始] --&gt; B[await 任务1]
B --&gt; C[栈释放]
C --&gt; D[任务2开始]
D --&gt; E[await 任务2]
E --&gt; F[栈释放]
F --&gt; G[...]
</code></pre></li><li><p>内置异步支持：</p><pre><code class="language-c#">// 等待新任务到达（不阻塞线程）
await foreach (var task in channel.Reader.ReadAllAsync())
</code></pre></li><li><p>背压控制：</p><p>• 当队列满时，自动阻塞添加操作</p><p>• 防止内存无限增长</p></li><li><p>取消集成：</p><pre><code class="language-c#">await channel.Reader.ReadAsync(cancellationToken);
</code></pre></li></ol><p>简化版 Channel 处理器：</p><pre><code class="language-c#">public class SimpleTaskProcessor
{
    private readonly Channel&lt;TaskInfoModel&gt; _channel = 
        Channel.CreateUnbounded&lt;TaskInfoModel&gt;();
    
    public async Task StartProcessing(CancellationToken token)
    {
        await foreach (var task in _channel.Reader.ReadAllAsync(token))
        {
            await ProcessTask(task, token);
        }
    }
    
    private async Task ProcessTask(TaskInfoModel task, CancellationToken token)
    {
        await Task.Delay(100, token);
    }
    
    public void AddTask(TaskInfoModel task) =&gt; 
        _channel.Writer.TryWrite(task);
}
</code></pre><h4>（3）</h4><p>需求变更，需要往MVVM 模式中添加对外的服务功能接口</p><h3>设计文档说明</h3><h4>adb</h4><p><a href="https://jzc12.site/articles/adb">代码</a></p><h5>一、整体架构</h5><p>设计分为三个核心文件：</p><ol><li>AdbService：静态类，作为对外服务的接口层。它负责ADB服务的启动与关闭、设备连接管理以及操作命令的转发。其他模块通过调用AdbService提供的方法来使用ADB功能。</li><li>DevicesManager：设备管理类，负责记录和管理已连接的设备信息，包括当前选中的设备序列号（_currentDeviceSerial）以及设备列表（ConnectedDevices）。</li><li>DevicesOperate：设备操作类，封装了具体的ADB设备操作。它依赖于 DevicesManager 来获取当前操作的设备。</li></ol><blockquote><p>注意：AdbService 依赖于 DevicesManager 和 DevicesOperate 来实现功能，而 DevicesOperate 又依赖于 DevicesManager 来获取当前设备。</p></blockquote><h5>二、详细设计</h5><p>（1）ADB服务管理（启动与关闭）</p><p>• 启动服务：在AdbService.Initialize()方法中调用StartAdbServerAsync()来启动ADB服务。该方法使用信号量（SemaphoreSlim）进行节流，确保同一时间只有一个启动操作。启动成功后会设置_isStopped标志为false。</p><p>• 关闭服务：通过StopServer()方法同步关闭ADB服务。关闭后设置_isStopped为true。</p><blockquote><p>注意：启动ADB服务可能需要10秒左右的时间，因此采用异步方式。关闭服务在程序退出时调用。</p></blockquote><p>（2）$\\color {red} \\text{注意}$ 设备连接管理</p><p>设备连接有两种方式：网络连接和USB连接。连接状态通过事件ConnectionStatusChanged通知前端。</p><ol><li><p>网络连接： • 调用ConnectDeviceAsync(ipAddress, port, code)方法进行连接（如果提供配对码code，则使用配对模式）。</p><p>• 连接成功后，设备序列号（serial）格式为ip:port（如192.168.1.100:5555），并记录到_NetSerials列表中（用于区分USB设备）。</p><p>• 然后调用 RefreshDevices(serial, isUsb: false) 更新设备列表并设置当前设备。</p></li><li><p>USB连接： • USB设备由ADB自动检测和连接。当用户选择USB设备时，调用RefreshDevices(serial, isUsb: true)来更新当前设备。</p><p>• 在RefreshDevices中，通过GetDeviceData方法查找设备。对于USB设备，如果传入的序列号不在_NetSerials中，则默认选择第一个USB设备（因为USB设备通常只有一个，而且没有其他方法）。</p></li><li><p>设备状态通知： • 无论连接成功或失败，都通过NotifyConnectionStatus方法触发ConnectionStatusChanged事件，传递ConnectStatus结构体（包含成功标志、设备名、序列号和结果消息）。</p></li></ol><blockquote><p>关键点：RefreshDevices方法用于更新设备列表并设置当前设备。adb.exe 连接后，程序需要记录信息，RefreshDevices 函数会 调用_devicesManager 记录</p></blockquote><p>（3）功能实现</p><ol><li>需要 DevicesManager 获取当前的设备信息（连接的时候已经实现）</li><li>具体详细的功能实现在 DevicesOperate 类中</li><li>AdbService 进行封装，对外提供接口</li></ol><h4>AspNet</h4><ol><li>Gateway 网关服务，实现请求路由转发，后端启动</li></ol>`,71)])))}};export{g as category,p as date,k as default,u as summary,d as updated};
