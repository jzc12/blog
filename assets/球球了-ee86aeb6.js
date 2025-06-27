import{o as l,c as e,a as r}from"./index-0551e8d1.js";const i="/blog/assets/tcp-762fc875.png",a="/blog/assets/tree-43e87cd6.png",o={class:"markdown-body"},s="2025-06-01T00:00:00.000Z",u="2025-06-03T00:00:00.000Z",b="基础知识",g="救命，球球了",C={__name:"球球了",setup(n,{expose:d}){return d({frontmatter:{date:"2025-06-01T00:00:00.000Z",updated:"2025-06-03T00:00:00.000Z",category:"基础知识",summary:"救命，球球了"}}),(c,t)=>(l(),e("div",o,t[0]||(t[0]=[r(`<h1>球球了</h1><h2>c++</h2><h3>构造函数和析构函数</h3><ul><li><p>与类同名；没有返回类型（连 void 也没有）；可以有参数，可以重载；如果用户没有定义，编译器会生成一个默认构造函数</p></li><li><p>类名前加 <code>~</code>；没有返回类型；没有参数，不能重载；如果用户没有定义，编译器会生成一个默认析构函数</p></li></ul><h3>malloc 和 构造函数</h3><table><thead><tr><th>特性</th><th>malloc</th><th>构造函数</th></tr></thead><tbody><tr><td>所属语言</td><td>C 语言函数</td><td>C++ 类成员函数</td></tr><tr><td>功能</td><td>仅分配原始内存</td><td>分配内存并初始化对象</td></tr><tr><td>初始化</td><td>不调用构造函数</td><td>自动调用构造函数初始化</td></tr><tr><td>返回类型</td><td><code>void*</code></td><td>无返回类型</td></tr><tr><td>内存来源</td><td>堆内存</td><td>取决于使用方式（堆/栈等）</td></tr><tr><td>关联操作</td><td>需要配合 <code>free</code></td><td>自动关联析构函数</td></tr></tbody></table><p>如果必须使用 <code>malloc</code>，需要手动初始化</p><ol><li>对象状态：构造函数初始化对象内部状态，<code>malloc</code> 创建的对象可能包含垃圾值</li><li>资源管理：构造函数可能申请其他资源（如打开文件），<code>malloc</code> 不会处理这些</li></ol><h3>malloc返回的地址</h3><table><thead><tr><th>关键点</th><th>说明</th></tr></thead><tbody><tr><td>malloc 返回虚拟地址</td><td>程序看到的是进程虚拟地址空间中的地址</td></tr><tr><td>物理地址由OS和MMU管理</td><td>应用程序无法直接访问物理地址</td></tr><tr><td>物理内存分配发生在首次访问时</td><td>通过缺页中断（Page Fault）由OS分配物理页框</td></tr><tr><td>虚拟内存机制提供安全和灵活性</td><td>隔离进程、支持内存超额分配（Overcommit）、换页（Swap）等</td></tr></tbody></table><h3>关键字 volatile</h3><p>告诉编译器不要优化某一个变量，防止编译器错误优化，确保每次访问变量时都从内存读取，而不是使用寄存器中的缓存值。</p><ul><li><code>const</code>：变量不可被程序修改（但可能被硬件/外部修改）。</li><li><code>volatile</code>：变量可能被外部修改，编译器不要优化。</li></ul><h3>关键字 static 和extern</h3><pre><code class="language-c">// file1.c
int global_var = 10; // 全局变量，可以被其他文件访问

// file2.c
extern int global_var; // 声明，告诉编译器变量在别处定义

void func() {
    printf(&quot;%d\\n&quot;, global_var); // 可以访问
}
</code></pre><table><thead><tr><th>特性</th><th>全局变量</th><th>static 全局变量</th></tr></thead><tbody><tr><td>作用域</td><td>整个程序（多文件可见）</td><td>仅当前文件</td></tr><tr><td>链接性</td><td>外部链接（external）</td><td>内部链接（internal）</td></tr><tr><td>能否被 <code>extern</code> 引用</td><td>✅ 可以</td><td>❌ 不可以</td></tr><tr><td>存储位置</td><td>全局/静态存储区</td><td>全局/静态存储区</td></tr><tr><td>默认初始值</td><td>0 / NULL</td><td>0 / NULL</td></tr><tr><td>用途</td><td>跨文件共享数据</td><td>限制变量仅当前文件使用</td></tr></tbody></table><hr><p>为什么用 <code>static</code> 全局变量？</p><ol><li><p>避免命名冲突：</p><ul><li>如果多个文件定义了同名全局变量，会导致链接错误。</li><li>使用 <code>static</code> 可以确保变量只在当前文件有效。</li></ul></li><li><p>隐藏实现细节：</p></li><li><p>替代全局变量：</p><ul><li>如果变量只需要在当前文件使用，优先用 <code>static</code> 全局变量，而不是普通全局变量。</li></ul></li></ol><p><code>static</code> 的其他用法 <code>static</code> 关键字在 C/C++ 中还有另外两种用法：</p><ol><li><p><code>static</code> 局部变量：</p><ul><li>在函数内部定义，生命周期延长到整个程序运行期间。</li><li>但作用域仍然仅限于函数内部。</li></ul><pre><code class="language-c">void func() {
    static int count = 0; // 只初始化一次
    count++;
}
</code></pre></li><li><p><code>static</code> 成员变量（C++ 类）：</p><ul><li>属于类本身，而不是类的实例。</li><li>所有对象共享同一个 <code>static</code> 成员变量。</li></ul><pre><code class="language-cpp">class MyClass {
public:
    static int shared_var; // 类变量
};
</code></pre></li></ol><h3>define 宏定义和 typedef</h3><table><thead><tr><th>特性</th><th><code>#define</code>（宏）</th><th><code>typedef</code>（类型别名）</th></tr></thead><tbody><tr><td>处理阶段</td><td>预处理阶段（文本替换）</td><td>编译阶段（类型检查）</td></tr><tr><td>用途</td><td>常量、宏、代码片段</td><td>仅用于类型别名</td></tr><tr><td>类型安全</td><td>❌ 无类型检查</td><td>✅ 有类型检查</td></tr><tr><td>作用域</td><td>文件作用域（全局）</td><td>遵循变量作用域规则</td></tr><tr><td>是否需要分号</td><td>❌ 不需要</td><td>✅ 需要</td></tr><tr><td>调试友好性</td><td>❌ 错误信息可能不直观</td><td>✅ 错误信息更清晰</td></tr><tr><td>适用场景</td><td>常量、条件编译、宏函数</td><td>简化复杂类型声明</td></tr></tbody></table><h3>什么是虚函数表？</h3><ul><li>虚函数表是一个存储类虚函数指针的数组</li><li>每个包含虚函数的类（或从包含虚函数的类继承的类）都有自己的虚函数表</li><li>虚函数表在编译时创建，存储在程序的只读数据段</li></ul><p>以下是关于C++虚函数表(vtable)、虚继承(virtual inheritance)及相关知识的综合总结，结合文字说明和图表展示：</p><hr><h3>1. 虚函数表（vtable）机制</h3><h4>核心概念</h4><ul><li>作用：实现运行时多态（动态绑定）</li><li>存储位置：只读数据段（编译期生成）</li><li>组成元素：<pre><code class="language-plaintext">vtable = [虚函数1指针, 虚函数2指针, ..., 虚析构函数指针]
</code></pre></li></ul><h4>内存结构示例</h4><pre><code class="language-cpp">class Base {
public:
    virtual void f1() {}
    virtual void f2() {}
};
class Derived : public Base {
public:
    void f1() override {}
    virtual void f3() {}
};
</code></pre><p>内存布局：</p><pre><code class="language-mermaid">classDiagram
    class Base_vtable {
        +Base::f1()
        +Base::f2()
    }
    class Derived_vtable {
        +Derived::f1()  // 覆盖
        +Base::f2()     // 继承
        +Derived::f3()  // 新增
    }
    Base --&gt; Base_vtable
    Derived --&gt; Derived_vtable
</code></pre><h4>关键特性</h4><table><thead><tr><th>特性</th><th>说明</th></tr></thead><tbody><tr><td>vptr位置</td><td>对象首部（通常4/8字节）</td></tr><tr><td>构造顺序</td><td>基类→派生类（初始化vptr）</td></tr><tr><td>调用成本</td><td>多一次指针解引用</td></tr></tbody></table><hr><h3>2. 虚继承（Virtual Inheritance）</h3><h4>菱形继承问题</h4><pre><code class="language-mermaid">graph TD
    A[Base] --&gt; B[Derived1]
    A --&gt; C[Derived2]
    B --&gt; D[FinalDerived]
    C --&gt; D
</code></pre><p>问题表现：</p><ul><li>数据冗余：FinalDerived包含两份Base成员</li><li>二义性：<code>finalObj.Base::data</code> 访问不明确</li></ul><h4>虚继承解决方案</h4><pre><code class="language-cpp">class Derived1 : virtual public Base {};
class Derived2 : virtual public Base {};
</code></pre><p>内存布局：</p><pre><code class="language-plaintext">FinalDerived对象:
+----------------+
| Derived1部分    |
| Derived2部分    |
| vbase_ptr1     |--&gt; 共享的Base子对象
| vbase_ptr2     |
| FinalDerived数据|
+----------------+
</code></pre><h4>构造函数调用顺序</h4><ol><li>虚基类（Base）</li><li>非虚基类（Derived1/Derived2）</li><li>成员对象</li><li>自身构造函数</li></ol><h4>5. 重要规则总结</h4><ol><li><p>虚函数表规则：</p><ul><li>每个多态类一个vtable</li><li>子类重写会覆盖父类函数指针</li><li>新增虚函数追加到vtable末尾</li></ul></li><li><p>虚继承规则：</p><ul><li>虚基类由最派生类直接初始化</li><li>共享基类子对象位于派生类尾部</li><li>通过虚基类指针间接访问</li></ul></li><li><p>设计建议：</p><ul><li>优先用组合替代多重继承</li><li>基类析构函数必须为虚函数</li><li>避免深层次的虚继承层次</li></ul></li></ol><h3>协程(Coroutine)详解</h3><p>协程是一种比线程更加轻量级的并发编程模型，它通过协作式多任务而非抢占式多任务来实现并发执行。</p><h4>1. 定义</h4><p>协程是可以暂停执行和恢复执行的函数，它能在任意位置挂起(yield)，并在之后从挂起处恢复(resume)。</p><h4>2. 核心特点</h4><ul><li>用户态调度：由程序员控制切换，不需要内核介入</li><li>极低开销：上下文切换只需保存少量寄存器(约100字节)</li><li>同步编码风格：用看似同步的代码实现异步逻辑</li><li>无锁编程：天然避免多线程的竞态条件</li></ul><h4>3. 与线程对比</h4><table><thead><tr><th>特性</th><th>线程</th><th>协程</th></tr></thead><tbody><tr><td>调度方式</td><td>抢占式(操作系统控制)</td><td>协作式(程序员控制)</td></tr><tr><td>切换开销</td><td>高(需内核介入)</td><td>极低(纯用户态操作)</td></tr><tr><td>并发规模</td><td>通常数百到数千</td><td>轻松支持数十万并发</td></tr><tr><td>内存占用</td><td>MB级(默认栈大小)</td><td>KB级(可自定义栈大小)</td></tr><tr><td>数据共享</td><td>需要同步机制</td><td>天然单线程无竞争</td></tr></tbody></table><p>存储协程运行状态的数据结构：</p><pre><code class="language-c">struct coroutine {
    void* stack_ptr;    // 栈指针
    void* stack_base;   // 栈基址
    void* resume_point; // 恢复点(IP)
    int status;         // 状态(运行/挂起/结束)
};
</code></pre><h4>优点</h4><ol><li>超高并发：单机支持数十万协程</li><li>低资源消耗：每个协程只需KB级内存</li><li>简化异步代码：用同步方式写异步逻辑</li><li>无锁编程：避免多线程竞争问题</li></ol><h4>缺点</h4><ol><li>不能利用多核：本质仍是单线程(可通过多线程+协程池解决)</li><li>阻塞操作危险：一个协程阻塞会导致整个线程阻塞</li><li>调试困难：调用栈可能不连续</li><li>生态系统支持：部分语言/库支持不完善</li></ol><h3>sizeof &amp; strlen</h3><table><thead><tr><th>特性</th><th>sizeof</th><th>strlen</th></tr></thead><tbody><tr><td>类型</td><td>运算符（编译时确定）</td><td>函数（运行时计算）</td></tr><tr><td>作用对象</td><td>任何数据类型或变量</td><td>仅适用于字符串（以’\\0’结尾）</td></tr><tr><td>计算内容</td><td>对象/类型占用的内存字节数</td><td>字符串的实际长度（不含’\\0’）</td></tr><tr><td>计算时机</td><td>编译时</td><td>运行时</td></tr><tr><td>参数</td><td>类型名或表达式</td><td>字符指针（char*）</td></tr><tr><td>头文件</td><td>不需要（语言内置）</td><td>需要#include &lt;string.h&gt;</td></tr><tr><td>效率</td><td>无运行时开销</td><td>需要遍历字符串直到’\\0’</td></tr></tbody></table><h3>重载和重写</h3><h4>1. 基本</h4><table><thead><tr><th>特性</th><th>重载(Overload)</th><th>重写(Override)</th></tr></thead><tbody><tr><td>定义</td><td>同一作用域内同名函数的不同实现</td><td>派生类重新定义基类的虚函数</td></tr><tr><td>目的</td><td>提供处理不同参数类型的同名函数</td><td>实现运行时多态</td></tr></tbody></table><pre><code class="language-cpp">class Calculator {
public:
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }  // 重载add函数
    int add(int a, int b, int c) { return a + b + c; } // 参数数量不同
};
</code></pre><pre><code class="language-cpp">class Base {
public:
    virtual void show() { cout &lt;&lt; &quot;Base show&quot; &lt;&lt; endl; }
};

class Derived : public Base {
public:
    void show() override { cout &lt;&lt; &quot;Derived show&quot; &lt;&lt; endl; }  // 重写show函数
};
</code></pre><h4>2.override关键字：</h4><ul><li>显式声明重写，编译器会检查是否正确重写</li></ul><pre><code class="language-cpp">class Derived : public Base {
public:
    void show() override;  // 如果Base没有virtual show()，会编译错误
};
</code></pre><h4>3.final关键字：</h4><ul><li>禁止派生类重写该函数</li></ul><pre><code class="language-cpp">class Base {
public:
    virtual void foo() final;  // 派生类不能重写foo()
};
</code></pre><h3>虚函数和纯虚函数</h3><h4>虚函数示例</h4><pre><code class="language-cpp">class Animal {
public:
    virtual void makeSound() {  // 虚函数有默认实现
        cout &lt;&lt; &quot;Some animal sound&quot; &lt;&lt; endl;
    }
};

class Cat : public Animal {
public:
    void makeSound() override {  // 可选择重写
        cout &lt;&lt; &quot;Meow&quot; &lt;&lt; endl;
    }
};
</code></pre><h4>纯虚函数示例</h4><pre><code class="language-cpp">class Shape {  // 抽象类
public:
    virtual double area() const = 0;  // 纯虚函数
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override {  // 必须实现
        return 3.14159 * radius * radius;
    }
};
</code></pre><h4>使用虚函数的情况</h4><ul><li>当基类可以提供有意义的默认实现时</li><li>当派生类可能需要也可能不需要特殊行为时</li><li>实现模板方法设计模式</li></ul><h4>使用纯虚函数的情况</h4><ul><li>定义接口规范（类似Java接口）</li><li>强制派生类实现特定功能</li><li>当基类无法提供有意义的默认实现时</li><li>实现策略模式或抽象工厂模式</li></ul><h4>attention</h4><ol><li>构造函数不能是虚函数或纯虚函数</li><li>析构函数应该是虚函数（特别是基类有虚函数时）</li></ol><h3>智能指针</h3><p>C++11 引入了三种主要的智能指针，定义在 <code>&lt;memory&gt;</code> 头文件中：</p><ol><li><code>std::unique_ptr</code> - 独占所有权指针</li><li><code>std::shared_ptr</code> - 共享所有权指针</li><li><code>std::weak_ptr</code> - 弱引用指针（配合 shared_ptr 使用）</li></ol><table><thead><tr><th>特性</th><th>unique_ptr</th><th>shared_ptr</th><th>weak_ptr</th></tr></thead><tbody><tr><td>所有权</td><td>独占</td><td>共享</td><td>无所有权</td></tr><tr><td>引用计数</td><td>无</td><td>有</td><td>不增加引用计数</td></tr><tr><td>性能开销</td><td>最小（几乎等同裸指针）</td><td>中等（维护引用计数）</td><td>中等</td></tr><tr><td>线程安全</td><td>非线程安全</td><td>引用计数原子操作安全</td><td>同 shared_ptr</td></tr><tr><td>循环引用</td><td>无此问题</td><td>可能导致循环引用</td><td>解决循环引用问题</td></tr><tr><td>是否可复制</td><td>不可复制（可移动）</td><td>可复制</td><td>可复制</td></tr><tr><td>是否可空</td><td>可置空</td><td>可置空</td><td>必须从 shared_ptr 创建</td></tr><tr><td>释放时机</td><td>离开作用域或显式释放</td><td>引用计数为0时</td><td>不影响对象生命周期</td></tr></tbody></table><h4>3.1 std::unique_ptr</h4><p>适用场景：</p><ul><li>替代原始指针管理独占资源</li><li>工厂函数返回资源</li><li>作为类的成员变量，表示独占资源</li><li>需要明确资源所有权转移的情况</li></ul><p>示例：</p><pre><code class="language-cpp">// 创建 unique_ptr
std::unique_ptr&lt;MyClass&gt; ptr(new MyClass());
// 或者使用 make_unique (C++14)
auto ptr = std::make_unique&lt;MyClass&gt;();

// 转移所有权
std::unique_ptr&lt;MyClass&gt; ptr2 = std::move(ptr);
</code></pre><h4>3.2 std::shared_ptr</h4><p>适用场景：</p><ul><li>多个对象需要共享同一资源</li><li>需要共享所有权的复杂数据结构</li><li>需要将指针存入标准容器</li><li>需要共享访问但不明确资源生命周期的情况</li></ul><p>示例：</p><pre><code class="language-cpp">// 创建 shared_ptr
std::shared_ptr&lt;MyClass&gt; ptr1(new MyClass());
// 推荐使用 make_shared
auto ptr2 = std::make_shared&lt;MyClass&gt;();

// 复制共享
auto ptr3 = ptr2;  // 引用计数+1
</code></pre><h4>3.3 std::weak_ptr</h4><p>适用场景：</p><ul><li>打破 shared_ptr 的循环引用</li><li>观察 shared_ptr 管理的对象而不影响其生命周期</li><li>缓存系统中需要知道对象是否还存在</li></ul><p>示例：</p><pre><code class="language-cpp">auto shared = std::make_shared&lt;MyClass&gt;();
std::weak_ptr&lt;MyClass&gt; weak = shared;

// 使用时检查并转换为 shared_ptr
if (auto temp = weak.lock()) {
    temp-&gt;doSomething();  // 安全使用
}
</code></pre><pre><code class="language-cpp">class B;

class A {
public:
    std::shared_ptr&lt;B&gt; b_ptr;
    ~A() { std::cout &lt;&lt; &quot;A destroyed\\n&quot;; }
};

class B {
public:
    std::shared_ptr&lt;A&gt; a_ptr;  // 改为 weak_ptr 可解决问题
    ~B() { std::cout &lt;&lt; &quot;B destroyed\\n&quot;; }
};

void circularReference() {
    auto a = std::make_shared&lt;A&gt;();
    auto b = std::make_shared&lt;B&gt;();
    a-&gt;b_ptr = b;
    b-&gt;a_ptr = a;  // 循环引用，对象不会被销毁
}
</code></pre><ol><li><code>unique_ptr</code>：几乎无额外开销</li><li><code>shared_ptr</code>： <ul><li>引用计数操作有少量开销</li><li><code>make_shared</code> 可合并内存分配（对象和控制块）</li></ul></li><li><code>weak_ptr</code>：与 <code>shared_ptr</code> 类似，但访问需要临时转换</li></ol><hr><h3>new</h3><p>在 C++ 中，使用 <code>new</code> 关键字分配出来的对象，会被存放在 堆（Heap） 上.</p><table><thead><tr><th>内存区域</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td>栈（Stack）</td><td>函数调用时的局部变量，自动分配，生命周期随作用域</td><td><code>int a = 10;</code></td></tr><tr><td>堆（Heap）</td><td>手动分配，生命周期由程序员控制</td><td><code>int* p = new int(10);</code></td></tr><tr><td>全局/静态区</td><td>全局变量、静态变量存放区</td><td><code>static int x = 1;</code></td></tr><tr><td>常量区</td><td>字符串常量和 const 修饰的全局常量等</td><td><code>const char* str = &quot;hello&quot;;</code></td></tr><tr><td>代码区</td><td>存放程序的机器指令（函数体）</td><td><code>void func() {}</code></td></tr></tbody></table><hr><h3>map 和 unordered_map</h3><ul><li><code>map</code> 是红黑树实现（有序），操作复杂度 O(log n)</li><li><code>unordered_map</code> 是哈希表实现（无序），操作复杂度平均 O(1)，最坏 O(n)</li></ul><h3>内存泄漏和内存溢出的概率</h3><ul><li><p>内存泄漏是指程序在运行过程中，由于某些原因未能释放不再使用的内存，导致这部分内存无法被重新利用的现象。</p><ul><li><blockquote><p>可以使用 Valgrind 或 AddressSanitizer 等工具定位泄漏，也可以重载 new/delete 做日志追踪。实际开发中推荐使用智能指针（如 <code>std::unique_ptr</code>）从源头预防泄漏。</p></blockquote></li></ul></li><li><p>内存溢出是指程序在申请内存时，没有足够的内存空间供其使用，导致程序无法正常执行的现象。</p></li></ul><h3>四种类型转换</h3><table><thead><tr><th>类型</th><th>安全性</th><th>用途</th><th>检查机制</th></tr></thead><tbody><tr><td><code>static_cast</code></td><td>较安全</td><td>普通类型、安全类转换</td><td>编译期检查</td></tr><tr><td><code>dynamic_cast</code></td><td>安全</td><td>多态类间安全转换</td><td>运行时检查</td></tr><tr><td><code>const_cast</code></td><td>中等</td><td>添加/去除 const、volatile</td><td>编译期检查</td></tr><tr><td><code>reinterpret_cast</code></td><td>危险</td><td>指针、整型等底层转换</td><td>无检查</td></tr></tbody></table><h3>右值引用和完美转发</h3><h3>宏和模板</h3><pre><code class="language-cpp">#include &lt;iostream&gt;

// 宏定义：简单文本替换
#define SQUARE_MACRO(x) ((x) * (x))

// 模板函数：类型安全，编译期检查
template&lt;typename T&gt;
T square_template(T x) {
    return x * x;
}

int main() {
    int a = 5;
    double b = 3.14;

    // 使用宏
    std::cout &lt;&lt; &quot;宏 SQUARE_MACRO(a): &quot; &lt;&lt; SQUARE_MACRO(a) &lt;&lt; std::endl;
    std::cout &lt;&lt; &quot;宏 SQUARE_MACRO(b): &quot; &lt;&lt; SQUARE_MACRO(b) &lt;&lt; std::endl;

    // 使用模板
    std::cout &lt;&lt; &quot;模板 square_template(a): &quot; &lt;&lt; square_template(a) &lt;&lt; std::endl;
    std::cout &lt;&lt; &quot;模板 square_template(b): &quot; &lt;&lt; square_template(b) &lt;&lt; std::endl;

    // 宏副作用示例
    int c = 4;
    std::cout &lt;&lt; &quot;宏副作用 SQUARE_MACRO(c++): &quot; &lt;&lt; SQUARE_MACRO(c++) &lt;&lt; std::endl; 
    std::cout &lt;&lt; &quot;c 的值: &quot; &lt;&lt; c &lt;&lt; std::endl;

    // 模板不会有这种问题
    int d = 4;
    std::cout &lt;&lt; &quot;模板 square_template(d++): &quot; &lt;&lt; square_template(d++) &lt;&lt; std::endl;
    std::cout &lt;&lt; &quot;d 的值: &quot; &lt;&lt; d &lt;&lt; std::endl;

    return 0;
}

</code></pre><h3>内存对齐</h3><h4>1. <code>#pragma pack</code></h4><pre><code>cpp复制编辑#pragma pack(1)
struct B {
    char a;
    int b;
};
#pragma pack()
</code></pre><p>这个结构体将没有填充字节，总大小为 5 字节（但会影响性能甚至兼容性）。</p><h4>2. alignas（C++11）</h4><pre><code>cpp复制编辑struct alignas(16) MyStruct {
    int a;
    double b;
};
</code></pre><p>强制将 <code>MyStruct</code> 对齐到 16 字节边界。</p><blockquote><p>内存对齐是为了让数据在内存中按一定边界排列，提高 CPU 访问效率，某些平台甚至要求必须对齐。C++ 中结构体会自动按成员最大对齐方式补充填充字节，我们可以使用 <code>#pragma pack</code> 或 <code>alignas</code> 显式控制对齐方式。合理对齐既能优化性能，也可避免跨平台问题。</p></blockquote><h2>python</h2><h3>Global Interpreter Lock</h3><p>GIL 保证任意时刻只有一个线程在执行 Python 字节码。</p><p>解决 GIL 限制的方法</p><ol><li>多进程（multiprocessing）： <ul><li>每个进程都有自己的 Python 解释器和 GIL，可以真正并行运行。</li><li>适合 CPU 密集型任务。</li></ul></li><li>使用 C 扩展释放 GIL： <ul><li>第三方库（如 NumPy、TensorFlow）在内部用 C 写的部分会主动释放 GIL，从而实现并行。</li></ul></li></ol><h2>MySQL</h2><pre><code>表A           表B
+----+-----+   +----+------+
| id | 名字 |   | id | 年龄 |
+----+-----+   +----+------+
| 1  | 张三 |   | 1  | 20   |
| 2  | 李四 |   | 4  | 22   |
| 3  | 王五 |   | 2  | 21   |
+----+-----+   +----+------+
</code></pre><p>🎯 内连接：</p><pre><code class="language-sql">SELECT * FROM A INNER JOIN B ON A.id = B.id;
</code></pre><pre><code>+----+-----+------+ 
| id | 名字 | 年龄 | 
+----+-----+------+
| 1  | 张三 | 20   |
| 2  | 李四 | 21   |
+----+-----+------+
</code></pre><p>🎯左连接 ：返回左表所有数据，即使右表无匹配数据也返回 NULL。</p><pre><code class="language-sql">SELECT * FROM A LEFT JOIN B ON A.id = B.id;
</code></pre><pre><code>+----+-----+------+
| id | 名字 | 年龄 |
+----+-----+------+
| 1  | 张三 | 20   |
| 2  | 李四 | 21   |
| 3  | 王五 | NULL |
+----+-----+------+
</code></pre><hr><p>🎯右连接： 返回右表所有数据，即使左表无匹配也返回 NULL。</p><pre><code class="language-sql">SELECT * FROM A RIGHT JOIN B ON A.id = B.id;
</code></pre><pre><code>+----+-----+------+
| id | 名字 | 年龄 |
+----+-----+------+
| 1  | 张三 | 20   |
| 2  | 李四 | 21   |
| 3  | NULL | 22   |
+----+-----+------+
</code></pre><hr><p>🎯全连接:不原生支持 FULL OUTER JOIN，但可通过 <code>UNION</code> 模拟实现：</p><pre><code class="language-sql">SELECT * FROM A LEFT JOIN B ON A.id = B.id
UNION
SELECT * FROM A RIGHT JOIN B ON A.id = B.id;
</code></pre><pre><code>+----+-----+------+
| id | 名字 | 年龄 |
+----+-----+------+
| 1  | 张三 | 20   |
| 2  | 李四 | 21   |
| 3  | 王五 | NULL |
| 4  | NULL | 22   |
+----+-----+------+
</code></pre><h3>事务的特性</h3><ul><li>原子性、隔离性、一致性、持久性</li></ul><h3>索引</h3><h4>主键索引</h4><h4>辅助索引（非聚簇索引）</h4><h4>B+树</h4><h4>哈希映射</h4><h3>日志</h3><table><thead><tr><th>日志类型</th><th>对应事务特性</th><th>说明</th></tr></thead><tbody><tr><td>Redo Log（重做日志）</td><td>🧱 持久性（Durability）</td><td>保证事务提交后数据不会丢失，崩溃恢复时可重做已提交事务</td></tr><tr><td>Undo Log（回滚日志）</td><td>💥 原子性（Atomicity）</td><td>支持事务失败时回滚；也参与一致性与多版本隔离（MVCC）</td></tr><tr><td>Binlog（二进制日志）</td><td>🧱 持久性 + 一致性</td><td>提供完整的逻辑操作记录，支持主从复制与数据恢复</td></tr><tr><td>Relay Log（中继日志）</td><td>🚀 一致性</td><td>从库基于 relay log 重放主库操作，确保主从数据一致</td></tr><tr><td>错误日志（Error Log）</td><td>⚠️ 无直接对应（辅助）</td><td>辅助诊断异常，保证系统可靠运行</td></tr><tr><td>慢查询日志（Slow Log）</td><td>📊 无直接对应（优化）</td><td>用于性能分析与调优，间接帮助提高一致性与响应能力</td></tr><tr><td>通用查询日志（General Log）</td><td>🕵️ 无直接对应（审计）</td><td>全部 SQL 活动记录，可用于调试和审计，不影响事务特性</td></tr></tbody></table><h2>Redis</h2><h2>操作系统</h2><h3>用户态和内核态</h3><table><thead><tr><th>特性</th><th>用户态 (User Mode)</th><th>内核态 (Kernel Mode)</th></tr></thead><tbody><tr><td>权限</td><td>低权限，不能直接访问硬件</td><td>高权限，可执行所有CPU指令，直接操作硬件</td></tr><tr><td>执行代码</td><td>普通应用程序（如浏览器、文本编辑器）</td><td>操作系统内核（如进程调度、内存管理、设备驱动）</td></tr><tr><td>系统调用</td><td>必须通过 系统调用（syscall） 进入内核态</td><td>可直接执行特权指令</td></tr><tr><td>例子</td><td><code>malloc()</code>、<code>printf()</code></td><td><code>fork()</code>、<code>read()</code>、<code>write()</code></td></tr></tbody></table><p>为什么需要区分？</p><ul><li>安全性：防止用户程序直接操作硬件导致系统崩溃。</li><li>稳定性：内核管理关键资源（CPU、内存、设备），用户程序不能随意修改。</li></ul><p>如何切换？</p><ul><li>用户态 → 内核态：通过 系统调用 或 中断。</li><li>内核态 → 用户态：执行 <code>iret</code>（中断返回）或 <code>sysret</code>（系统调用返回）。</li></ul><hr><h3>进程 vs. 线程</h3><table><thead><tr><th>特性</th><th>进程（Process）</th><th>线程（Thread）</th></tr></thead><tbody><tr><td>定义</td><td>程序的 执行实例，拥有独立地址空间</td><td>轻量级进程，共享同一进程的地址空间</td></tr><tr><td>资源占用</td><td>高（独立内存、文件句柄、CPU时间片）</td><td>低（共享进程资源，仅私有栈和寄存器）</td></tr><tr><td>创建/销毁开销</td><td>高（需分配独立资源）</td><td>低（共享进程资源）</td></tr><tr><td>通信方式</td><td>进程间通信（IPC）：管道、消息队列、共享内存</td><td>直接读写共享变量、互斥锁、条件变量</td></tr><tr><td>崩溃影响</td><td>仅影响自身</td><td>可能影响同进程的其他线程</td></tr><tr><td>例子</td><td>浏览器、Word、游戏客户端</td><td>浏览器标签页、Web服务器并发请求处理</td></tr></tbody></table><p>为什么需要线程？</p><ul><li>更轻量：创建/切换比进程快。</li><li>共享数据方便：无需IPC，可直接访问进程内存。</li><li>适合并发任务：如Web服务器同时处理多个请求。</li></ul><hr><h3>进程间通信（IPC - Inter-Process Communication）</h3><p>由于进程间 内存隔离，必须通过 IPC机制 通信：</p><table><thead><tr><th>方式</th><th>描述</th><th>适用场景</th></tr></thead><tbody><tr><td>管道（Pipe）</td><td>单向数据流，<code>fd[0]</code>读，<code>fd[1]</code>写（仅父子进程可用）</td><td>Shell命令（如 <code>ls | grep &quot;txt&quot;</code>）</td></tr><tr><td>命名管道（FIFO）</td><td>有名字的管道，允许无亲缘关系进程通信</td><td>持久化进程通信</td></tr><tr><td>消息队列</td><td>内核维护的链表，进程可发送/接收结构化消息</td><td>异步通信（如日志系统）</td></tr><tr><td>共享内存</td><td>多个进程映射同一块物理内存，最快的IPC方式（无需内核介入）</td><td>高性能数据交换（如数据库）</td></tr><tr><td>信号（Signal）</td><td>内核通知进程某事件发生（如 <code>SIGKILL</code>、<code>SIGTERM</code>）</td><td>进程控制（如 <code>kill -9 PID</code>）</td></tr><tr><td>Socket</td><td>跨网络通信，也可用于本机进程（Unix Domain Socket更高效）</td><td>分布式系统（如Redis、Nginx）</td></tr><tr><td>信号量（Semaphore）</td><td>同步机制，控制多个进程对共享资源的访问</td><td>避免竞争条件（如多进程写文件）</td></tr></tbody></table><h3>线程间通信</h3><table><thead><tr><th>方式</th><th>描述</th><th>适用场景</th></tr></thead><tbody><tr><td>全局变量</td><td>最简单，但需加锁</td><td>少量数据共享</td></tr><tr><td>互斥锁（Mutex）</td><td>保证同一时间只有一个线程访问临界区</td><td>保护共享资源（如计数器）</td></tr><tr><td>条件变量（Cond Var）</td><td>让线程等待某个条件成立（常配合Mutex使用）</td><td>生产者-消费者模型</td></tr><tr><td>信号量（Semaphore）</td><td>控制多个线程对资源的访问（比Mutex更灵活，可设置多个许可）</td><td>限流（如数据库连接池）</td></tr><tr><td>读写锁（RW Lock）</td><td>读操作可并发，写操作独占</td><td>读多写少场景（如缓存）</td></tr><tr><td>原子操作（Atomic）</td><td>CPU保证的不可中断操作（如 <code>CAS</code>）</td><td>无锁编程（如高性能计数器）</td></tr></tbody></table><ul><li>多进程：Chrome（每个标签页独立进程，崩溃不影响其他页面）。</li><li>多线程：Web服务器（Nginx、Redis 使用多线程处理并发请求）。</li></ul><h3>互斥锁、读写锁、自旋锁</h3><table><thead><tr><th>特性</th><th>互斥锁 (Mutex)</th><th>自旋锁 (Spinlock)</th></tr></thead><tbody><tr><td>阻塞机制</td><td>获取不到锁时线程休眠</td><td>获取不到锁时循环忙等待</td></tr><tr><td>实现方式</td><td>依赖操作系统调度</td><td>纯用户态原子操作实现</td></tr><tr><td>上下文切换</td><td>有（线程状态切换）</td><td>无</td></tr><tr><td>CPU占用</td><td>等待时不占用CPU</td><td>等待时持续占用CPU</td></tr><tr><td>适用场景</td><td>临界区较长或可能阻塞的操作</td><td>临界区极短（通常&lt;CPU时间片）的操作</td></tr><tr><td>公平性</td><td>通常有等待队列保证公平</td><td>无公平性保证</td></tr><tr><td>内存开销</td><td>较大（需维护线程状态）</td><td>极小（仅需一个原子变量）</td></tr></tbody></table><h4>1. 获取锁的开销</h4><ul><li><p>互斥锁：</p><ul><li>系统调用开销（约100-200ns）</li><li>线程状态切换（用户态→内核态→用户态）</li><li>上下文保存与恢复</li></ul></li><li><p>自旋锁：</p><ul><li>仅原子操作（约10-30ns）</li><li>无模式切换</li><li>无上下文保存</li></ul></li></ul><h4>2. 等待锁的开销</h4><ul><li><p>互斥锁：</p><ul><li>线程进入休眠状态（不占用CPU）</li><li>唤醒时产生调度开销</li><li>适合长时间等待（&gt;线程切换时间）</li></ul></li><li><p>自旋锁：</p><ul><li>持续占用CPU轮询</li><li>无调度开销</li><li>适合极短等待（&lt;2次线程切换时间）</li></ul></li></ul><h3>虚拟内存</h3><h4>🧩 1. 虚拟内存的核心目标</h4><ul><li>让每个进程拥有独立完整的地址空间（看起来像有无限内存）</li><li>隔离性、安全性、跨平台一致性</li><li>支持进程间并发运行和懒加载机制</li></ul><hr><h4>🛠 2. 实现方式：页式虚拟内存 + 硬件支持</h4><p>虚拟内存的实现依赖以下核心技术：</p><table><thead><tr><th>组件/机制</th><th>功能说明</th></tr></thead><tbody><tr><td>页式管理（Paging）</td><td>把虚拟内存划分为固定大小的“页（Page）”，物理内存也划分为“页框（Frame）”</td></tr><tr><td>页表（Page Table）</td><td>记录虚拟页 → 物理页框 的映射关系</td></tr><tr><td>MMU（内存管理单元）</td><td>硬件级地址翻译器，把虚拟地址翻译为物理地址</td></tr><tr><td>TLB（快表）</td><td>页表的缓存，加速地址转换</td></tr><tr><td>缺页中断（Page Fault）</td><td>访问缺页时操作系统触发中断，决定是否从磁盘调入/创建新页等</td></tr><tr><td>交换空间（Swap）</td><td>暂存不常用内存页（换出页）到磁盘，节省物理内存</td></tr></tbody></table><p>📦 进程访问虚拟地址 → MMU 查页表 → 找不到页 → 触发 Page Fault → OS 处理 → 加载页</p><table><thead><tr><th>管理方式</th><th>地址结构</th><th>分配方式</th><th>优势</th><th>劣势</th><th>应用系统</th></tr></thead><tbody><tr><td>分页</td><td>单层页表</td><td>固定页大小</td><td>简洁高效，无外部碎片</td><td>页表可能大，缺页中断频繁</td><td>Linux / Windows 主流方式</td></tr><tr><td>分段</td><td>段号+偏移</td><td>段独立分配</td><td>模块清晰、访问安全</td><td>外部碎片，管理复杂</td><td>老系统，教育用途</td></tr><tr><td>段页式</td><td>段+页</td><td>先段后页</td><td>结构清晰、空间高效</td><td>实现复杂</td><td>x86早期架构</td></tr></tbody></table><hr><h3>线程池</h3><ul><li>构造函数：启动若干工作线程，每个线程循环等待任务。</li><li>submit() 方法：外部调用，用于提交一个任务，放入队列，唤醒一个等待线程。</li><li>任务执行线程：每个线程从队列中拿任务并执行，队列为空则阻塞等待。</li><li>析构函数：设置停止标志，通知所有线程退出，然后逐个 join。</li></ul><h2>计网</h2><h3>TCP的拥塞控制</h3><table><thead><tr><th>名称</th><th>作用</th></tr></thead><tbody><tr><td><code>cwnd</code></td><td>拥塞窗口（控制发送速率）</td></tr><tr><td><code>ssthresh</code></td><td>慢启动阈值（决定从指数增长转为线性增长的分界线）</td></tr><tr><td><code>rwnd</code></td><td>接收方通告的接收窗口</td></tr><tr><td><code>RTT</code></td><td>往返时间，常用于判断网络延迟与是否丢包</td></tr></tbody></table><h3>TCP 和UDP</h3><p>UDP</p><p>适合实时性强、可容忍少量丢包的场景。</p><ul><li>视频直播、语音通话（如VoIP）</li><li>在线游戏</li><li>DNS 查询</li></ul><table><thead><tr><th>特性</th><th>TCP</th><th>UDP</th></tr></thead><tbody><tr><td>是否连接</td><td>面向连接（三次握手）</td><td>无连接</td></tr><tr><td>可靠性</td><td>高（确认、重传、顺序控制）</td><td>低（不保证）</td></tr><tr><td>速度</td><td>较慢（有额外控制）</td><td>较快（无连接和确认）</td></tr><tr><td>资源消耗</td><td>高（需要维护连接状态）</td><td>低（无状态）</td></tr><tr><td>应用示例</td><td>HTTP、FTP、邮件</td><td>DNS、视频通话、在线游戏</td></tr></tbody></table><h3>TCP 三次握手</h3><pre><code>客户端 (Client)                          服务器 (Server)
      |                                      |
      |  SYN=1, seq=x (SYN_SENT)             |
      | -----------------------------------### |
      |                                      |
      | SYN=1, ACK=1, seq=y, ack=x+1 (SYN_RCVD)
      | &lt;----------------------------------- |
      |                                      |
      |  ACK=1, seq=x+1, ack=y+1 (ESTABLISHED)|
      | -----------------------------------### |
      |                                      |
      |                                (ESTABLISHED)
</code></pre><ol><li>客户端发送 SYN=1 seq=x， 进入 SYN_SENT 状态。</li><li>服务器回复 SYN=1 ACK=1，ack=x+1, seq=y，进入 SYN_RCVD 状态。</li><li>客户端发送 ACK=1 ack=y+ 双方进入 ESTABLISHED状态。</li></ol><p>为什么不是 2 次</p><ul><li>若只有 2 次握手，服务器无法确认客户端是否收到自己的 SYN+ACK。</li><li>如果客户端的 ACK丢失，服务器会一直等待（资源浪费），而客户端认为连接已建立，导致数据发送失败。</li></ul><p>为什么不是 4 次？</p><ul><li>冗余：第三次握手已确保双向通信可靠，无需额外确认。</li></ul><h3>四次挥手</h3><pre><code>客户端 (Client)                          服务器 (Server)
      |                                      |
      |  FIN=1, seq=u (FIN_WAIT_1)           |
      | -----------------------------------### |
      |                                      |
      |          ACK=1, ack=u+1 (CLOSE_WAIT) |
      | &lt;----------------------------------- |
      |                                      |
      |                                (LAST_ACK)
      |          FIN=1, seq=v, ack=u+1       |
      | &lt;----------------------------------- |
      |                                      |
      |  ACK=1, seq=u+1, ack=v+1 (TIME_WAIT) |
      | -----------------------------------### |
      |                                      |
      |                                (CLOSED)
</code></pre><ol><li>客户端发送 FIN=1 seq=u，进入 FIN_WAIT_1 状态。</li><li>服务器回复 ACK=1 ack=u+1，进入 CLOSE_WAIT 状态（客户端收到后进入 FIN_WAIT_2）。</li><li>服务器发送 FIN=1 seq=v，进入 LAST_ACK 状态。</li><li>客户端回复 ACK=1 ack=v+1，进入 TIME_WAIT 状态（等待 2MSL 后关闭），服务器收到后立即关闭。</li></ol><p>为什么需要四次？</p><ul><li>全双工特性：TCP 连接是双向的，需分别关闭两个方向的数据流。 <ul><li>客户端主动关闭时，服务器可能还有数据要发送（第二次挥手仅确认，不立即关闭）。</li><li>服务器完成数据发送后，再单独关闭自己的方向（第三次挥手）。</li></ul></li></ul><p>TIME_WAIT 状态的作用</p><ul><li>确保最后一个 ACK 到达服务器</li><li>让网络中残留的旧报文失效（避免与新连接混淆）。</li></ul><p><img src="`+i+'" alt="tcp"></p><h3>HTTP</h3><p>HTTP (HyperText Transfer Protocol) 是用于分布式、协作式和超媒体信息系统的应用层协议。</p><ol><li>客户端建立TCP连接</li><li>发送HTTP请求</li><li>服务器处理请求并返回HTTP响应</li><li>关闭TCP连接（在HTTP/1.0中）</li></ol><p>HTTPS (HTTP Secure) 是HTTP的安全版本，通过SSL/TLS协议提供加密传输。</p><ol><li>客户端发起HTTPS连接请求</li><li>服务器返回数字证书</li><li>客户端验证证书</li><li>双方协商加密算法和密钥（SSL/TLS握手）</li><li>建立安全通道，开始加密通信</li></ol><p>HTTP/1.1重要改进：较HTTP/1.0</p><ul><li>持久连接：减少TCP连接建立/关闭的开销</li><li>管道化：允许在未收到响应时发送下一个请求</li><li>分块传输：允许服务器逐步发送数据</li><li>增强缓存控制：提供更精细的缓存策略</li><li>虚拟主机支持：通过Host头支持多个域名共享同一IP</li></ul><h3>DNS</h3><h3>NAT</h3><ul><li>数据包从内网到外网时，会转换源IP地址，由私网地址转换成公网地址。</li><li>数据包从外网到内网时，会转换目的IP地址，由公网地址转换成私网地址。</li></ul><table><thead><tr><th>特性</th><th>静态 NAT</th><th>动态 NAT</th></tr></thead><tbody><tr><td>映射关系</td><td>一对一固定映射</td><td>多对一或多对多动态映射</td></tr><tr><td>配置方式</td><td>手动配置</td><td>自动分配</td></tr><tr><td>IP 分配</td><td>每个内部地址有固定的外部地址</td><td>从地址池中动态分配外部地址</td></tr><tr><td>持久性</td><td>永久有效</td><td>会话期间有效，超时后回收</td></tr><tr><td>适用场景</td><td>需要对外提供固定访问的服务</td><td>普通内部用户访问外部网络</td></tr><tr><td>安全性</td><td>较低（暴露固定映射）</td><td>较高（动态隐藏内部拓扑）</td></tr><tr><td>资源利用</td><td>效率低（每个内部主机需一个公网IP）</td><td>效率高（多个主机共享公网IP）</td></tr><tr><td>典型应用</td><td>Web服务器、邮件服务器等</td><td>普通员工上网、移动设备访问等</td></tr></tbody></table><h3>网络协议</h3><table><thead><tr><th>ISO/OSI 七层模型</th><th>TCP/IP 四层模型</th><th>主要协议示例</th><th>功能描述</th></tr></thead><tbody><tr><td>7. 应用层</td><td>4. 应用层</td><td>HTTP, HTTPS, FTP, SMTP, POP3, IMAP, DNS, DHCP, SNMP, SSH, Telnet, RDP, NFS</td><td>提供用户接口和网络服务</td></tr><tr><td>6. 表示层</td><td>(包含在应用层)</td><td>SSL/TLS, JPEG, MPEG, ASCII, Unicode</td><td>数据格式转换、加密/解密</td></tr><tr><td>5. 会话层</td><td>(包含在应用层)</td><td>NetBIOS, RPC, SIP, PPTP</td><td>建立/管理/终止会话</td></tr><tr><td>4. 传输层</td><td>3. 传输层</td><td>TCP (可靠), UDP (不可靠)</td><td>端到端连接、流量控制、可靠性</td></tr><tr><td>3. 网络层</td><td>2. 网络层</td><td>IP (IPv4/IPv6), ICMP, IGMP, ARP， NAT</td><td>逻辑寻址、路由选择、分组转发</td></tr><tr><td>2. 数据链路层</td><td>1. 网络接口层</td><td>Ethernet, WiFi (IEEE 802.11), PPP, MAC</td><td>物理寻址、帧传输、错误检测</td></tr><tr><td>1. 物理层</td><td>(包含在网络接口层)</td><td></td><td>比特流传输、物理介质规范</td></tr></tbody></table><hr><h3>ARP</h3><ol><li>解决映射问题 在局域网（LAN）中，设备通信需要知道目标设备的 MAC地址（物理地址），但应用程序通常只知道 IP地址（逻辑地址）。ARP的作用就是通过IP地址查询对应的MAC地址。</li><li>实现局域网内直接通信 数据包在物理网络中传输时，最终依赖的是MAC地址（而非IP地址）。ARP确保IP数据包能被正确封装成以太网帧（或其他链路层协议帧）。</li></ol><h2>数据结构</h2><h3>B+ 树和 B 树</h3><table><thead><tr><th>特性</th><th>B树</th><th>B+树</th></tr></thead><tbody><tr><td>数据存储位置</td><td>所有节点都可能存储数据</td><td>只有叶子节点存储数据</td></tr><tr><td>叶子节点链接</td><td>无</td><td>通过指针链接形成有序链表</td></tr><tr><td>非叶子节点结构</td><td>存储键和数据指针</td><td>只存储键和子节点指针</td></tr><tr><td>重复键值</td><td>不允许</td><td>允许(非叶子节点键值会重复出现)</td></tr><tr><td>查询稳定性</td><td>不稳定(可能在内部节点找到数据)</td><td>稳定(必须到叶子节点才能找到数据)</td></tr></tbody></table><p>为了减少到磁盘的读取次数，树高、读取的次数</p><h3>满二叉树、 完全二叉树</h3><p><img src="'+a+`" alt="tree"></p><h3>AVL 树 和 红黑树</h3><table><thead><tr><th>特性</th><th>AVL树</th><th>红黑树</th></tr></thead><tbody><tr><td>平衡标准</td><td>严格平衡（左右子树高度差≤1）</td><td>弱平衡（最长路径不超过最短路径2倍）</td></tr><tr><td>插入/删除效率</td><td>可能需要更多旋转操作来维持平衡</td><td>通常需要更少的旋转操作</td></tr><tr><td>查找效率</td><td>更优（因为更严格的平衡）</td><td>稍逊于AVL树</td></tr><tr><td>适用场景</td><td>查询密集型应用</td><td>插入/删除频繁的场景</td></tr></tbody></table><h3>数组和链表的区别</h3><ul><li>数组：在内存中连续存储，大小固定（静态数组）或可动态调整（动态数组，但需要重新分配内存）。</li><li>链表：通过节点分散存储在内存中，每个节点包含数据和指向下一个节点的指针（单向链表）或前后节点的指针（双向链表），内存不要求连续。</li></ul><table><thead><tr><th>特性</th><th>数组</th><th>链表</th></tr></thead><tbody><tr><td>内存布局</td><td>连续</td><td>非连续</td></tr><tr><td>访问方式</td><td>随机访问（O(1)）</td><td>顺序访问（O(n)）</td></tr><tr><td>插入/删除</td><td>O(n)（需移动元素）</td><td>O(1)（已知位置）</td></tr><tr><td>空间开销</td><td>无额外开销</td><td>需存储指针</td></tr><tr><td>大小调整</td><td>固定或昂贵（动态数组）</td><td>灵活</td></tr><tr><td>缓存局部性</td><td>好</td><td>差</td></tr></tbody></table><h2>实例</h2><h3>千万级请求的系统设计，例如铁路12306</h3><pre><code>    ┌───────────────┐
    │   用户终端     │
    └──────┬────────┘
           │请求
    ┌──────▼────────┐
    │   CDN + LB    │  ← 缓存静态资源，分散流量
    └──────┬────────┘
           │请求
    ┌──────▼────────┐
    │    API网关     │  ← 鉴权、限流、路由
    └──────┬────────┘
   ┌───────────────┐
   │  微服务层      │
   │ ┌───────────┐ │
   │ │ 票务服务   │ │ ← 分布式锁、缓存热点余票
   │ ├───────────┤ │
   │ │ 订单服务   │ │ ← 事务、消息队列削峰
   │ ├───────────┤ │
   │ │ 用户服务   │ │
   │ └───────────┘ │
   └──────┬────────┘
          │读写
    ┌─────▼───────┐
    │ 分布式数据库  │ ← 分库分表，读写分离
    └─────┬───────┘
          │缓存同步
    ┌─────▼───────┐
    │   缓存层     │ ← Redis热点数据缓存
    └─────┬───────┘
          │异步消息
    ┌─────▼───────┐
    │  消息队列    │ ← Kafka/RabbitMQ 削峰填谷
    └─────────────┘
</code></pre><p>CDN + 负载均衡（LB）：分散用户请求压力，缓存静态资源。</p><p>API 网关：做限流和鉴权，保护后端服务。</p><p>微服务层：</p><ul><li>票务服务：用分布式锁保证票数准确，利用缓存优化查询。</li><li>订单服务：通过数据库事务和消息队列处理订单，防止超卖。</li><li>用户服务：用户认证和管理。</li></ul><p>分布式数据库：水平拆分，提升并发处理能力。</p><p>缓存层：Redis缓存热点数据，快速响应。</p><p>消息队列：异步处理订单请求，削峰填谷。</p><h1>项目</h1><h2>编译器</h2><h3>1. 基础性</h3><ul><li>你实现的编译器支持哪些语法？比如是否支持嵌套语句、函数、数组等？</li><li>语法规则是你自己写的吗？有没有遇到 shift/reduce 冲突？怎么解决的？</li><li>你实现了哪些语义检查？比如类型检查、作用域检查有没有做？</li><li>Flex 中你定义的词法规则长什么样？举个例子。</li><li>中间代码是什么形式？三地址码、抽象语法树，还是 LLVM IR？</li><li>目标代码是你自己定义的汇编格式吗？能举例一段你生成的汇编代码吗？</li></ul><hr><h3>RISC-V 整数寄存器一览表</h3><table><thead><tr><th>寄存器</th><th>ABI 名称</th><th>用途</th><th>保存责任</th></tr></thead><tbody><tr><td>x1</td><td>ra</td><td>返回地址</td><td>Caller</td></tr><tr><td>x2</td><td>sp</td><td>栈指针</td><td>Calle</td></tr><tr><td>x10-11</td><td>a0-a1</td><td>函数参数/返回值</td><td>Caller</td></tr><tr><td>x12-17</td><td>a2-a7</td><td>函数参数</td><td>Caller</td></tr><tr><td>x18-27</td><td>s2-s11</td><td>保存寄存器</td><td>Callee</td></tr><tr><td>x28-31</td><td>t3-t6</td><td>临时寄存器</td><td>Caller</td></tr></tbody></table><hr><h2>桌面精灵</h2><h3>1. 基础</h3><ul><li>你是怎么实现窗口透明的？怎么做到不抢焦点但又能响应点击？</li><li>你用 Hook 拦截了哪些系统消息？鼠标？窗口？怎么实现的？</li><li>你使用 spine-unity 加载动画时，是否遇到过资源加载延迟的问题？怎么处理？</li><li>为什么需要协程？协程在 Unity 和线程的区别是什么？</li><li>如果我希望这个精灵能“回应用户说话”（比如通过语音合成），你准备怎么集成这个功能？</li></ul><h2>QT</h2><h3>1.基础</h3><ul><li>Qt 不太适合做游戏，为什么选择它？用了哪些 Qt 模块？</li><li>你的游戏是怎么处理界面更新和逻辑计算的？用定时器？还是事件驱动？</li><li>有没有设计“资源流转”的机制？比如原材料→加工→运输→成品？</li><li>你的类结构设计是怎样的？比如“建筑”、“物品”、“生产线”是怎么封装的？</li><li>存档功能怎么实现的？是序列化对象？用 JSON 还是其他格式？</li></ul><h2>RAG</h2><h1>自我介绍</h1><h2>HR</h2><blockquote><p>面试官你好，我是 XXX，目前是南京大学智能软件与工程学院的大三学生。</p><p>我将从技术背景、校园经历，个人优势三个方面来自我介绍。</p><p>技术背景方面：</p><ul><li><p>我的主要开发语言是 C++ 和 Python，java、javascript也有项目实践经历。</p></li><li><p>这学期一直保持力扣刷题，目前刷了 300 题。</p></li><li><p>我学习的课程包括：操作系统、编译原理、软件系统设计、自动化测试、软件质量管理等。</p></li></ul><p>校园经历方面</p><ul><li><p>大一时加入了校内的南播玩社团，参与策划和组织过“绿色生活打卡周”“益童筑梦”等活动，也有负责过活动推文的撰写与总结报告发布。</p></li><li><p>参与 RAG 检索问答系统的团队开发项目，项目仓库部署在gitlab，开发过程中依据CI/CD开发，负责后端评估和登录系统部分，积累了团队协作和项目管理的实际经验。</p></li></ul><p>个人优势方面</p><p>我善于学习并应用新的知识。</p><p>以我简历中的第二个项目桌面精灵为例，这是我自学unity、c#，学习spine 动画导入unity ，ab包资源解包，状态切换、协程管理，并将这些部分内容脚本化处理，最终完成整个项目的过程。</p><p>我也在尝试在 GitHub 上创建博客，借助github pages 的静态托管，整理学习内容和项目经验。</p><p>最重要的是，我能明显的感受到进步的过程，比如我大二时尝试自己写登录系统，一直是BUG，没能完成，这学期又一次尝试，很快就搭建基于supabase网上数据库、内网穿透部署前后端的登录系统。我觉得，完成一个项目，感受到自己学习到新的东西是吸引我自己的。</p><p>我希望能在贵公司进一步学习，进一步见识更多的世面。</p><p>谢谢！</p></blockquote>`,277)])))}};export{b as category,s as date,C as default,g as summary,u as updated};
