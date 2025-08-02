const n=`---
date: 2025-06-21
updated: 2025-07-13
category: 考研复习
summary: 计算机网络
---


# 第一章  计算机网络体系结构



## 1.1 计算机网路概述





## 1.2 网络体系结构与参考模型

### 概念

- 实体
- 协议
- 接口
- 服务
- 



![分层参考模型](../../public/assets/分层参考模型.webp)







# 第二章 物理层



## 2.1 通信基础

### 1.1 基本概念

- 数据、信号、码元
- 信源、信道、信宿
- 速率、波特、带宽

### 1.2 信道的极限容量

- 奈氏准则
- 香农定理

### 1.3 编码与调制



## 2.2 传输介质

### 双绞线

### 同轴电缆

### 光纤

### 无线传输介质

### 物理接口的特性





## 2.3 物理层设备

### 3.1 中继器

### 3.2 集线器





# 第三章 数据链路层

## 3.1 数据链路层的功能

**基本问题**

> 1. 封装成帧
> 2. 透明传输
> 3. 差错检测

**主要通信方式**

> 点对点信道
>
> 广播信道

### 1.1 数据链路层的地位



### 1.2 链路管理



### 1.3 封装成帧与透明传输



### 1.4 流量控制



### 1.5 差错检测

> 位错：帧中某些位出现差错（CRC）
>
> 帧错：帧丢失、帧重复、帧失序





## 3.2 组帧



> 网络层的数据分组封装成帧（组帧），为了出错时不必重发全部数据，从而提高效率。
>
> 组帧主要解决：帧定界、帧同步、透明传输等问题。

### 2.1 字符计数法



### 2.2 字节填充法



### 2.3 零比特填充法



### 2.4 违规编码法



## 3.3 差错控制

> 比特差错

> 自动重传请求（Automatic Repeat Request: ARQ）：
>
> 前向纠错（Forward Error Correstion: FEC）: 发现差错并改正

### 3.1 检错编码

> 奇偶校验码

**基本思想：**
 在数据后加一位校验位，用于检测数据中是否出现单个比特错误。

- **奇校验（Odd Parity）**：数据中1的个数 + 校验位 = 奇数
- **偶校验（Even Parity）**：数据中1的个数 + 校验位 = 偶数

**举例：**
 假设要发送4位数据：\`1011\`
 1的个数为3（奇数）：

- **偶校验** → 需要再加一个1，使总数变成4（偶数） → 编码为 \`10111\`
- **奇校验** → 不加校验位或加0，仍为奇数 → 编码为 \`10110\`

**缺点：** 只能检测奇数个错误（通常只能检测1位错误），无法定位错误。

---

> 循环冗余码

**基本思想：**
 将原始数据看作一个二进制多项式，和一个“生成多项式”进行除法运算，取余数作为校验码。

**关键点：**

- 用生成多项式（如 \`x³ + x + 1\`，对应 \`1011\`）进行模2除法。
- 发送方发送：原始数据 + 余数
- 接收方接收后再次除以生成多项式，若余数为0，则认为无错。

**优点：** 可以检测**突发错误**、多位错误，比奇偶校验更强。



---

### 3.2 纠错编码

> 海明码

**公式：**

若要加入r个冗余位能检测并纠正1位错误，则要满足：

\`\`\`
2^r ≥ m + r + 1
\`\`\`

其中：

- \`m\`：原始数据位数
- \`r\`：冗余位个数
- \`m + r\`：总位数



**设原始数据：\`1011\`（4位）**

第一步：确定冗余位数量

找最小的 r 满足：

\`\`\`
2^r ≥ m + r + 1
\`\`\`

尝试 r=3：

\`\`\`
2^3 = 8 ≥ 4 + 3 + 1 = 8 
\`\`\`

所以需要 3 个冗余位。



第二步：插入冗余位（按位编号）

编号从1开始，冗余位放在编号是2的幂的位置：1, 2, 4……

| 位编号（从左至右） | 1    | 2    | 3    | 4    | 5    | 6    | 7    |
| ------------------ | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 类型               | P1   | P2   | D1   | P4   | D2   | D3   | D4   |
| 数据               | ?    | ?    | 1    | ?    | 0    | 1    | 1    |



第三步：计算冗余位

- **P1** 校验位1 → 检查位号中**第1位为1**的所有位（1,3,5,7）

    - 位3（D1=1）、5（D2=0）、7（D4=1）→ 总1个数 = 2
         → P1 = 0（偶数个1）

- **P2** 校验位2 → 检查位号中**第2位为1**的所有位（2,3,6,7）

    - 位3（D1=1）、6（D3=1）、7（D4=1）→ 总1个数 = 3
         → P2 = 1（奇数）

- **P4** 校验位4 → 检查位号中**第3位为1**的所有位（4,5,6,7）

    - 位5（D2=0）、6（D3=1）、7（D4=1）→ 总1个数 = 2
         → P4 = 0（偶数）

    

第四步：写出完整编码

| 位编号（1~7） | 1    | 2    | 3    | 4    | 5    | 6    | 7    |
| ------------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 编码值        | 0    | 1    | 1    | 0    | 0    | 1    | 1    |

最终海明码为：**0110011**



第五步：接收端如何纠错？

假设接收端收到：**0111011**（位4出错）

1. 检查三个校验位：

- P1 检查：1,3,5,7 → 1+1+0+1=3 → 奇数 → 错了 
- P2 检查：2,3,6,7 → 1+1+1+1=4 → 偶数 → 正确
- P4 检查：4,5,6,7 → 1+0+1+1=3 → 奇数 → 错了 

出错位位置 = P4 P2 P1 = \`101\` → 二进制 5 → 位编号5出错。





## 3.4 流量控制与可靠传输机制

### 4.1 流量控制

> 由接受方控制发送发的发送速率，使接收方有足够的缓存空间来接受每个帧。

**数据链路层和传输层的流量控制异同**

> 

**停止-等待流量控制**



**滑动窗口流量 控制**



### 4.2 可靠传输机制

**ARQ-自动重传请求**

> 确认：接受方接受到数据帧，都要向发送方发回一个确认帧
>
> 超时重传：发送一个帧后启动计数器，若……

##### 停止-等待（SW）单帧滑动窗口与停止等待协议

\`\`\`mermaid
sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender ->> Receiver: 发送帧0
        Note right of Sender: [等待ACK0]
        Receiver -->> Sender: ACK0
        Note left of Receiver: 接收帧0<br/>发送ACK0
    end

    rect rgb(255, 230, 230)
        Sender ->> Receiver: 发送帧1
        Note right of Sender: [超时未收到ACK!]
        Sender ->> Receiver: 重发帧1
        Receiver -->> Sender: ACK1
        Note left of Receiver: 丢弃重复帧<br/>重发ACK1
    end
\`\`\`

**特点**：
**简单可靠**，无乱序问题
**信道利用率低**（每次只发一帧）





##### 后退N帧（GBN）多帧滑动窗口与后退N 帧协议

- 发送方维护**多帧滑动窗口**（如窗口大小=3），可连续发送多帧
- 接收方**只按序接收**，丢弃乱序帧
- 发送方超时未收到ACK则**回退重传所有未确认帧**

\`\`\`mermaid
sequenceDiagram 
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender ->> Receiver: 发送帧0
        Sender ->> Receiver: 发送帧1
        Sender ->> Receiver: 发送帧2
        Note right of Sender: [窗口: 0,1,2]
        Receiver -->> Sender: ACK0
        Note left of Receiver: 接收帧0<br/>提交应用
        Receiver -->> Sender: ACK1
    end

    rect rgb(255, 230, 230)
        Sender ->> Receiver: 发送帧3
        Note right of Sender: [帧2丢失!]
        Receiver -->> Sender: ACK1 (重复ACK)
        Note left of Receiver: 丢弃帧3 (乱序)
        Sender ->> Receiver: 重发帧2
        Sender ->> Receiver: 重发帧3
        Receiver -->> Sender: ACK2
        Receiver -->> Sender: ACK3
    end
\`\`\`

**特点**：
**信道利用率提升**（连续发送多帧）
**重传浪费**（回退N帧）



##### 选择重传（SR）多帧滑动窗口与选择重传协议

- 发送方维护**多帧滑动窗口**（如窗口大小=3），可连续发送多帧

- 接收方**只按序接收**，丢弃乱序帧

- 发送方超时未收到ACK则**回退重传所有未确认帧**

\`\`\`mermaid
sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender ->> Receiver: 发送帧0
        Sender ->> Receiver: 发送帧1
        Sender ->> Receiver: 发送帧2
        Note right of Sender: [窗口: 0,1,2]
        Receiver -->> Sender: ACK0
        Note left of Receiver: 接收帧0<br/>提交应用
        Receiver -->> Sender: ACK1
    end

    rect rgb(255, 230, 230)
        Sender ->> Receiver: 发送帧3
        Note right of Sender: [帧2丢失!]
        Receiver -->> Sender: ACK1 (重复ACK)
        Note left of Receiver: 丢弃帧3 (乱序)
        Sender ->> Receiver: 重发帧2
        Sender ->> Receiver: 重发帧3
        Receiver -->> Sender: ACK2
        Receiver -->> Sender: ACK3
    end
\`\`\`

**特点**：
**信道利用率提升**（连续发送多帧）
**重传浪费**（回退N帧）



\`\`\`mermaid
sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    rect rgb(220, 240, 255)
        Sender ->> Receiver: 发送帧0
        Sender ->> Receiver: 发送帧1
        Sender ->> Receiver: 发送帧2
        Note right of Sender: [窗口: 0,1,2]
        Receiver -->> Sender: ACK0
        Receiver -->> Sender: ACK1
        Note left of Receiver: 缓存帧0,1
    end

    rect rgb(255, 230, 230)
        Sender ->> Receiver: 发送帧3
        Note right of Sender: [帧2丢失!]
        Receiver -->> Sender: NAK2 ❌ (否定确认)
        Note left of Receiver: 缓存帧3 (乱序)
        Sender ->> Receiver: 重发帧2
        Receiver -->> Sender: ACK2
        Note left of Receiver: 提交帧0-3
        Receiver -->> Sender: ACK3
    end
\`\`\`






## 3.5 介质访问控制



## 3.6 局域网



## 3.7 广域网



## 3.8 数据链路层设备





# 第四章 网络层







# 第五章 传输层









# 第六章 应用层



`;export{n as default};
