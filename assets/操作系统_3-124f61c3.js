const b=`---
date: 2025-07-01
updated: 2025-07-30
category: 考研复习
summary: 操作系统 
---



## 3.1  内存管理概念

### 3.1.1 内存管理的基本原理和要求

![](./../../public/assets/os/951a00d1c0834dd1b19f85e9fe2dec60.webp)

![](./../../public/assets/os/201ec7c096334f9a8ceaec996536fceb.webp)

注 ：重定位寄存器也称基址寄存器、界地址寄存器也称为限长寄存器。

![](./../../public/assets/os/0467737efbb64a9bbe47b754fe6f11d4.webp)

将用户程序变为可在内存中执行的程序的步骤 ：

![](./../../public/assets/os/12a849934c86470fa4f2942806c65e41.webp)

1、程序的链接和装入

![](./../../public/assets/os/9da30bd1b6854bc1bb4b4013a3aeb632.webp)

1.  绝对装入  
    
    ![](./../../public/assets/os/d8e1bb74dca243e0aee619df0809f342.webp)
2.  可重定位装入  
    
    ![](./../../public/assets/os/f005eb1d0d934b58943fe2930cf0067e.webp)
3.  动态运行时装入  
    
    ![](./../../public/assets/os/33b354755c0e4833a37f0bc3d694cdb8.webp)

链接的三种方式 ：

1.  静态链接 ：在程序运行之前 ，先将各目标模块及它们所需的库函数连接成一个完整的可执行文件 （装入模块 ），之后不再拆开。
2.  装入时动态链接 ：将各目标模块装入内存时 ，边装入边链接的链接方式。
3.  运行时动态链接 ：在程序执行中需要该目标模块时 ，才对它进行链接。其优点是便于修改和更新 ，便于实现对目标模块的共享。

### 3.1.2 连续分配管理方式

![](./../../public/assets/os/1ab8a196e19f44cb92236d646f8dd405.webp)

1.  单一连续分配  
    
    ![](./../../public/assets/os/162fb4f953104b9d968bac86da4bbc56.webp)
2.  固定分区分配  
    
    ![](./../../public/assets/os/4ad773a5400c46c3a57e810f3c3d372c.webp) ![](./../../public/assets/os/17aeda7b0948440983068882e698bc46.webp)
3.  动态分区分配  
    
    ![](./../../public/assets/os/cceeb649ac32451994aad58c7ed8754d.webp) ![](./../../public/assets/os/febbb0481cd84c3f9815880b6bb95d63.webp)
    1.  系统要用什么样的数据结构记录内存的使用情况 ？  
        
        ![](./../../public/assets/os/229834103db042298483c6f71b2f5d15.webp)
    2.  当很多个空闲分区都能满足需求时 ，应该选择哪个分区进行分配 ？  
        
        ![](./../../public/assets/os/bdd83aac4b5e420fa5056cd379a43622.webp)
    3.  如何进行分区的分配与回收操作 ？  
        
        将相邻的空闲空间合并。

动态分区分配算法

![](./../../public/assets/os/4790b37b12874673a7ae509c020a0442.webp)

#### 1 首次适应算法 （First Fit ）

![](./../../public/assets/os/8632ff7b946344338921ceb135d69b9e.webp)

#### 2 邻近适应 （Next Fit ）算法

![](./../../public/assets/os/e60f2bd90d0f450fbea823c587255bc1.webp)

#### 3 最佳适应 （Best Fit ）算法

![](./../../public/assets/os/81852d66232642838db0d2bf852d9785.webp)

#### 4 最坏适应 （Worst Fit ）算法

![](./../../public/assets/os/028d36543f854d178a692a35a015b0bd.webp)

### 3.1.3 基本分页存储管理

![](./../../public/assets/os/9c73382a9cf541ef867c7e424f22c03d.webp)

#### 1 分页存储的基本概念

分页存储的定义 ：

![](./../../public/assets/os/b18f4a615b9741d59d31e0b14b0c219b.webp)

重要的存储结构——页表

![](./../../public/assets/os/b9f402dfbe0049d6b5853bdf7b664479.webp)

每个页表项占多少字节 ？

![](./../../public/assets/os/bb2ce3d1e1884dcc8a4356ef847d9267.webp) ![](./../../public/assets/os/b128696aaba944eb93316deeb4152e39.webp) ![](./../../public/assets/os/9c02a583d5614b37831850efb785493b.webp)

注 ：页表是隐含的 ！！！

如何实现地址的转换 ？

![](./../../public/assets/os/c9fa2b3ba2d44d92aca9d4c4e2bbbc5c.webp) ![](./../../public/assets/os/fc7557dbe63944149f2e040d1811eeb2.webp) ![](./../../public/assets/os/a9dd03d45123410b9dc54728b6b1188f.webp) ![](./../../public/assets/os/55609e60a6dd446e99abe7760b322274.webp) ![](./../../public/assets/os/5793c5d9d7b24aa982c903f03e78de49.webp)

逻辑地址结构

![](./../../public/assets/os/d4e5e13a2f9a4686a195867441a51093.webp)

#### 2 基本地址变换机构

![](./../../public/assets/os/1624270445334299bc47e25569c15c69.webp)

![](./../../public/assets/os/245d5d2936fb40138208102dcb38d5d3.webp) ![](./../../public/assets/os/949c8708a0ac4a3ca68c320d5ee51308.webp)

#### 3 具有快表的地址变换机构

![](./../../public/assets/os/a744f7304d274978ad2889df0afee066.webp)

快表是什么 ？

![](./../../public/assets/os/ad65f5af58a84086a5df602cfd2e6950.webp)

![](./../../public/assets/os/ff66f6d3058b4c58a391983ce634f8b6.webp) ![](./../../public/assets/os/8328e2f848274fdaadb6aec4702ce5e7.webp)

#### 4 两级页表

![](./../../public/assets/os/0fdaab162e4041bfa81f558ffb1b7594.webp)

![](./../../public/assets/os/ca930f1ed63a48d580fca03a139aa437.webp) ![](./../../public/assets/os/b7fa4f6e777e426baeffb8cc71082473.webp)

![](./../../public/assets/os/5f272bde720146e18af623c1080ce9b5.webp)

![](./../../public/assets/os/86d5a80054f84a96b25b03daf87af876.webp)

![](./../../public/assets/os/2803c1003f704de087c4c939baf9d8ae.webp)

### 3.1.4 基本分段存储管理

![](./../../public/assets/os/ee72982a4f184f8aa75de9aff18ee8d1.webp)

![](./../../public/assets/os/8f4ccaa527544bdc86232ed507d49b65.webp) ![](./../../public/assets/os/adc6de1a5de34ad0bb9b1ab191c94ced.webp) ![](./../../public/assets/os/d20b8d7af0bf4a3b96919bbb0e89b5f7.webp)

分页、分段管理的对比 ：

![](./../../public/assets/os/317d82bf45e5485f90334fb6539f18b5.webp) ![](./../../public/assets/os/d99ba5799b7b4e4f88ea43cef0516b4f.webp) ![](./../../public/assets/os/440a51fd86d04171b62565f1930e1d0b.webp)

### 3.1.5 段页式存储管理

![](./../../public/assets/os/c6ac81cf886a479d804ec36354ac4b56.webp) ![](./../../public/assets/os/9f329d0736514dd9ba0e76b2a7cb33c1.webp) ![](./../../public/assets/os/2c6714bc22bb43e8b521353fc06f99dd.webp)

引入段式存储管理方式 ，主要是为了更好地满足用户的一系列要求。

1.  方便编程
2.  共享和保护
3.  动态链接和增长

### 3.1.6 本节小结

1 ）为什么要进行内存管理 ？

> 在单道批系统阶段 ，一个系统在一个时间段内只执行一个程序 ，内存的分配极其简单 ，即仅分配给当前运行的进程。引入多道批程序后 ，进程之间共享的不仅仅是处理机 ，还有主存储器。然而 ，共享主存会形成一些特殊的挑战。若不对内存进行管理 ，则容易导致内存数据的混乱 ，以至于影响进程的并发执行。因此 ，为了更好地支持多道程序并发执行 ，必须进行内存管理。

2 ）多级页表解决了什么问题 ？又会带来什么问题 ？

> 多级页表解决了当逻辑地址空间过大时 ，页表的长度会大大增加的问题。而采用多级页表时 ，一次访盘需要多次访问内存甚至磁盘 ，会大大增加一次访存的时间。
>
> 无论是段式管理、页式管理还是段页式管理 ，读者都只需要掌握下面三个关键问题 ：
>
> 1.  逻辑地址结构
> 2.  页 （段 ）表项结构
> 3.  寻址过程。
>
> 搞清楚这三个问题 ，就相当于搞清楚了上面几种存储管理方式。再次提醒读者区分逻辑地址结构和表项结构。

## 3.2 虚拟内存管理

### 3.2.1 虚拟内存的基本概念

![](./../../public/assets/os/5aef5c0c96cb409496ee75bfd15f5ede.webp)

+   传统存储管理方式的特征  
    
    ![](./../../public/assets/os/4963b26afc1b4b2d948e720a8f79719d.webp)
+   虚拟内存器的定义和特征  
    
    ![](./../../public/assets/os/6cf1df776925434b95da82e4cd0b86b1.webp)
+   虚拟内存技术的实现  
    
    ![](./../../public/assets/os/2b098a27ed4a4869b7802348aa271cdf.webp)

### 3.2.2 请求分页管理方式

![](./../../public/assets/os/168e745585454a0e83062ceaef94d592.webp)

+   页表机制  
    
    ![](./../../public/assets/os/54d6e81315ac48859722d41a153960de.webp)
+   缺页中断机构  
    
    ![](./../../public/assets/os/327300a26252489da89c57f2c6f49749.webp) ![](./../../public/assets/os/bf1ddca32ec8417e8594b47f5da0a981.webp)
+   地址变换机构  
    
    ![](./../../public/assets/os/2a1ff6f7c6c84de7a2d84b51b27d108c.webp) ![](./../../public/assets/os/f3bf46c9de664c5abdd7833796a090f1.webp) ![](./../../public/assets/os/f327f5ec69bb41bc9c69a308dd3cc92d.webp)  
    
    注 ：只有写指令才需要修改“修改位”。

### 3.2.3 页框分配

![](./../../public/assets/os/ca0a2f76af914b1cbad4f4370bb7a65f.webp)

![](./../../public/assets/os/68575915bde8447c8a20a2ad2f7e630c.webp) ![](./../../public/assets/os/8d2a780cddbc4489b32a9e63fd7b231f.webp) ![](./../../public/assets/os/c03434fb6dc04539b615b44fd4add891.webp) ![](./../../public/assets/os/fc086205f98d475a8bb990bada8144ca.webp)

### 3.2.4 页面置换算法

![](./../../public/assets/os/49b3b08359424fe5806b8f7e1816f7aa.webp)

注 ：Belady异常 （Bélády 's Anomaly ）是计算机存储管理中的一个现象 ，它指的是在某些内存访问模式下 ，增加页面框 （Page Frames ）的数量反而会导致页面错误 （Page Faults ）次数增加。

#### 1 最佳 （OPT ）置换算法  

![](./../../public/assets/os/f2929775b48b47bba13c36aaedb03a82.webp)

#### 2 先进先出 （FIFO ）算法  

![](./../../public/assets/os/b780589be0c74252bb86dae129bae6bf.webp)

#### 3 最近最久未使用 （LRU ）算法  

![](./../../public/assets/os/3c64309f8221447e975f793416ecd40f.webp)

#### 4 时钟 （CLOCK/NRU ） 置换算法  

![](./../../public/assets/os/77052eed5fce46a4bbecbb33b70acce8.webp)

改进型CLOCK置换算法  

![](./../../public/assets/os/49600b4d0e4c4a1b812e08caddc2d5d0.webp)  

注 ：二改访00010001

### 3.2.5  抖动和工作集

![](./../../public/assets/os/e138c4131a20477485379b4728ae5a92.webp)

### 3.2.6 内存映射文件

这就是操作系统向应用程序提供的一个系统调用 ，它与虚拟内存有些相似 ，在磁盘文件与进程的虚拟地址空间之间建立映射关系。

将一个文件当作内存中的一个大字符数组来访问而不通过文件I/O ，这显然更便利。

![](./../../public/assets/os/5e0531530b9144e989b0872d69e92963.webp)

### 3.2.7 虚拟存储器性能影响因素

缺页率是影响虚拟存储器性能的主要因素 ，而缺页率又受到页面大小、分配给进程的物理块数、页面置换算法以及程序的编制方法的影响。

### 3.2.8 地址翻译

### 3.2.9 本节小结

1 ）为什么要引入虚拟内存 ？

> 上一节提到过 ，多道程序并发执行不仅使进程之间共享了处理器 ，而且同时共享了主存。然而 ，随着对处理器需求的增长 ，进程的执行速度会以某种合理平滑的方式慢下来。但是 ，若同时运行的进程太多 ，则需要很多的内存 ，当一个程序没有内存空间可用时 ，那么它甚至无法运行。所以 ，在物理上扩展内存相对有限的条件下 ，应尝试以一些其他可行的方式在逻辑上扩充内存。

2 ）虚拟内存 （虚存 ）空间的大小由什么因素决定 ？

> 虚存的容量要满足以下两个条件
>
> 1.  虚存的实际容量 ≤ 内存容量和外存容量之和 ，这是硬件的硬性条件规定的 ，若虚存的实际容量超过了这个容量 ，则没有相应的空间来供虚存使用。
> 2.  虚存的最大容量 ≤ 计算机的地址位数能容纳的最大容量。假设地址是32位的 ，按字节编址 ，一个地址代表1B存储空间 ，则虚存的最大容量≤4GB （2^32B ）。这是因为若虚存的最大容量超过4GB ，则32位的地址将无法访问全部虚存 ，也就是说4GB以后的空间被浪费了 ，相当于没有一样 ，没有任何意义 。
>
> 实际虚存的容量是取条件1和2的交集 ，即两个条件都要满足 ，仅满足一个条件是不行的。

3 ）虚拟内存是怎么解决问题的 ？会带来什么问题 ？

> 虚拟内存使用外存上的空间来扩充内存空间 ，通过一定的换入/换出 ，使得整个系统在逻辑上能够使用一个远远超出其物理内存大小的内存容量。因为虚拟内存技术调换页面时需要访问外存 ，会导致平均访存时间增加 ，若使用了不合适的替换算法 ，则会大大降低系统性能。 
> 本节学习了4种页面置换算法 ，要将它们与处理机调度算法区分开。当然 ，这些调度算法之间也是有联系的 ，它们都有一个共同点 ，即通过一定的准则决定资源的分配对象。在处理机调度算法中这些准则比较多 ，有优先级、响应比、时间片等 ，而在页面调度算法中就比较简单 ，即是否被用到过或近段时间内是否经常使用。在操作系统中 ，几乎每类资源都会有相关的调度算法读者通过将这些调度算法作为线索 ，可将整个操作系统的课程连成一个整体。

## 3.3 本章疑难点

![](./../../public/assets/os/9da75b4d13904c68be3a378a0369620d.webp)

`;export{b as default};
