---
date: 2025-06-20
updated: 2025-07-05
category: hw
summary: 高级算法作业2
---
# hw2

## 0

![hw2](./../../public/assets/hw2.png)

---

## 1

先梳理简单制表哈希

分为三个步骤

1. 把输入的 X 按字节或者多个字节拆解 为 ${x_1, x_2,...,x_c}$ , 每个 $x_i$是 X 按顺序的 d 位的值
2. c 个随即表的初始化，每个表 有 $2^d$  个数
3. 计算 $h(x) = T₀[x₀] \oplus T₁[x₁] \oplus ... \oplus T_{c-1}[x_{c-1}]$， 所有的映射结果进行异或操作

可能存在的问题：

（1）简单制表要求将键拆分成 c个固定位宽 d的值。对不同长度的值，需要填充或截断处理。哈希映射是线性结构。

（2）要求极高质量哈希的情景下，简单制表可能会存在问题。



针对问题1.

扭曲制表哈希

也是分为三个步骤

1. $X \to (x_0, x_1, \dots, x_{c-1})$，  每个 $x_i$是 X 按顺序的 d 位的值

2. c 个随机表的初始化，每个表 有 $2^d$  个数

3. 计算：

 $h' = T_1[x_1] \oplus T_2[x_2] \oplus \cdots \oplus T_{c-1}[x_{c-1}]$ 

 $h(x) = T_0[x_0 \oplus h'] \oplus h'$

对比简单制表,扭曲制表在高位信息和低位访问路径之间建立了依赖，避免了冲突“只集中在某一低位”的局限；

可能问题：与简单制表相比，实现复杂度略高，但是好像也没高很多



针对问题2.

双表制表哈希

双表制表哈希想法就是再单个简单制表哈希的基础上再套一层，相同的三个步骤再走一遍，只是 c 和 d 的值在第二次的映射可以变化。

我觉得加为两层的制表哈希想法很简单，但是确实很有用，第二层提高了更多的独立性，但是引入的问题是更多的随机表初始化的消耗和计算复杂度的增加。

第一层提供基础的混合与打散；

第二层对第一层结果进一步扰动，使得整体哈希函数能达到较高的独立性；

可能问题：

需要 $c + c'$ 张随机表增加了额外的初始化和计算开销；

相比简单制表哈希，增加了两倍查表和额外 XOR 的计算，实际性能在某些高性能场景可能不如扭曲制表哈希，不具备局部扰动优化

------

## 2



先简单梳理 JL 定理

对于任意 $0 < \epsilon < 1$，任意点集 $S \subset \mathbb{R}^d$，$|S| = n$，存在线性映射 $A: \mathbb{R}^d \to \mathbb{R}^k$，$k = O(\epsilon^{-2} \log n)$，使得对所有 $x, y \in S$：
$
(1 - \epsilon)\|x - y\|_2^2 \le \|Ax - Ay\|_2^2 \le (1 + \epsilon)\|x - y\|_2^2
$​

现在这道题单位向量具有较低的 $l_{\infty}$-norm，对于单位向量 $X \in S^{d-1}$ 保证 $\displaystyle \max_i X_i$ 较低， 求保证正确性的前提情况下的能下降的维数

设单位向量 $\mathbf{x} \in \mathbb{S}^{d-1}$，定义：$A_i$ 为 $A$ 的第 $i$ 行；$Y_i = \langle A_i, \mathbf{x} \rangle = \displaystyle\sum_{j=1}^d A_{ij} x_j$  、  $\|\mathbf{x}\|_\infty \le \alpha$

则 $\|A \mathbf{x}\|_2^2 = \displaystyle\sum_{i=1}^k Y_i^2$。

由于 $A_{ij} \sim \mathcal{N}(0, \frac{1}{k})$ 且 $\|\mathbf{x}\|_2 = 1$，有：
$
\mathbb{E}[Y_i] = 0,\quad \text{Var}(Y_i) = \frac{1}{k}
\Rightarrow \mathbb{E}[Y_i^2] = \frac{1}{k}
\Rightarrow \mathbb{E}[\|A \mathbf{x}\|_2^2] = \displaystyle\sum_{i=1}^k \mathbb{E}[Y_i^2] = 1
$


$\because
\mathbb{E}[Y_i^4] = 3 \cdot \text{Var}(Y_i)^2 = \frac{3}{k^2}
\Rightarrow \text{Var}(Y_i^2) = \mathbb{E}[Y_i^4] - (\mathbb{E}[Y_i^2])^2 = \frac{2}{k^2}
$
$\therefore
\text{Var}(\|A \mathbf{x}\|_2^2) = \sum_{i=1}^k \text{Var}(Y_i^2) = \frac{2}{k}
$

而

$
\text{Var}(Y_i) = \frac{1}{k} \displaystyle\sum_{j=1}^d x_j^2 \le \frac{1}{k} \cdot d \cdot \alpha^2
\Rightarrow \text{Var}(Y_i^2) \le 2 \cdot \left( \frac{d \alpha^2}{k} \right)^2 = \frac{2 d^2 \alpha^4}{k^2}
$

$
\text{Var}(\|A \mathbf{x}\|_2^2) \le k \cdot \frac{2 d^2 \alpha^4}{k^2} = \frac{2 d^2 \alpha^4}{k}
$

又 $\because$

切比雪夫不等式：

$\mathbb{P}\left[ \left| \|A\mathbf{x}\|_2^2 - 1 \right| > \epsilon \right] \leq \frac{\text{Var}(\|A\mathbf{x}\|_2^2)}{\epsilon^2} \leq \frac{2 d^2 \alpha^4}{k \epsilon^2}$

右边不超过 $\delta$，得：$k \geq \frac{2 d^2 \alpha^4}{\delta \epsilon^2}$



$\therefore$ 对于所有 $\mathbf{x} \in \mathbb{S}^{d-1}$，且满足 $\|\mathbf{x}\|_\infty \le \alpha$，若要确保：
$
\mathbb{P}\left[ \left| \|A\mathbf{x}\|_2^2 - 1 \right| > \epsilon \right] < \delta
$
可以将维度降到：$k = O\left( \frac{d^2 \alpha^4}{\delta \epsilon^2} \right)$

---

## 3



3.1  对于 metric space $([0,n]^d, d)$，距离定义为

 $ d(x,y) = \sqrt{\displaystyle\sum_i \min(|x_i - y_i|, n - |x_i - y_i|)^2}$
即每一维上的距离是模 $n$ 的圆周距离。

将每个维度 $x_i \in [0,n]$ 映射为圆上的二维圆上的点，保留圆周的距离特性：
$
\varphi_i(x) = \left(\frac{n}{2\pi}\cos\left(\frac{2\pi x_i}{n}\right), \frac{n}{2\pi}\sin\left(\frac{2\pi x_i}{n}\right)\right)
$
所有维度拼接后 $\varphi(x) \in \mathbb{R}^{2d}$，此时 $d(x, y) \approx \| \varphi(x) - \varphi(y) \|_2$

对映射后的 $\varphi(x)$ 应用随机投影哈希：$h_{b,t}(x) = \left\lfloor \frac{\langle b, \varphi(x) \rangle + t}{w} \right\rfloor$
其中 $b \sim \mathcal{N}(0, I_{2d})$，$t \sim \text{Unif}[0,w]$，$w$ 是桶宽。

 $\varphi$ 将圆周距离转化为欧式距离，同时随机投影在欧氏空间中满足 LSH 性质



3.2 对于单位球面 $(S^{d-1}, d)$，距离定义为 $d(x, y) = \arccos(\langle x, y \rangle)$
即两单位向量间的夹角

对每个向量 $x \in S^{d-1}$，随机选取 $b \sim \mathcal{N}(0,I_d)$，定义哈希函数：

$h_b(x) = \text{sign}(\langle b, x \rangle) \in \{-1, +1\}$
对任意 $x, y \in S^{d-1}$，碰撞概率：

$\Pr[h_b(x) = h_b(y)] = 1 - \frac{\theta(x,y)}{\pi}, \quad \theta(x,y) = \arccos(\langle x, y \rangle)$
表明夹角越小，碰撞概率越高，夹角越大，碰撞概率越低

然后 独立选取 $k$ 个高斯向量 ${b_1, \dots , b_k}$ ，用来构造哈希签名 : $H(x) = (h_{b_1}(x), \dots , h_{b_k}(x))$

通过调整 $ k $ 进而 控制 $(r, cr, p, q)$   满足：

若$d(x, y) \le r \Rightarrow \Pr[h(x)=h(y)] \ge p$

若$d(x, y) > cr \Rightarrow \Pr[h(x)=h(y)] \le q$

碰撞的概率 与 夹角 $1 - \frac{\theta}{\pi}$  相关， 随 $\theta $ ,减少而单调递减，满足LSH 的要求

------

## 4



设 $n > 2^d$，随机矩阵 $A \in \{0,1\}^{n \times d}$，其中每一列 $a_i$ 是从标准正交基 $\{e_1, \dots, e_n\}$ 中独立均匀采样一个向量，即 $a_i = e_{k_i}$，

其中 $k_i \in [n]$ 为随机选择。

设 $\prod \in \mathbb{R}^{m \times n}$ 是任意固定的列稀疏度为 1 的矩阵，可等价表示为一个函数 $\sigma : [n] \to [m]$，使得 $\prod_{i,j} = 1$ 当且仅当 $\sigma(j) = i$，

则 $\prod a_i = e_{\sigma(k_i)} \in \mathbb{R}^m$。

子空间嵌入要求对于任意向量 $x \in \mathbb{R}^d$，有：$(1 - \varepsilon) \|A x\|_2^2 \le \|\prod A x\|_2^2 \le (1 + \varepsilon) \|A x\|_2^2.$

构造 $x = e_i - e_j$，满足：

$A x = a_i - a_j = e_{k_i} - e_{k_j}, \quad \|A x\|_2^2 = 
\begin{cases}
0 & \text{if } k_i = k_j \\
2 & \text{if } k_i \ne k_j
\end{cases}$

若 $\sigma(k_i) = \sigma(k_j)$，则：

$\prod A x = \prod (a_i - a_j) = \prod a_i - \prod a_j = e_{\sigma(k_i)} - e_{\sigma(k_j)} = 0, \quad \Rightarrow \|\prod A x\|_2^2 = 0.$



定义$\mathcal{E}_{i,j} := \{k_i \ne k_j \text{ 且 } \sigma(k_i) = \sigma(k_j)\}$

当 $\mathcal{E}_{i,j}$ 发生时有 $\|A x\|_2^2 = 2$，但 $\|\prod A x\|_2^2 = 0$，违反了 OSE 条件。



$\mathbb{P}(\mathcal{E}_{i,j}) = \mathbb{P}(k_i \ne k_j) \cdot \mathbb{P}(\sigma(k_i) = \sigma(k_j) \mid k_i \ne k_j).$

由于 $n > 2^d$，可认为 $\mathbb{P}(k_i \ne k_j) \approx 1$

对于任意固定的 $\sigma$，令 $w_r = |\sigma^{-1}(r)|$ 为第 $r$ 个桶中元素个数

则有：

$\displaystyle\sum_{r=1}^m w_r = n, \quad \sum_{r=1}^m w_r^2 \ge \frac{n^2}{m} \quad \text{(Cauchy-Schwarz 定理)}.$

$\therefore \mathbb{P}(\sigma(k_i) = \sigma(k_j) \mid k_i \ne k_j) = \frac{1}{n(n-1)} \displaystyle\sum_{r=1}^m w_r(w_r - 1) \ge \frac{1}{n^2} \displaystyle\sum_{r=1}^m w_r^2 \ge \frac{1}{m}.$

存在常数 $c > 0$ 使得：$\mathbb{P}(\mathcal{E}_{i,j}) \ge \frac{c}{m}$



不妨设  $X = \displaystyle\sum_{1 \le i < j \le d} \mathbf{1}_{\mathcal{E}_{i,j}}, \quad \mathbb{E}[X] \ge \binom{d}{2} \cdot \frac{c}{m} = \Omega\left(\frac{d^2}{m}\right).$

若 $m = o(d^2)$，则 $\mathbb{E}[X] \to \infty$。



记所有 $(i,j),(k,l)$ 的协方差，总共有 $O(d^3)$ 个非独立对，且每个协方差为 $O(1/m)$，故有：

$\text{Var}(X) = O\left(\frac{d^3}{m}\right).$

根据切比雪夫不等式：$\mathbb{P}(X = 0) \le \frac{\text{Var}(X)}{(\mathbb{E}[X])^2} = O\left(\frac{m}{d}\right) \to 0$

$\therefore$ 当 $m = o(d^2)$ 时，以高概率存在一对 $(i,j)$ 满足事件 $\mathcal{E}_{i,j}$，从而存在向量 $x = e_i - e_j$ 使得：$\|A x\|_2^2 = 2, \quad \|\prod A x\|_2^2 = 0$

违反了 OSE 条件。

综上任意列稀疏度为 1 的嵌入矩阵 $\prod$ 若想对 $A$ 的列空间实现 $(1 \pm \varepsilon)$ 子空间嵌入，必须满足：$m = \Omega(d^2).$

---

## 5



算法设计的大致思路：

将原始图 $G$ 转化为一个新图 $G'$，每个节点 $i$ 被拆分成一个“输入节点”  $i_{\text{in}}$  和一个“输出节点”  $i_{\text{out}}$ ，并在它们之间添加一条边，容量为 $c_i$，原始图中的边则在 $G'$ 中被转化为连接输出节点到输入节点的边。

首先对基本的框架进行构建

有向图 $G = (V, E)$， $V$ 是节点集，$E$ 是边集；源点 $s \in V$，汇点 $t \in V$；每个节点 $i \in V$ 的容量 $c_i > 0$.

具体的步骤：

1. 对于每个节点 $i \in V$，在 $G'$ 中创建两个新节点：$i_{\text{in}}$ 和 $i_{\text{out}}$ ，添加一条从 $i_{\text{in}}$ 到 $i_{\text{out}}$ 的有向边，容量为 $c_i$；对于原始图中的每条边 $(u, v) \in E$， 在 $G'$ 中，添加一条从 $u_{\text{out}}$ 到 $v_{\text{in}}$ 的有向边，容量设置为一个足够大的数，代表原始边的无穷大容量。

    设 $G' = (V', E')$ 那么 $G'$ 的源点为 $s_{\text{in}}$  汇点为 $t_{\text{out}}$， 而且新的图节点数为 $2 \times |V|$， 边的数量为 $|V| + |E|$

2. 在 $G'$ 上计算从  $s_{\text{in}}$  到  $t_{\text{out}}$  的最大流  $f_{\text{max}}$ 以及 $G'$ 中各条边上的流值

3. 对于原始图中的每条边 $(u, v) \in E$，其流值等于 $G'$ 中边 $(u_{\text{out}}, v_{\text{in}})$ 的流值，最大流值即为 $G'$ 中的最大流值 $f_{\text{max}}$，节点 $i$ 的总流等于 $G'$ 中边 $(i_{\text{in}}, i_{\text{out}})$ 的流值。

对于 $G'$  图的最大流计算 ，我看了Edmonds-Karp  最大流算法，使用 BFS 来寻找增广路径，这里简单概述计算过程：

​	3.1 初始化 $\forall (u,v) \in E'$ ， $f(u,v) = 0$，构建残余网络 $G_f$，

​		 $c_f(u, v) = c(u,v) - f(u,v)$

​	3.2 通过广度优先搜索 在残余网络 $G_f$  中寻找从源点 $s$ 到 汇点 $t$ 的边数最少的路径

​	3.3 找到增广路径上的最小残余容量$ c_f(p)=\min {c_f(u,v)∣(u,v) \in p}$.

​	3.4 沿路径 $ p $ 推送流量 $ c_f(p) $   更新正向边流量：$ f(u, v) \leftarrow (f(u, v) + c_f(p)) $  ；

​		更新反向边流量：$ f(v, u) \leftarrow (f(v, u) - c_f(p)) $  ；		

​		调整残余容量：$ c_f(u, v) \leftarrow (c_f(u, v) - c_f(p)) $

​	3.5 重复步骤2-4，直到无法找到新的增广路径

复杂性分析：图的大小为 $O(|V| + |E|)$，Edmonds-Karp  算法，   $O(|V'| |E'|^2)$

正确性

转换的两个图之间的可行流是可以相互转换的

1. 原图可行流  $ \Rightarrow G' $  可行流：

    对节点$ i$，流入总量   $f^{in}_i $ 作为  $ i_{in}\rightarrow i_{out} $  的流量

    由节点容量约束保证   $f^{in}_i \leq c_i$

    原边流量直接映射到 $G' $的跨节点边

2. $G' $可行流   $\Rightarrow $  原图可行流：

    $i_{in}\rightarrow i_{out}$的流量限制保证了节点流量 $\leq c_i$

    流保持：$\displaystyle\sum_{u\in V} f(u_{out},i_{in}) = f(i_{in},i_{out}) = \sum_{v\in V} f(i_{out},v_{in})$


最大流值对应关系：$f_{max}(G) = f_{max}(G') = \displaystyle\sum_{v\in V} f(s_{out},v_{in})$

------

## 6

问题的算法建模

某工厂需要采购 K 种零件$j \in [K]$，每种零件 j 的日需求量为$ d_j$。有 m 家供应商$i \in [m]$，第 i 家供应商提供零件 j 的单位价格为 $a_{ij}$，且最多供应 $c_{ij}$ 个零件 j。目标最小化总采购成本的问题。



算法的设计思路

1. 因为不同的零件之间是没有相互影响的，所以问题就拆解为 k 个 完全独立的单个零件采购的问题，最终进行求和就可以了
2. 这里先设定零件为 $j$ ，维护一个供应数 $c_{ij} > 0$ 的新的集合 $nums_{ij}$ ,现在的 $i \in [1, n]$, 表示为有 n 家供应商能提供 零件 $j$ ,对应的数量为 $nums_{ij}$ ， 价格对应设计为 $cost_{ij}$ 吧 (新的两个数组能够根据原本的数组选择而来，当然也可以用原本的数组，只是就要排除提供数量为0 的情况)
3. 现在就到了经典背包贪心处理问题，这里提供部分代码实现

```c++
int min_cost(vector<int>& nums, vector<int>& cost, int demand) {
    // 将供应商按单位价格从小到大排序（同时关联供应量）
    vector<pair<int, int>> suppliers; 
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        if (nums[i] > 0) {
            suppliers.emplace_back(cost[i], nums[i]);
        }
    }
    sort(suppliers.begin(), suppliers.end());

    int total_cost = 0;
    int remaining = demand;
    for (const auto& [price, capacity] : suppliers) {
        if (remaining <= 0) break;
        int take = min(remaining, capacity);
        total_cost += take * price;
        remaining -= take;
    }

    return (remaining > 0) ? -1 : total_cost; // -1表示无法满足需求
}

```

因为不同的零件对应不同的 $nums$ 和 $cost$ 数组，但是计算的方式都是一样的进行累加就可以了。

---

## 7



设 $G = (L, R, E)$ 是一个二分图，其中 $L, R$ 为左右顶点集合，$E \subseteq L \times R$ 是边的集合。

1. 

引入变量 $x_e \in \{0,1\}$ 表示是否选择边 $e \in E$ 进入匹配。

最大匹配要求任何一个顶点最多被一条匹配边覆盖。

整数规划形式：

$\begin{aligned}
\text{maximize} \quad & \sum_{e \in E} x_e \\
\text{subject to} \quad & \sum_{e \ni v} x_e \le 1, \quad \forall v \in L \cup R \\
& x_e \in \{0, 1\}, \quad \forall e \in E
\end{aligned}$

对应的线性规划松弛（LP）：

$\begin{aligned}
\text{maximize} \quad & \sum_{e \in E} x_e \\
\text{subject to} \quad & \sum_{e \ni v} x_e \le 1, \quad \forall v \in L \cup R \\
& 0 \le x_e \le 1, \quad \forall e \in E
\end{aligned}$

2. 

顶点覆盖要求：选出一个顶点集合 $C \subseteq L \cup R$，使得图中每条边 $e=(u,v)$ 至少有一个端点在 $C$ 中。

定义变量 $y_v \in [0,1]$ 表示是否选择顶点 $v \in L \cup R$ 进入顶点覆盖。

线性规划形式：

$\begin{aligned}
\text{minimize} \quad & \sum_{v \in L \cup R} y_v \\
\text{subject to} \quad & y_u + y_v \ge 1, \quad \forall (u,v) \in E \\
& 0 \le y_v \le 1, \quad \forall v \in L \cup R
\end{aligned}$

3. 

已经得到了两个线性规划：Primal（最大匹配的 LP）、Dual（最小顶点覆盖的 LP）。

互为对偶问题。根据线性规划对偶性理论，有：

若 Primal 和 Dual 都有最优解，则最优值相等、Primal 有整系数、有限边界，满足强对偶定理条件。

因此：最大匹配 LP 的最优值 = 最小顶点覆盖 LP 的最优值

4. 

对于二分图

最大匹配问题在二分图中可以用 多项式时间 算法解决，如匈牙利算法，Hopcroft-Karp 算法；

根据 König 定理，最大匹配数 = 最小顶点覆盖数；

可以通过构造最大匹配，反向推出 一个最小顶点覆盖

即二分图中的最小顶点覆盖问题也可以在多项式时间内求解。

---

## 8 



令 $x_i \in \{0, 1\}$ 表示是否选择第 $i$ 个物品，价值为 $v_i$，重量为 $w_i$，背包容量为 $C$。

整数规划形式为：

$\text{maximize} \quad \displaystyle\sum_{i=1}^n v_i x_i$

$\text{subject to} \quad \displaystyle\sum_{i=1}^n w_i x_i \le C, \quad x_i \in \{0,1\}$

将 $x_i \in \{0, 1\}$ 放松为 $x_i \in [0, 1]$ 得到线性规划松弛：

$\text{maximize} \quad \displaystyle\sum_{i=1}^n v_i x_i$

$\text{subject to} \quad \displaystyle\sum_{i=1}^n w_i x_i \le C, \quad x_i \in [0,1]$

记该松弛问题最优值为 $\text{OPT}_{LP}$，原始整数问题最优值为 $\text{OPT}_{IP}$，则有：

$\text{OPT}_{LP} \ge \text{OPT}_{IP}$

设 $x^* = (x_1^*, \dots, x_n^*)$ 为 LP 的最优解：

令 $S_1 = \{i \mid x_i^* = 1\}$ 表示所有被完全选中的物品，定义 $V_A = \sum_{i \in S_1} v_i$

令 $S_f = \{i \mid 0 < x_i^* < 1\}$ 表示所有部分选中的物品，令 $k = \displaystyle\arg\max_{i \in S_f} v_i$，则 $V_B = v_k$

定义算法输出解为 $\text{ALG} = \max \{V_A, V_B\}$

为确保可行性，预处理时移除所有 $w_i > C$ 的物品，保证 $V_B$ 可单独放入背包。

LP 最优解的目标值可写为：

$\text{OPT}_{LP} = \displaystyle\sum_{i \in S_1} v_i + \displaystyle\sum_{i \in S_f} v_i x_i^* = V_A + \displaystyle\sum_{i \in S_f} v_i x_i^*$

由于 $x_i^* \in (0,1)$ 且 $v_i \le v_k = \displaystyle\max_{i \in S_f} v_i$，有：

$\displaystyle\sum_{i \in S_f} v_i x_i^* \le v_k$

所以：

$\text{OPT}_{LP} \le V_A + v_k$

又因为 $\text{OPT}_{IP} \le \text{OPT}_{LP}$，则：

$\text{OPT}_{IP} \le V_A + v_k \le 2 \cdot \max\{V_A, v_k\} = 2 \cdot \text{ALG}$

即  $\text{ALG} \ge \frac{1}{2} \cdot \text{OPT}_{IP}$，近似比为 $2$



