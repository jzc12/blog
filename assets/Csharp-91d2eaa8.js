const n=`---
date: 2025-06-25
updated: 2025-07-29
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



## 发布订阅模式



### c#

> 基于Prism.Events

定义事件类

\`\`\`c#
using Prism.Events;
public class MessageSentEvent : PubSubEvent { }			  // 无参数
public class UserLoggedInEvent : PubSubEvent<string> { }  // 有参数
\`\`\`



发布事件

\`\`\`c#
public class PublisherViewModel
{
    private readonly IEventAggregator _eventAggregator;

    // 通过依赖注入获取事件聚合器
    public PublisherViewModel(IEventAggregator eventAggregator)
    {
        _eventAggregator = eventAggregator;
    }

    public void SendMessage()
    {
        _eventAggregator.GetEvent<MessageSentEvent>().Publish();
        _eventAggregator.GetEvent<UserLoggedInEvent>().Publish("Alice");
    }
}
\`\`\`



订阅事件

\`\`\`c#
public class SubscriberViewModel : IDisposable
{
    private SubscriptionToken _messageToken;
    private SubscriptionToken _userToken;

    public SubscriberViewModel(IEventAggregator eventAggregator)
    {
        var messageEvent = eventAggregator.GetEvent<MessageSentEvent>();
        _messageToken = messageEvent.Subscribe(OnMessageReceived);

        var userEvent = eventAggregator.GetEvent<UserLoggedInEvent>();
        _userToken = userEvent.Subscribe(
            userName => OnUserLoggedIn(userName),
            ThreadOption.UIThread, 					// 指定在 UI 线程执行
            keepSubscriberReferenceAlive: false,    // 避免内存泄漏
            filter: name => name.StartsWith("A")    // 只处理用户名以 A 开头的事件
        );
    }

    private void OnMessageReceived()
    {
        Console.WriteLine("Message received!");
    }

    private void OnUserLoggedIn(string userName)
    {
        Console.WriteLine($"User logged in: {userName}");
    }
	
    // Dispose 函数需要手动调用，确保资源被正确释放
    public void Dispose()
    {
        eventAggregator.GetEvent<MessageSentEvent>().Unsubscribe(_messageToken);
        eventAggregator.GetEvent<MessageSentEvent>().Unsubscribe(_userToken);
    }
}
\`\`\`

> Prism 框架提供了事件总线，在这个框架下使用发布-订阅模式，实现松耦合，跨模块通信的目的



> python 的 PyPubSub、java 的 ApplicationEvent、node.js 的 EventEmitter、vue 的 Event Bus

\`\`\`js
// Event Bus (main.js)
import { createApp } from 'vue'
import mitt from 'mitt'
const emitter = mitt()
const app = createApp(App)
app.config.globalProperties.$emitter = emitter

// 发布者 (AuthService.vue)
methods: {
    login(username) {
        this.$emitter.emit('userLoggedIn', username)
    }
}

// 订阅者 (NotificationService.vue)
mounted() {
    this.$emitter.on('userLoggedIn', (username) => {
        console.log(\`发送登录通知: \${username} 已登录\`)
    })
},
beforeUnmount() {
    this.$emitter.off('userLoggedIn') // 清理
}
\`\`\`

---

\`\`\`python
from pubsub import pub

# 发布者
class AuthService:
    def login(self, username):
        pub.sendMessage('user_logged_in', username=username)

# 订阅者
class NotificationService:
    def __init__(self):
        pub.subscribe(self.notify, 'user_logged_in')
    
    def notify(self, username):
        print(f"发送登录通知: {username} 已登录")

# 使用
auth = AuthService()
notifier = NotificationService()
auth.login("Alice")
\`\`\`

---

\`\`\`java
// 事件类
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
        System.out.println("发送登录通知: " + event.getUsername() + " 已登录");
    }
}
\`\`\`

---

\`\`\`js
const EventEmitter = require('events');

// 全局事件总线
const eventBus = new EventEmitter();

// 发布者
class AuthService {
    login(username) {
        eventBus.emit('userLoggedIn', username);
    }
}

// 订阅者
class NotificationService {
    constructor() {
        eventBus.on('userLoggedIn', (username) => {
            console.log(\`发送登录通知: \${username} 已登录\`);
        });
    }
}

// 使用
const auth = new AuthService();
const notifier = new NotificationService();
auth.login('Alice');
\`\`\`



\`\`\`mermaid
graph TD
    subgraph  
        EventBus[事件总线]
        style EventBus fill:#9fefde,stroke:#333
            
        事件1[事件A]
        事件2[事件B]
    end
        
    发布者1[发布者1] -->|发布事件A消息| 事件1
    发布者2[发布者2] -->|发布事件B消息| 事件2
        
    事件1 -->|通知| 订阅者1[订阅者1]
    事件1 -->|通知| 订阅者2[订阅者2]
    事件2 -->|通知| 订阅者2
    事件2 -->|通知| 订阅者3[订阅者3]
        
    classDef publisher fill:#ffd6cc,stroke:#333;
    classDef subscriber fill:#ccddff,stroke:#333;
    classDef topic fill:#e6f9e6,stroke:#333;
    classDef _graph fill:#e6f9e6,stroke:#333;
        
    class 发布者1,发布者2,发布者3 publisher
    class 事件1,事件2,事件3 topic
    class 订阅者1,订阅者2,订阅者3,订阅者4 subscriber
\`\`\`
`;export{n as default};
