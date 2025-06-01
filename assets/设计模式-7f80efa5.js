import{o as e,c as o,a as r}from"./index-1138f3e3.js";const c={class:"markdown-body"},l="设计模式",p="2025-06-01T00:00:00.000Z",h="2025-06-01T00:00:00.000Z",d="教程",m="文章摘要",y={__name:"设计模式",setup(a,{expose:n}){return n({frontmatter:{title:"设计模式",date:"2025-06-01T00:00:00.000Z",updated:"2025-06-01T00:00:00.000Z",category:"教程",summary:"文章摘要"}}),(s,t)=>(e(),o("div",c,t[0]||(t[0]=[r(`<h1>软件系统设计</h1><h2>设计原则</h2><h3>面向对象的设计原则</h3><blockquote><p>可维护性、可复用性、重构</p></blockquote><h3>单一职责原则</h3><h3>开闭原则</h3><h3>里氏代换原则</h3><h3>依赖倒转原则</h3><h3>接口隔离原则</h3><h3>合成复用原则</h3><h3>迪米特法则</h3><h2>设计模式</h2><h3>简单工厂模式</h3><blockquote><p>当加入新的产品时，违背了开闭原则</p></blockquote><pre><code class="language-python">class SimpleFactory {
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
</code></pre><h3>状态模式</h3><h3>命令模式</h3><h3>适配器模式</h3><h3>组合模式</h3>`,23)])))}};export{d as category,p as date,y as default,m as summary,l as title,h as updated};
