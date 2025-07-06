import{o as p,c as h,a as r}from"./index-c1965cfe.js";const s="/blog/assets/系统调用-266958a9.jpg",d="/blog/assets/进程状态-44811026.png",n={class:"markdown-body"},a="2025-07-01T00:00:00.000Z",i="2025-07-01T00:00:00.000Z",C="考研复习",B="操作系统",u={__name:"操作系统",setup(e,{expose:o}){return o({frontmatter:{date:"2025-07-01T00:00:00.000Z",updated:"2025-07-01T00:00:00.000Z",category:"考研复习",summary:"操作系统"}}),(g,t)=>(p(),h("div",n,t[0]||(t[0]=[r(`<h1>第一章 计算机系统概述</h1><h2>1.1 操作系统的基本概念</h2><h2>1.2 发展历程</h2><h2>1.3 运行的环境</h2><blockquote><p>特权指令</p><p>非特权指令</p></blockquote><h3>3.1 内核操作</h3><ol><li><p>时钟管理</p></li><li><p>中断机制</p></li><li><p>原语</p></li><li><p>系统控制的数据结构及处理</p></li></ol><h3>3.2 中断和异常的概念</h3><ol><li>定义</li></ol><pre><code class="language-mermaid">graph LR
    A[中断] --&gt; B[内部异常]
    A --&gt; C[外部中断（硬件）]
    B --&gt; D[故障（Fault）] --&gt; G[软件中断]
    B --&gt; E[自陷（Trap）] --&gt; H[软件中断]
    B --&gt; F[终止（Abort）] --&gt; I[硬件中断]
    C --&gt; J[可屏蔽中断 INTR]
    C --&gt; K[不可屏蔽中断 NMI]
</code></pre><p>访管指令 – trap 指令</p><ol start="2"><li>处理过程</li></ol><pre><code class="language-mermaid">flowchart LR
    A[CPU执行用户程序第i条指令] --&gt; B{检测到异常事件\\n或中断请求信号?}
    B -- 是 --&gt; C[打断当前程序]
    C --&gt; D[转至中断/异常处理程序]
    D --&gt; E{问题可解决?}
    E -- 是 --&gt; F[执行中断返回指令]
    F --&gt; G[返回用户程序\\n第i或i+1条指令]
    E -- 否 --&gt; H[终止用户程序]
    B -- 否 --&gt; A

    classDef decision fill:#f8f9fa,stroke:#495057,stroke-width:2px
    classDef process fill:#e9f5ff,stroke:#228be6
    class B,E decision
    class A,C,D,F,G,H proces
</code></pre><h3>3.3 系统调用</h3><ol><li>按功能分类</li></ol><blockquote><p>设备管理</p><p>文件管理</p><p>进程控制</p><p>进程通信</p><p>内存管理</p></blockquote><ol start="2"><li>处理过程</li></ol><img src="`+s+'" alt="系统调用" style="zoom:25%;"><h2>1.4 操作系统结构</h2><h3>4.1 分层法</h3><p>优点：</p><p>问题：</p><h3>4.2 模块化</h3><h3>4.3 宏内核</h3><h3>4.4 微内核</h3><h3>4.5 外核</h3><h2>1.5 操作系统引导</h2><p><strong>1. 激活CPU</strong></p><p><strong>2. 硬件自检</strong></p><p><strong>3. 加载带有操作系统的硬盘</strong></p><p><strong>4. 加载主引导记录 MBR</strong></p><p><strong>5. 扫描硬盘分区表</strong></p><p><strong>6. 加载分区引导记录 PBR</strong></p><p><strong>7. 加载启动管理器</strong></p><p><strong>8. 加载操作系统</strong></p><h2>1.6 虚拟机</h2><h1>第二章 进程 &amp; 线程</h1><h2>2.1 进程</h2><h3>1.1 基本概念</h3><blockquote><p><strong>目的</strong>： 为允许多个程序并发执行、更好的描述和控制程序的并发执行，实现操作系统的并发性和共享性。</p></blockquote><blockquote><p><strong>PCB （Process Control Block）</strong>: 进程控制块，描述进程的基本情况和运行状态，进而控制和管理进程</p></blockquote><blockquote><p>进程是一个程序及其数据从磁盘加载到内存后，在CPU上的执行过程； <strong>是系统进行资源分配和调度的基本单位</strong></p></blockquote><p>特征（理解）：动态、并发、独立、异步</p><h3>1.2 进程的组成</h3><h4>PCB</h4><blockquote><p>​ 进程创建时，操作系统为它新建一个PCB，该结构之后常驻内存，任何时刻都可以存取，并在进程结束时删除。 PCB是进程实体的一部分，是进程存在的唯一标志。</p><p>​ 进程执行时，系统通过其 PCB了解进程的现行状态信息，以便操作系统对其进行控制和管理；进程结束时，系统收回其PCB，该进程随之消亡。</p><p>​ 当操作系统希望调度某个进程运行时，要从该进程的PCB中查出其现行状态及优先级；在调度到某个进程后，要根据其PCB中所保存的CPU状态信息，设置该进程恢复运行的现场，并根据其PCB中的程序和数据的内存始址，找到其程序和数据；进程在运行过程中，当需要和与之合作的进程实现同步、通信或访问文件时，也需要访问PCB；当进程由于某种原因此暂停运行时，又需将其断点的 CPU环境保存在PCB中。可见，在进程的整个生命期中，系统总是通过PCB对进程进行控制的，亦即系统唯有通过进程的PCB才能感知到该进程的存在。</p></blockquote><p><strong>PCB通常包含的内容</strong></p><table><thead><tr><th>进程描述信息</th><th>进程控制和管理信息</th><th>资源分配清单</th><th>处理机相关信息</th></tr></thead><tbody><tr><td>进程标识符(PID)</td><td>进程当前状态</td><td>代码段指针</td><td>通用寄存器值</td></tr><tr><td>用户标识符(UID)</td><td>进程优先级</td><td>数据段指针</td><td>地址寄存器值</td></tr><tr><td></td><td>代码运行入口地址</td><td>堆栈段指针</td><td>控制寄存器值</td></tr><tr><td></td><td>程序的外存地址</td><td>文件描述符</td><td>标志寄存器值</td></tr><tr><td></td><td>进入内存时间</td><td>键盘</td><td>状态字</td></tr><tr><td></td><td>CPU占用时间</td><td>鼠标</td><td></td></tr><tr><td></td><td>信号量使用</td><td></td><td></td></tr></tbody></table><p><strong>PCB组织方式</strong></p><blockquote><p>链接</p><p>索引</p></blockquote><h4>程序段</h4><h4>数据段</h4><h3>1.3 进程的状态与转换</h3><p><img src="'+d+'" alt="进程状态"></p><h3>1.4 进程控制</h3><blockquote><p>操作系统中，一般将进程控制用的程序程称为原语（不允许终端、不允许分割）。</p></blockquote><h4>进程的创建</h4><h4>进程的终止</h4><h4>进程的阻塞和唤醒</h4><h2>2.2 线程</h2><h2>2.3 CPU调度</h2><h2>2.4 同步与互斥</h2><h2>2.5 死锁</h2><h1>第三章 内存管理</h1><h2>3.1 内存管理</h2><h2>3.2 虚拟内存管理</h2><h1>第四章 文件管理</h1><h1>第五章 输入输出</h1>',68)])))}};export{C as category,a as date,u as default,B as summary,i as updated};
