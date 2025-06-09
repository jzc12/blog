import{o as d,c as e,a as o}from"./index-b618ed36.js";const r={class:"markdown-body"},i="os",p="2025-06-01T00:00:00.000Z",u="2025-06-02T00:00:00.000Z",l="os",B="多线程、并发",A={__name:"os",setup(a,{expose:n}){return n({frontmatter:{title:"os",date:"2025-06-01T00:00:00.000Z",updated:"2025-06-02T00:00:00.000Z",category:"os",summary:"多线程、并发"}}),(h,t)=>(d(),e("div",r,t[0]||(t[0]=[o(`<h1>摸鱼中</h1><h2>1</h2><h3>并发</h3><h4>💡 场景：两个线程同时执行各自的任务。</h4><pre><code class="language-cpp">void taskA() {
    for (int i = 0; i &lt; 5; ++i) {
        print(&quot;A&quot;);
    }
}

void taskB() {
    for (int i = 0; i &lt; 5; ++i) {
        print(&quot;B&quot;);
    }
}

int main() {
    thread t1(taskA);
    thread t2(taskB);
    t1.join();
    t2.join();
}
</code></pre><h4>🔍 输出（可能）：</h4><pre><code>ABABABABAB
或 AAAAA...BBBBB...
或 BBAABBAABB
</code></pre><h4>📌 说明：</h4><p>两个线程交替执行，顺序不可预测。并发执行，但可能不是同时执行。</p><hr><h3>2. 🔒 同步（Synchronous）</h3><h4>💡 场景：主线程等待任务完成，顺序执行。</h4><pre><code class="language-cpp">int slow_add(int a, int b) {
    sleep(2);
    return a + b;
}

int main() {
    int result = slow_add(1, 2); // 阻塞，必须等函数返回
    print(result);               // 必须在前一步完成后执行
}
</code></pre><h4>📌 说明：</h4><p>程序必须等待结果返回才能继续，任务是同步执行的。</p><hr><h3>3. 🚀 异步（Asynchronous）</h3><h4>💡 场景：任务提交后立即返回，稍后获取结果。</h4><pre><code class="language-cpp">int slow_add(int a, int b) {
    sleep(2);
    return a + b;
}

int main() {
    auto future = std::async(std::launch::async, slow_add, 1, 2);  // 异步启动
    print(&quot;doing other work...&quot;);  // 不等待任务完成，继续执行其他代码
    int result = future.get();     // 等需要时再取结果
    print(result);
}
</code></pre><h4>📌 输出（可能）：</h4><pre><code>doing other work...
3
</code></pre><h4>📌 说明：</h4><p>任务是异步执行的，主线程不中断，可以继续做别的事情。等结果时再阻塞（<code>future.get()</code>）。</p><hr><h3>✅ 总结（加一句话理解）：</h3><table><thead><tr><th>类型</th><th>简介</th><th>是否立即返回</th><th>是否阻塞</th><th>示例重点</th></tr></thead><tbody><tr><td>并发</td><td>多个线程“同时”执行任务</td><td>是</td><td>否</td><td>多线程交错打印</td></tr><tr><td>同步</td><td>先做完一个再做下一个</td><td>否</td><td>是</td><td>顺序执行、阻塞等待</td></tr><tr><td>异步</td><td>提交任务后继续执行其他逻辑</td><td>是</td><td>否（初期）</td><td>提交任务立即返回，延后取结果</td></tr></tbody></table><hr>`,27)])))}};export{l as category,p as date,A as default,B as summary,i as title,u as updated};
