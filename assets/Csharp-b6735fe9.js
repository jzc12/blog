import{o as t,c as s,a as r}from"./index-6c41d113.js";const o={class:"markdown-body"},l="2025-06-25T00:00:00.000Z",u="2025-07-29T00:00:00.000Z",p="c#",d="WPF 框架学习",m={__name:"Csharp",setup(a,{expose:n}){return n({frontmatter:{date:"2025-06-25T00:00:00.000Z",updated:"2025-07-29T00:00:00.000Z",category:"c#",summary:"WPF 框架学习"}}),(g,e)=>(t(),s("div",o,e[0]||(e[0]=[r(`<h2>字段、属性</h2><pre><code class="language-c#">private DelegateCommand _temp;
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
</code></pre></blockquote><h2>发布订阅模式</h2><h3>c#</h3><blockquote><p>基于Prism.Events</p></blockquote><p>定义事件类</p><pre><code class="language-c#">using Prism.Events;
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
</code></pre><blockquote><p>Prism 框架提供了事件总线，在这个框架下使用发布-订阅模式，实现松耦合，跨模块通信的目的</p></blockquote><blockquote><p>python 的 PyPubSub、java 的 ApplicationEvent、node.js 的 EventEmitter、vue 的 Event Bus</p></blockquote><pre><code class="language-js">// Event Bus (main.js)
import { createApp } from &#39;vue&#39;
import mitt from &#39;mitt&#39;
const emitter = mitt()
const app = createApp(App)
app.config.globalProperties.$emitter = emitter

// 发布者 (AuthService.vue)
methods: {
    login(username) {
        this.$emitter.emit(&#39;userLoggedIn&#39;, username)
    }
}

// 订阅者 (NotificationService.vue)
mounted() {
    this.$emitter.on(&#39;userLoggedIn&#39;, (username) =&gt; {
        console.log(\`发送登录通知: \${username} 已登录\`)
    })
},
beforeUnmount() {
    this.$emitter.off(&#39;userLoggedIn&#39;) // 清理
}
</code></pre><hr><pre><code class="language-python">from pubsub import pub

# 发布者
class AuthService:
    def login(self, username):
        pub.sendMessage(&#39;user_logged_in&#39;, username=username)

# 订阅者
class NotificationService:
    def __init__(self):
        pub.subscribe(self.notify, &#39;user_logged_in&#39;)
    
    def notify(self, username):
        print(f&quot;发送登录通知: {username} 已登录&quot;)

# 使用
auth = AuthService()
notifier = NotificationService()
auth.login(&quot;Alice&quot;)
</code></pre><hr><pre><code class="language-java">// 事件类
public class UserLoggedInEvent extends ApplicationEvent {
    private String username;
    
    public UserLoggedInEvent(Object source, String username) {
        super(source);
        this.username = username;
    }
}

// 发布者
@Service
public class AuthService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public void login(String username) {
        eventPublisher.publishEvent(new UserLoggedInEvent(this, username));
    }
}

// 订阅者
@Component
public class NotificationService {
    @EventListener
    public void handleLogin(UserLoggedInEvent event) {
        System.out.println(&quot;发送登录通知: &quot; + event.getUsername() + &quot; 已登录&quot;);
    }
}
</code></pre><hr><pre><code class="language-js">const EventEmitter = require(&#39;events&#39;);

// 全局事件总线
const eventBus = new EventEmitter();

// 发布者
class AuthService {
    login(username) {
        eventBus.emit(&#39;userLoggedIn&#39;, username);
    }
}

// 订阅者
class NotificationService {
    constructor() {
        eventBus.on(&#39;userLoggedIn&#39;, (username) =&gt; {
            console.log(\`发送登录通知: \${username} 已登录\`);
        });
    }
}

// 使用
const auth = new AuthService();
const notifier = new NotificationService();
auth.login(&#39;Alice&#39;);
</code></pre><pre><code class="language-mermaid">graph TD
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
</code></pre>`,33)])))}};export{p as category,l as date,m as default,d as summary,u as updated};
