const n=`---
title: 设计模式
date: 2025-06-01
updated: 2025-06-02
category: 软件设计
summary: 软件设计模式实例学习
---
# 设计模式

## 设计原则

### 面向对象的设计原则

> 可维护性、可复用性、重构

### 单一职责原则

### 开闭原则

### 里氏代换原则

### 依赖倒转原则

### 接口隔离原则

### 合成复用原则

### 迪米特法则

## 设计模式



### 简单工厂模式

> 当加入新的产品时，违背了开闭原则

\`\`\`python
class SimpleFactory {
    public Product createProduct(String type) {
        if (type.equals("A")) return new ProductA();
        else if (type.equals("B")) return new ProductB();
        return null;
    }
}
\`\`\`

### 工厂方法模式

\`\`\`python
interface Factory {
    Product createProduct();
}
class FactoryA implements Factory {
    public Product createProduct() { return new ProductA(); }
}
class FactoryB implements Factory {
    public Product createProduct() { return new ProductB(); }
}
\`\`\`

### 抽象工厂模式

\`\`\`	python
// 轮胎接口
interface Tire {
    void inflate();
}

// 引擎接口
interface Engine {
    void start();
}

// 奔驰轮胎
class BenzTire implements Tire {
    public void inflate() { System.out.println("奔驰轮胎充气"); }
}

// 奔驰引擎
class BenzEngine implements Engine {
    public void start() { System.out.println("奔驰引擎启动"); }
}

// 宝马轮胎
class BmwTire implements Tire {
    public void inflate() { System.out.println("宝马轮胎充气"); }
}

// 宝马引擎
class BmwEngine implements Engine {
    public void start() { System.out.println("宝马引擎启动"); }
}
\`\`\`





### 状态模式（State Pattern）

例如电梯状态：停止、运行、暂停，每种状态下“按按钮”行为不同。

#### 类结构图（简略）：

\`\`\`
Context（上下文）
└── State（抽象状态类）
    ├── ConcreteStateA
    └── ConcreteStateB
\`\`\`

#### C++ 示例：

\`\`\`cpp
class State {
public:
    virtual void handle() = 0;
};

class ConcreteStateA : public State {
public:
    void handle() override {
        std::cout << "State A: Doing A's logic\\n";
    }
};

class ConcreteStateB : public State {
public:
    void handle() override {
        std::cout << "State B: Doing B's logic\\n";
    }
};

class Context {
    State* state;
public:
    void setState(State* s) { state = s; }
    void request() { state->handle(); }
};
\`\`\`

------

### 命令模式（Command Pattern）


将“命令”封装为对象，支持撤销、重做、队列、日志等操作。


遥控器上的“命令按钮”，每个按钮其实封装了一个命令对象。

#### 类结构：

\`\`\`
Invoker（调用者） --> Command（抽象命令） --> Receiver（实际执行者）
\`\`\`

#### C++ 示例：

\`\`\`cpp
class Command {
public:
    virtual void execute() = 0;
};

class Light {
public:
    void on() { std::cout << "Light is ON\\n"; }
};

class LightOnCommand : public Command {
    Light* light;
public:
    LightOnCommand(Light* l) : light(l) {}
    void execute() override { light->on(); }
};

class Remote {
    Command* command;
public:
    void setCommand(Command* c) { command = c; }
    void pressButton() { command->execute(); }
};
\`\`\`

------

### 适配器模式（Adapter Pattern）


把一个类的接口“适配”成客户端期望的形式，解决接口不兼容问题。


用“三相插头适配器”连接国外电器。

#### 类结构：

\`\`\`
Client --> Target（目标接口）
                   ↑
             Adapter（适配器）-- Adaptee（被适配的类）
\`\`\`

#### C++ 示例：

\`\`\`cpp
class Target {
public:
    virtual void request() = 0;
};

class Adaptee {
public:
    void specificRequest() { std::cout << "SpecificRequest\\n"; }
};

class Adapter : public Target {
    Adaptee* adaptee;
public:
    Adapter(Adaptee* a) : adaptee(a) {}
    void request() override { adaptee->specificRequest(); }
};
\`\`\`

------

### 组合模式（Composite Pattern）


将对象组合成树状结构，让客户对单个对象和组合对象“统一处理”。

文件夹和文件是一样的接口，都可以被“打开”。

####  类结构：

\`\`\`
Component（抽象组件）
├── Leaf（叶子节点）
└── Composite（组合节点） --> 维护 Component 的集合
\`\`\`

####  C++ 示例：

\`\`\`cpp
class Component {
public:
    virtual void operation() = 0;
    virtual void add(Component*) {}
};

class Leaf : public Component {
public:
    void operation() override {
        std::cout << "Leaf\\n";
    }
};

class Composite : public Component {
    std::vector<Component*> children;
public:
    void add(Component* c) override { children.push_back(c); }
    void operation() override {
        std::cout << "Composite:\\n";
        for (auto c : children) c->operation();
    }
};
\`\`\`

------

###  单例模式（Singleton Pattern）


保证一个类只有一个实例，并提供一个访问它的全局入口。

####  类比：

操作系统里的“任务管理器”——系统全局只有一个。

####  C++ 示例：

\`\`\`cpp
class Singleton {
private:
    Singleton() {}
public:
    static Singleton& getInstance() {
        static Singleton instance; // C++11 线程安全
        return instance;
    }

    void say() {
        std::cout << "I'm Singleton!\\n";
    }

    // 禁用拷贝和赋值
    Singleton(const Singleton&) = delete;
    void operator=(const Singleton&) = delete;
};
\`\`\`







## 完整的软件开发流程 

AI生成

### 0. 市场调研 / 立项论证（立项前）

> 目的：验证项目是否有做的价值

- 分析用户需求 / 竞品分析
- 商业可行性评估
- 技术可行性评估
- 成本预算、回报预测
- 形成《立项报告》，给领导决策

🔹产出物：市场分析报告、立项建议书

------


### 1. 需求分析（Requirement Analysis）

> 明确“做什么”，是用户视角

- 和客户反复沟通、头脑风暴
- 写用户故事、用例图
- 确定功能列表、非功能需求（性能、安全）
- 分优先级（Must、Should、Could、Won’t）

🔹产出物：需求规格说明书（SRS）

------

### 2. 设计阶段（Design）

> 计划“怎么做”，是开发视角

#### 高层设计（概要设计）：

- 模块划分（如 MVC）
- 技术选型（前后端语言、数据库）
- 架构图、接口设计、API 约定

#### 详细设计（低层设计）：

- 每个类/模块的职责（类图、顺序图）
- 数据库 ER 图设计
- 出函数签名、参数定义等

🔹产出物：设计文档、UML 图、接口文档

------

### 3. 编码实现（Implementation）

> 正式写代码，通常迭代开发，分为多个 Sprint

- 前后端分工并行开发
- 每天 Standup（Scrum）
- 版本控制（Git），CI/CD 工具
- 遵循编码规范和接口设计文档

🔹产出物：源代码、提交记录、构建脚本

------

### 4. 测试阶段（Testing）

> 保证软件质量，发现 Bug

- 单元测试（开发自己写）
- 集成测试（多个模块联调）
- 系统测试（从用户角度）
- 回归测试、性能测试、安全测试

🔹产出物：测试计划、测试用例、测试报告

------

### 5. 部署上线（Deployment）

> 将测试通过的软件部署到用户环境

- 打包构建（Docker、CI/CD）
- 部署到服务器或云平台（如 AWS、阿里云）
- 数据迁移、备份
- 灰度发布 / 蓝绿发布
- 发布文档、用户手册

🔹产出物：部署文档、上线日志

------

### 6. 运维与维护（Maintenance）

> 上线后继续修复、优化、收集用户反馈

- 监控系统（如 Prometheus、Sentry）
- 日志采集、告警系统
- 用户反馈渠道
- Bug 修复、功能增强
- 安全补丁更新

🔹产出物：运维报告、补丁记录

------

### 7. 结项 & 复盘（可选）

> 总结项目经验，为后续项目提供借鉴

- 成果总结（功能完成情况）
- 成本、进度、质量复盘
- 技术债梳理、团队协作反思

🔹产出物：项目复盘报告、知识沉淀文档

------



### 总结

> 从立项前开始，首先进行市场调研和立项评估，之后进入需求分析阶段，确定用户和系统需求。接下来是设计阶段，做架构设计和详细模块划分，然后进入编码实现。在开发完成后进入测试阶段，包括单元、集成和系统测试。测试通过后部署上线，最后是维护和复盘。整个过程通常是迭代式进行。


\`\`\`
立项论证 —— 能不能做
需求分析 —— 要做什么
系统设计 —— 怎么做
编码实现 —— 开始做
软件测试 —— 测一测
部署上线 —— 给人用
运维维护 —— 修修补补
项目复盘 —— 复盘总结
\`\`\`
`;export{n as default};
