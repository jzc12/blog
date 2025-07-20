import{o as r,c as n,a as o}from"./index-92c2bcd5.js";const g="/blog/assets/分层参考模型-02420926.png",i={class:"markdown-body"},h="2025-06-21T00:00:00.000Z",s="2025-07-13T00:00:00.000Z",a="考研复习",u="计算机网络",R={__name:"计算机网络",setup(d,{expose:t}){return t({frontmatter:{date:"2025-06-21T00:00:00.000Z",updated:"2025-07-13T00:00:00.000Z",category:"考研复习",summary:"计算机网络"}}),(c,e)=>(r(),n("div",i,e[0]||(e[0]=[o('<h1>第一章 计算机网络体系结构</h1><h2>1.1 计算机网路概述</h2><h2>1.2 网络体系结构与参考模型</h2><h3>概念</h3><ul><li>实体</li><li>协议</li><li>接口</li><li>服务</li><li></li></ul><p><img src="'+g+`" alt="分层参考模型"></p><h1>第二章 物理层</h1><h2>2.1 通信基础</h2><h3>1.1 基本概念</h3><ul><li>数据、信号、码元</li><li>信源、信道、信宿</li><li>速率、波特、带宽</li></ul><h3>1.2 信道的极限容量</h3><ul><li>奈氏准则</li><li>香农定理</li></ul><h3>1.3 编码与调制</h3><h2>2.2 传输介质</h2><h3>双绞线</h3><h3>同轴电缆</h3><h3>光纤</h3><h3>无线传输介质</h3><h3>物理接口的特性</h3><h2>2.3 物理层设备</h2><h3>3.1 中继器</h3><h3>3.2 集线器</h3><h1>第三章 数据链路层</h1><h2>3.1 数据链路层的功能</h2><p><strong>基本问题</strong></p><blockquote><ol><li>封装成帧</li><li>透明传输</li><li>差错检测</li></ol></blockquote><p><strong>主要通信方式</strong></p><blockquote><p>点对点信道</p><p>广播信道</p></blockquote><h3>1.1 数据链路层的地位</h3><h3>1.2 链路管理</h3><h3>1.3 封装成帧与透明传输</h3><h3>1.4 流量控制</h3><h3>1.5 差错检测</h3><blockquote><p>位错：帧中某些位出现差错（CRC）</p><p>帧错：帧丢失、帧重复、帧失序</p></blockquote><h2>3.2 组帧</h2><blockquote><p>网络层的数据分组封装成帧（组帧），为了出错时不必重发全部数据，从而提高效率。</p><p>组帧主要解决：帧定界、帧同步、透明传输等问题。</p></blockquote><h3>2.1 字符计数法</h3><h3>2.2 字节填充法</h3><h3>2.3 零比特填充法</h3><h3>2.4 违规编码法</h3><h2>3.3 差错控制</h2><blockquote><p>比特差错</p></blockquote><blockquote><p>自动重传请求（Automatic Repeat Request: ARQ）：</p><p>前向纠错（Forward Error Correstion: FEC）: 发现差错并改正</p></blockquote><h3>3.1 检错编码</h3><blockquote><p>奇偶校验码</p></blockquote><p><strong>基本思想：</strong> 在数据后加一位校验位，用于检测数据中是否出现单个比特错误。</p><ul><li><strong>奇校验（Odd Parity）</strong>：数据中1的个数 + 校验位 = 奇数</li><li><strong>偶校验（Even Parity）</strong>：数据中1的个数 + 校验位 = 偶数</li></ul><p><strong>举例：</strong> 假设要发送4位数据：<code>1011</code> 1的个数为3（奇数）：</p><ul><li><strong>偶校验</strong> → 需要再加一个1，使总数变成4（偶数） → 编码为 <code>10111</code></li><li><strong>奇校验</strong> → 不加校验位或加0，仍为奇数 → 编码为 <code>10110</code></li></ul><p><strong>缺点：</strong> 只能检测奇数个错误（通常只能检测1位错误），无法定位错误。</p><hr><blockquote><p>循环冗余码</p></blockquote><p><strong>基本思想：</strong> 将原始数据看作一个二进制多项式，和一个“生成多项式”进行除法运算，取余数作为校验码。</p><p><strong>关键点：</strong></p><ul><li>用生成多项式（如 <code>x³ + x + 1</code>，对应 <code>1011</code>）进行模2除法。</li><li>发送方发送：原始数据 + 余数</li><li>接收方接收后再次除以生成多项式，若余数为0，则认为无错。</li></ul><p><strong>优点：</strong> 可以检测<strong>突发错误</strong>、多位错误，比奇偶校验更强。</p><hr><h3>3.2 纠错编码</h3><blockquote><p>海明码</p></blockquote><p><strong>公式：</strong></p><p>若要加入r个冗余位能检测并纠正1位错误，则要满足：</p><pre><code>2^r ≥ m + r + 1
</code></pre><p>其中：</p><ul><li><code>m</code>：原始数据位数</li><li><code>r</code>：冗余位个数</li><li><code>m + r</code>：总位数</li></ul><p><strong>设原始数据：<code>1011</code>（4位）</strong></p><p>第一步：确定冗余位数量</p><p>找最小的 r 满足：</p><pre><code>2^r ≥ m + r + 1
</code></pre><p>尝试 r=3：</p><pre><code>2^3 = 8 ≥ 4 + 3 + 1 = 8 
</code></pre><p>所以需要 3 个冗余位。</p><p>第二步：插入冗余位（按位编号）</p><p>编号从1开始，冗余位放在编号是2的幂的位置：1, 2, 4……</p><table><thead><tr><th>位编号（从左至右）</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr></thead><tbody><tr><td>类型</td><td>P1</td><td>P2</td><td>D1</td><td>P4</td><td>D2</td><td>D3</td><td>D4</td></tr><tr><td>数据</td><td>?</td><td>?</td><td>1</td><td>?</td><td>0</td><td>1</td><td>1</td></tr></tbody></table><p>第三步：计算冗余位</p><ul><li><p><strong>P1</strong> 校验位1 → 检查位号中<strong>第1位为1</strong>的所有位（1,3,5,7）</p><ul><li>位3（D1=1）、5（D2=0）、7（D4=1）→ 总1个数 = 2 → P1 = 0（偶数个1）</li></ul></li><li><p><strong>P2</strong> 校验位2 → 检查位号中<strong>第2位为1</strong>的所有位（2,3,6,7）</p><ul><li>位3（D1=1）、6（D3=1）、7（D4=1）→ 总1个数 = 3 → P2 = 1（奇数）</li></ul></li><li><p><strong>P4</strong> 校验位4 → 检查位号中<strong>第3位为1</strong>的所有位（4,5,6,7）</p><ul><li>位5（D2=0）、6（D3=1）、7（D4=1）→ 总1个数 = 2 → P4 = 0（偶数）</li></ul></li></ul><p>第四步：写出完整编码</p><table><thead><tr><th>位编号（1~7）</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr></thead><tbody><tr><td>编码值</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td></tr></tbody></table><p>最终海明码为：<strong>0110011</strong></p><p>第五步：接收端如何纠错？</p><p>假设接收端收到：<strong>0111011</strong>（位4出错）</p><ol><li>检查三个校验位：</li></ol><ul><li>P1 检查：1,3,5,7 → 1+1+0+1=3 → 奇数 → 错了</li><li>P2 检查：2,3,6,7 → 1+1+1+1=4 → 偶数 → 正确</li><li>P4 检查：4,5,6,7 → 1+0+1+1=3 → 奇数 → 错了</li></ul><p>出错位位置 = P4 P2 P1 = <code>101</code> → 二进制 5 → 位编号5出错。</p><h2>3.4 流量控制与可靠传输机制</h2><h3>4.1 流量控制</h3><blockquote><p>由接受方控制发送发的发送速率，使接收方有足够的缓存空间来接受每个帧。</p></blockquote><p><strong>数据链路层和传输层的流量控制异同</strong></p><blockquote></blockquote><p><strong>停止-等待流量控制</strong></p><p><strong>滑动窗口流量 控制</strong></p><h3>4.2 可靠传输机制</h3><p><strong>ARQ-自动重传请求</strong></p><blockquote><p>确认：接受方接受到数据帧，都要向发送方发回一个确认帧</p><p>超时重传：发送一个帧后启动计数器，若……</p></blockquote><h5>停止-等待（SW）单帧滑动窗口与停止等待协议</h5><pre><code class="language-mermaid">sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender -&gt;&gt; Receiver: 发送帧0
        Note right of Sender: [等待ACK0]
        Receiver --&gt;&gt; Sender: ACK0
        Note left of Receiver: 接收帧0&lt;br/&gt;发送ACK0
    end

    rect rgb(255, 230, 230)
        Sender -&gt;&gt; Receiver: 发送帧1
        Note right of Sender: [超时未收到ACK!]
        Sender -&gt;&gt; Receiver: 重发帧1
        Receiver --&gt;&gt; Sender: ACK1
        Note left of Receiver: 丢弃重复帧&lt;br/&gt;重发ACK1
    end
</code></pre><p><strong>特点</strong>： <strong>简单可靠</strong>，无乱序问题 <strong>信道利用率低</strong>（每次只发一帧）</p><h5>后退N帧（GBN）多帧滑动窗口与后退N 帧协议</h5><ul><li>发送方维护<strong>多帧滑动窗口</strong>（如窗口大小=3），可连续发送多帧</li><li>接收方<strong>只按序接收</strong>，丢弃乱序帧</li><li>发送方超时未收到ACK则<strong>回退重传所有未确认帧</strong></li></ul><pre><code class="language-mermaid">sequenceDiagram 
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender -&gt;&gt; Receiver: 发送帧0
        Sender -&gt;&gt; Receiver: 发送帧1
        Sender -&gt;&gt; Receiver: 发送帧2
        Note right of Sender: [窗口: 0,1,2]
        Receiver --&gt;&gt; Sender: ACK0
        Note left of Receiver: 接收帧0&lt;br/&gt;提交应用
        Receiver --&gt;&gt; Sender: ACK1
    end

    rect rgb(255, 230, 230)
        Sender -&gt;&gt; Receiver: 发送帧3
        Note right of Sender: [帧2丢失!]
        Receiver --&gt;&gt; Sender: ACK1 (重复ACK)
        Note left of Receiver: 丢弃帧3 (乱序)
        Sender -&gt;&gt; Receiver: 重发帧2
        Sender -&gt;&gt; Receiver: 重发帧3
        Receiver --&gt;&gt; Sender: ACK2
        Receiver --&gt;&gt; Sender: ACK3
    end
</code></pre><p><strong>特点</strong>： <strong>信道利用率提升</strong>（连续发送多帧） <strong>重传浪费</strong>（回退N帧）</p><h5>选择重传（SR）多帧滑动窗口与选择重传协议</h5><ul><li><p>发送方维护<strong>多帧滑动窗口</strong>（如窗口大小=3），可连续发送多帧</p></li><li><p>接收方<strong>只按序接收</strong>，丢弃乱序帧</p></li><li><p>发送方超时未收到ACK则<strong>回退重传所有未确认帧</strong></p></li></ul><pre><code class="language-mermaid">sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender -&gt;&gt; Receiver: 发送帧0
        Sender -&gt;&gt; Receiver: 发送帧1
        Sender -&gt;&gt; Receiver: 发送帧2
        Note right of Sender: [窗口: 0,1,2]
        Receiver --&gt;&gt; Sender: ACK0
        Note left of Receiver: 接收帧0&lt;br/&gt;提交应用
        Receiver --&gt;&gt; Sender: ACK1
    end

    rect rgb(255, 230, 230)
        Sender -&gt;&gt; Receiver: 发送帧3
        Note right of Sender: [帧2丢失!]
        Receiver --&gt;&gt; Sender: ACK1 (重复ACK)
        Note left of Receiver: 丢弃帧3 (乱序)
        Sender -&gt;&gt; Receiver: 重发帧2
        Sender -&gt;&gt; Receiver: 重发帧3
        Receiver --&gt;&gt; Sender: ACK2
        Receiver --&gt;&gt; Sender: ACK3
    end
</code></pre><p><strong>特点</strong>： <strong>信道利用率提升</strong>（连续发送多帧） <strong>重传浪费</strong>（回退N帧）</p><pre><code class="language-mermaid">sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender -&gt;&gt; Receiver: 发送帧0
        Sender -&gt;&gt; Receiver: 发送帧1
        Sender -&gt;&gt; Receiver: 发送帧2
        Note right of Sender: [窗口: 0,1,2]
        Receiver --&gt;&gt; Sender: ACK0
        Receiver --&gt;&gt; Sender: ACK1
        Note left of Receiver: 缓存帧0,1
    end

    rect rgb(255, 230, 230)
        Sender -&gt;&gt; Receiver: 发送帧3
        Note right of Sender: [帧2丢失!]
        Receiver --&gt;&gt; Sender: NAK2 ❌ (否定确认)
        Note left of Receiver: 缓存帧3 (乱序)
        Sender -&gt;&gt; Receiver: 重发帧2
        Receiver --&gt;&gt; Sender: ACK2
        Note left of Receiver: 提交帧0-3
        Receiver --&gt;&gt; Sender: ACK3
    end
</code></pre><h2>3.5 介质访问控制</h2><h2>3.6 局域网</h2><h2>3.7 广域网</h2><h2>3.8 数据链路层设备</h2><h1>第四章 网络层</h1><h1>第五章 传输层</h1><h1>第六章 应用层</h1>`,113)])))}};export{a as category,h as date,R as default,u as summary,s as updated};
