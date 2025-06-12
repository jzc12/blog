import{o as n,c as l,a as o}from"./index-d0800994.js";const i={class:"markdown-body"},s="设计模式",u="2025-06-01T00:00:00.000Z",d="2025-06-03T00:00:00.000Z",h="软件设计",g="软件设计模式实例学习",m={__name:"设计模式",setup(r,{expose:e}){return e({frontmatter:{title:"设计模式",date:"2025-06-01T00:00:00.000Z",updated:"2025-06-03T00:00:00.000Z",category:"软件设计",summary:"软件设计模式实例学习"}}),(a,t)=>(n(),l("div",i,t[0]||(t[0]=[o(`<h1>设计模式</h1><h2>设计原则</h2><h3>面向对象的设计原则</h3><blockquote><p>可维护性、可复用性、重构</p></blockquote><h3>单一职责原则</h3><h3>开闭原则</h3><h3>里氏代换原则</h3><h3>依赖倒转原则</h3><h3>接口隔离原则</h3><h3>合成复用原则</h3><h3>迪米特法则</h3><h2>设计模式</h2><h3>简单工厂模式</h3><blockquote><p>当加入新的产品时，违背了开闭原则</p></blockquote><pre><code class="language-python">class SimpleFactory {
    public Product createProduct(String type) {
        if (type.equals(&quot;A&quot;)) return new ProductA();
        else if (type.equals(&quot;B&quot;)) return new ProductB();
        return null;
    }
}
</code></pre><h3>工厂方法模式</h3><pre><code class="language-python">interface Factory {
    Product createProduct();
}
class FactoryA implements Factory {
    public Product createProduct() { return new ProductA(); }
}
class FactoryB implements Factory {
    public Product createProduct() { return new ProductB(); }
}
</code></pre><h3>抽象工厂模式</h3><pre><code class="language-python">// 轮胎接口
interface Tire {
    void inflate();
}

// 引擎接口
interface Engine {
    void start();
}

// 奔驰轮胎
class BenzTire implements Tire {
    public void inflate() { System.out.println(&quot;奔驰轮胎充气&quot;); }
}

// 奔驰引擎
class BenzEngine implements Engine {
    public void start() { System.out.println(&quot;奔驰引擎启动&quot;); }
}

// 宝马轮胎
class BmwTire implements Tire {
    public void inflate() { System.out.println(&quot;宝马轮胎充气&quot;); }
}

// 宝马引擎
class BmwEngine implements Engine {
    public void start() { System.out.println(&quot;宝马引擎启动&quot;); }
}
</code></pre><h3>状态模式（State Pattern）</h3><p>例如电梯状态：停止、运行、暂停，每种状态下“按按钮”行为不同。</p><h4>类结构图（简略）：</h4><pre><code>Context（上下文）
└── State（抽象状态类）
    ├── ConcreteStateA
    └── ConcreteStateB
</code></pre><h4>C++ 示例：</h4><pre><code class="language-cpp">class State {
public:
    virtual void handle() = 0;
};

class ConcreteStateA : public State {
public:
    void handle() override {
        std::cout &lt;&lt; &quot;State A: Doing A&#39;s logic\\n&quot;;
    }
};

class ConcreteStateB : public State {
public:
    void handle() override {
        std::cout &lt;&lt; &quot;State B: Doing B&#39;s logic\\n&quot;;
    }
};

class Context {
    State* state;
public:
    void setState(State* s) { state = s; }
    void request() { state-&gt;handle(); }
};
</code></pre><hr><h3>命令模式（Command Pattern）</h3><p>将“命令”封装为对象，支持撤销、重做、队列、日志等操作。</p><p>遥控器上的“命令按钮”，每个按钮其实封装了一个命令对象。</p><h4>类结构：</h4><pre><code>Invoker（调用者） --&gt; Command（抽象命令） --&gt; Receiver（实际执行者）
</code></pre><h4>C++ 示例：</h4><pre><code class="language-cpp">class Command {
public:
    virtual void execute() = 0;
};

class Light {
public:
    void on() { std::cout &lt;&lt; &quot;Light is ON\\n&quot;; }
};

class LightOnCommand : public Command {
    Light* light;
public:
    LightOnCommand(Light* l) : light(l) {}
    void execute() override { light-&gt;on(); }
};

class Remote {
    Command* command;
public:
    void setCommand(Command* c) { command = c; }
    void pressButton() { command-&gt;execute(); }
};
</code></pre><hr><h3>适配器模式（Adapter Pattern）</h3><p>把一个类的接口“适配”成客户端期望的形式，解决接口不兼容问题。</p><p>用“三相插头适配器”连接国外电器。</p><h4>类结构：</h4><pre><code>Client --&gt; Target（目标接口）
                   ↑
             Adapter（适配器）-- Adaptee（被适配的类）
</code></pre><h4>C++ 示例：</h4><pre><code class="language-cpp">class Target {
public:
    virtual void request() = 0;
};

class Adaptee {
public:
    void specificRequest() { std::cout &lt;&lt; &quot;SpecificRequest\\n&quot;; }
};

class Adapter : public Target {
    Adaptee* adaptee;
public:
    Adapter(Adaptee* a) : adaptee(a) {}
    void request() override { adaptee-&gt;specificRequest(); }
};
</code></pre><hr><h3>组合模式（Composite Pattern）</h3><p>将对象组合成树状结构，让客户对单个对象和组合对象“统一处理”。</p><p>文件夹和文件是一样的接口，都可以被“打开”。</p><h4>类结构：</h4><pre><code>Component（抽象组件）
├── Leaf（叶子节点）
└── Composite（组合节点） --&gt; 维护 Component 的集合
</code></pre><h4>C++ 示例：</h4><pre><code class="language-cpp">class Component {
public:
    virtual void operation() = 0;
    virtual void add(Component*) {}
};

class Leaf : public Component {
public:
    void operation() override {
        std::cout &lt;&lt; &quot;Leaf\\n&quot;;
    }
};

class Composite : public Component {
    std::vector&lt;Component*&gt; children;
public:
    void add(Component* c) override { children.push_back(c); }
    void operation() override {
        std::cout &lt;&lt; &quot;Composite:\\n&quot;;
        for (auto c : children) c-&gt;operation();
    }
};
</code></pre><hr><h3>单例模式（Singleton Pattern）</h3><p>保证一个类只有一个实例，并提供一个访问它的全局入口。</p><h4>类比：</h4><p>操作系统里的“任务管理器”——系统全局只有一个。</p><h4>C++ 示例：</h4><pre><code class="language-cpp">class Singleton {
private:
    Singleton() {}
public:
    static Singleton&amp; getInstance() {
        static Singleton instance; // C++11 线程安全
        return instance;
    }

    void say() {
        std::cout &lt;&lt; &quot;I&#39;m Singleton!\\n&quot;;
    }

    // 禁用拷贝和赋值
    Singleton(const Singleton&amp;) = delete;
    void operator=(const Singleton&amp;) = delete;
};
</code></pre><h3>观察者模式</h3><p>“被观察者（Subject）状态变化时，自动通知所有观察者（Observer）。”</p><p>举个栗子 🌰：</p><pre><code class="language-java">// 1. 群主（被观察者）
class WeChatGroup {
    private List&lt;Member&gt; members = new ArrayList&lt;&gt;();

    public void addMember(Member m) { members.add(m); }
    public void sendMsg(String msg) {
        for (Member m : members) {
            m.receive(msg); // 群发消息
        }
    }
}

// 2. 群成员（观察者）
class Member {
    public void receive(String msg) {
        System.out.println(&quot;收到消息: &quot; + msg);
    }
}

// 3. 使用
WeChatGroup group = new WeChatGroup();
group.addMember(new Member());
group.addMember(new Member());
group.sendMsg(&quot;今晚聚餐！&quot;); // 所有人自动收到
</code></pre><hr><p>关键点：</p><ul><li>被观察者：维护观察者列表，提供 <code>添加/删除/通知</code> 方法。</li><li>观察者：实现一个接收通知的方法（如 <code>update</code> 或 <code>receive</code>）。</li><li>自动通知：被观察者变化时，一键通知所有观察者。</li></ul><hr><p>适用场景：</p><ul><li>微信/QQ 群消息</li><li>天气预报更新</li><li>游戏里的成就系统（达成条件时自动触发）</li><li>MVC 系统</li></ul><h3>总结</h3><table><thead><tr><th style="text-align:left;"><strong>分类</strong></th><th style="text-align:left;"><strong>解决的核心问题</strong></th><th style="text-align:left;"><strong>典型模式举例</strong></th><th style="text-align:left;"><strong>核心关键词</strong></th></tr></thead><tbody><tr><td style="text-align:left;"><strong>创建型</strong></td><td style="text-align:left;">如何更灵活地创建对象？</td><td style="text-align:left;">单例、工厂、建造者</td><td style="text-align:left;"><strong>实例化控制</strong></td></tr><tr><td style="text-align:left;"><strong>结构型</strong></td><td style="text-align:left;">如何组织类/对象的结构？</td><td style="text-align:left;">适配器、装饰器、代理</td><td style="text-align:left;"><strong>组合扩展</strong></td></tr><tr><td style="text-align:left;"><strong>行为型</strong></td><td style="text-align:left;">对象间如何高效协作？</td><td style="text-align:left;">观察者、策略、责任链</td><td style="text-align:left;"><strong>交互解耦</strong></td></tr></tbody></table><h2>完整的软件开发流程</h2><p>AI生成</p><h3>0. 市场调研 / 立项论证（立项前）</h3><blockquote><p>目的：验证项目是否有做的价值</p></blockquote><ul><li>分析用户需求 / 竞品分析</li><li>商业可行性评估</li><li>技术可行性评估</li><li>成本预算、回报预测</li><li>形成《立项报告》，给领导决策</li></ul><p>🔹产出物：市场分析报告、立项建议书</p><hr><h3>1. 需求分析（Requirement Analysis）</h3><blockquote><p>明确“做什么”，是用户视角</p></blockquote><ul><li>和客户反复沟通、头脑风暴</li><li>写用户故事、用例图</li><li>确定功能列表、非功能需求（性能、安全）</li><li>分优先级（Must、Should、Could、Won’t）</li></ul><p>🔹产出物：需求规格说明书（SRS）</p><hr><h3>2. 设计阶段（Design）</h3><blockquote><p>计划“怎么做”，是开发视角</p></blockquote><h4>高层设计（概要设计）：</h4><ul><li>模块划分（如 MVC）</li><li>技术选型（前后端语言、数据库）</li><li>架构图、接口设计、API 约定</li></ul><h4>详细设计（低层设计）：</h4><ul><li>每个类/模块的职责（类图、顺序图）</li><li>数据库 ER 图设计</li><li>出函数签名、参数定义等</li></ul><p>🔹产出物：设计文档、UML 图、接口文档</p><hr><h3>3. 编码实现（Implementation）</h3><blockquote><p>正式写代码，通常迭代开发，分为多个 Sprint</p></blockquote><ul><li>前后端分工并行开发</li><li>每天 Standup（Scrum）</li><li>版本控制（Git），CI/CD 工具</li><li>遵循编码规范和接口设计文档</li></ul><p>🔹产出物：源代码、提交记录、构建脚本</p><hr><h3>4. 测试阶段（Testing）</h3><blockquote><p>保证软件质量，发现 Bug</p></blockquote><ul><li>单元测试（开发自己写）</li><li>集成测试（多个模块联调）</li><li>系统测试（从用户角度）</li><li>回归测试、性能测试、安全测试</li></ul><p>🔹产出物：测试计划、测试用例、测试报告</p><hr><h3>5. 部署上线（Deployment）</h3><blockquote><p>将测试通过的软件部署到用户环境</p></blockquote><ul><li>打包构建（Docker、CI/CD）</li><li>部署到服务器或云平台（如 AWS、阿里云）</li><li>数据迁移、备份</li><li>灰度发布 / 蓝绿发布</li><li>发布文档、用户手册</li></ul><p>🔹产出物：部署文档、上线日志</p><hr><h3>6. 运维与维护（Maintenance）</h3><blockquote><p>上线后继续修复、优化、收集用户反馈</p></blockquote><ul><li>监控系统（如 Prometheus、Sentry）</li><li>日志采集、告警系统</li><li>用户反馈渠道</li><li>Bug 修复、功能增强</li><li>安全补丁更新</li></ul><p>🔹产出物：运维报告、补丁记录</p><hr><h3>7. 结项 &amp; 复盘（可选）</h3><blockquote><p>总结项目经验，为后续项目提供借鉴</p></blockquote><ul><li>成果总结（功能完成情况）</li><li>成本、进度、质量复盘</li><li>技术债梳理、团队协作反思</li></ul><p>🔹产出物：项目复盘报告、知识沉淀文档</p><hr><h3>总结</h3><blockquote><p>从立项前开始，首先进行市场调研和立项评估，之后进入需求分析阶段，确定用户和系统需求。接下来是设计阶段，做架构设计和详细模块划分，然后进入编码实现。在开发完成后进入测试阶段，包括单元、集成和系统测试。测试通过后部署上线，最后是维护和复盘。整个过程通常是迭代式进行。</p></blockquote><pre><code>立项论证 —— 能不能做
需求分析 —— 要做什么
系统设计 —— 怎么做
编码实现 —— 开始做
软件测试 —— 测一测
部署上线 —— 给人用
运维维护 —— 修修补补
项目复盘 —— 复盘总结
</code></pre>`,116)])))}};export{h as category,u as date,m as default,g as summary,s as title,d as updated};
