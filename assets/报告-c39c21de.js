const n=`------

## REINFORCE 算法实现报告

### 选题意义

| 内容项       | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 项目背景 | 随着深度学习的发展，强化学习（RL）已在游戏智能、自动控制、推荐系统等领域取得突破。 |
| 研究动机 | REINFORCE 是最基础的策略梯度方法之一，学习成本低，适合入门理解策略优化过程。 |
| 实用价值 | 通过该算法，能直观理解“策略网络+采样+回报评估+优化”这一通用 RL 框架，具备教学和实验价值。 |

------

### 🛠 技术细节

#### 网络结构（PolicyNet）：

\`\`\`text
self.network = torch.nn.Sequential(
    torch.nn.Linear(state_dim, hidden_dim),
    torch.nn.ReLU(),
    torch.nn.Linear(hidden_dim, hidden_dim),
    torch.nn.ReLU(),
    torch.nn.Linear(hidden_dim, action_dim)
)
\`\`\`

- 使用 两层隐藏层、ReLU 激活函数
- 输出通过 Softmax 得到动作概率分布。

#### 策略更新过程：

\`\`\`python
log_prob = torch.log(self.policy_net(state).gather(1, action))
loss = -log_prob * G_tensor[i]
loss.backward(retain_graph=True)
\`\`\`

- 使用 Monte Carlo 回报计算 reward-to-go；
- 损失函数是负的 log 概率乘以折扣奖励，符合策略梯度的基本形式。

#### 训练流程图：

\`\`\`mermaid
flowchart TD
    A[收集状态、动作、奖励] --> B[计算 reward-to-go Gt]
    B --> C[标准化 Gt]
    C --> D[逐状态计算 log_prob]
    D --> E[loss = -log_prob * Gt]
    E --> F[反向传播优化策略网络]
\`\`\`

------



\`\`\`mermaid
flowchart TD
    B["for episode in 5000"] --> C["for step in 1000"]
    C --> D["agent take_action"]
    D --> A["env, state, action, reward, done"]
    A --> E{"done?"}
    E  -- 否 --> C
    E  -- 是 --> G["agent updata"]
    G --> H{"av_reward >= 200"}
    H -- 否 --> B
    G --> n1["Untitled Node"]

\`\`\`









### 创新点

| 项目特色     | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 网络结构较深 | 相比传统一层结构，引入两层隐藏层使表达能力增强，适配复杂策略学习 |
| 代码整洁易读 | 结构清晰，便于教学展示和后续扩展，如引入 baseline、actor-critic 等 |
| 训练流程清晰 | reward-to-go + 标准化回报结合，提升学习稳定性                |
| 可扩展性强   | 可以在此基础上方便地引入 GAE、熵正则等改进方法               |

------

### 问题反思

| 问题           | 分析                                                         |
| -------------- | ------------------------------------------------------------ |
| 显存占用大     | 每步都 \`retain_graph=True\` 会导致图结构保留，训练集长或 batch 多时显存暴涨 |
| 收敛慢         | 纯策略梯度高方差，更新不稳定，learning rate 设置敏感         |
| 无 base line   | 没有 value function 或 baseline 会导致学习效率较低           |
| 不支持批训练   | 每一 episode 更新一次，不支持并行采样，效率低下              |
| 不具备泛化能力 | 训练结果高度依赖于随机采样，策略容易陷入局部最优             |

\`\`\`text
Episode 100	Average Score: -146.32
Episode 200	Average Score: -114.90
Episode 300	Average Score: -99.525
Episode 400	Average Score: -19.203
Episode 500	Average Score: 61.958
 …………
Episode 1800	Average Score: 186.97
Episode 1900	Average Score: 182.67
Episode 2000	Average Score: 171.60
Episode 2100	Average Score: 188.54
Episode 2170	Average Score: 200.12
\`\`\`







\`\`\`text
epoch = 1 --->  reward: -7.46
epoch = 2 --->  reward: 230.76
epoch = 3 --->  reward: 235.02
epoch = 4 --->  reward: 189.14
epoch = 5 --->  reward: 219.01
epoch = 6 --->  reward: 153.39
epoch = 7 --->  reward: 272.93
epoch = 8 --->  reward: 249.66
epoch = 9 --->  reward: 54.81
epoch = 10 --->  reward: 205.40
epoch = 11 --->  reward: 6.12
epoch = 12 --->  reward: 230.40
epoch = 13 --->  reward: 248.88
epoch = 14 --->  reward: 244.75
epoch = 15 --->  reward: 283.14
epoch = 16 --->  reward: -4.69
epoch = 17 --->  reward: 141.05
epoch = 18 --->  reward: 241.56
epoch = 19 --->  reward: 272.23
epoch = 20 --->  reward: 237.42
epoch = 21 --->  reward: 251.93
epoch = 22 --->  reward: 251.34
epoch = 23 --->  reward: 249.70
epoch = 24 --->  reward: 281.36
epoch = 25 --->  reward: 217.68
epoch = 26 --->  reward: 259.00
epoch = 27 --->  reward: 262.94
epoch = 28 --->  reward: 242.75
epoch = 29 --->  reward: 281.92
epoch = 30 --->  reward: 237.16
epoch = 31 --->  reward: 204.92
epoch = 32 --->  reward: 247.11
epoch = 33 --->  reward: 197.90
epoch = 34 --->  reward: 278.52
epoch = 35 --->  reward: 274.76
epoch = 36 --->  reward: 126.98
epoch = 37 --->  reward: 270.55
epoch = 38 --->  reward: 272.50
epoch = 39 --->  reward: 280.41
epoch = 40 --->  reward: 181.37
epoch = 41 --->  reward: 17.20
epoch = 42 --->  reward: 261.41
epoch = 43 --->  reward: 232.13
epoch = 44 --->  reward: 226.22
epoch = 45 --->  reward: 259.87
epoch = 46 --->  reward: 224.74
epoch = 47 --->  reward: 272.55
epoch = 48 --->  reward: 269.76
epoch = 49 --->  reward: 224.96
epoch = 50 --->  reward: 226.60
epoch = 51 --->  reward: 261.46
epoch = 52 --->  reward: 259.08
epoch = 53 --->  reward: 286.08
epoch = 54 --->  reward: 234.99
epoch = 55 --->  reward: 29.77
epoch = 56 --->  reward: 278.37
epoch = 57 --->  reward: 228.79
epoch = 58 --->  reward: 26.79
epoch = 59 --->  reward: 240.21
epoch = 60 --->  reward: -13.87
epoch = 61 --->  reward: 272.62
epoch = 62 --->  reward: 257.74
epoch = 63 --->  reward: -49.93
epoch = 64 --->  reward: 264.38
epoch = 65 --->  reward: 296.17
epoch = 66 --->  reward: 261.53
epoch = 67 --->  reward: -11.95
epoch = 68 --->  reward: 248.83
epoch = 69 --->  reward: 301.57
epoch = 70 --->  reward: 241.39
epoch = 71 --->  reward: 245.54
epoch = 72 --->  reward: 245.15
epoch = 73 --->  reward: 276.73
epoch = 74 --->  reward: 232.26
epoch = 75 --->  reward: 240.04
epoch = 76 --->  reward: 222.23
epoch = 77 --->  reward: 237.17
epoch = 78 --->  reward: 259.85
epoch = 79 --->  reward: -34.41
epoch = 80 --->  reward: 30.59
epoch = 81 --->  reward: 17.30
epoch = 82 --->  reward: 208.32
epoch = 83 --->  reward: 14.22
epoch = 84 --->  reward: 320.08
epoch = 85 --->  reward: 240.21
epoch = 86 --->  reward: -20.13
epoch = 87 --->  reward: 186.43
epoch = 88 --->  reward: 261.44
epoch = 89 --->  reward: 259.87
epoch = 90 --->  reward: 16.64
epoch = 91 --->  reward: 277.03
epoch = 92 --->  reward: 260.86
epoch = 93 --->  reward: 44.96
epoch = 94 --->  reward: 274.66
epoch = 95 --->  reward: 270.30
epoch = 96 --->  reward: 235.32
epoch = 97 --->  reward: 228.23
epoch = 98 --->  reward: 293.38
epoch = 99 --->  reward: 286.10
epoch = 100 --->  reward: 232.23



+-------------------+--------+
|      Metric       | Value  |
+-------------------+--------+
|  Average Reward   | 205.66 |
|   Success Rate    | 76.00% |
| Convergence Speed |  2070  |
|    Reward Std     | 95.69  |
+-------------------+--------+
\`\`\`









------

### 一、参数说明

\`\`\`python
def update(self, transition_dict):
\`\`\`

- \`transition_dict\` 是一个包含以下键的字典：
    - \`'rewards'\`：智能体在每一步获得的即时奖励 \`r_t\`
    - \`'states'\`：每一步对应的状态 \`s_t\`
    - \`'actions'\`：每一步智能体选择的动作 \`a_t\`

这些是一次完整回合（episode）的轨迹数据。

------

### 二、计算 reward-to-go（回报）

\`\`\`python
G_list = []

for i in range(len(rewards)):
    
    G = 0
    discount = 1
    for j in range(i, len(rewards)):
        G += discount * rewards[j]
        discount *= self.gamma
    G_list.append(G)
\`\`\`

这部分是计算每个时间步的 累积回报（Reward-to-Go）：

- $G_t = r_t + γ·r_{t+1} + γ²·r_{t+2} + ...$
- 
- G_list[i] 存的是从第 \`i\` 步开始累加到终点的折扣回报。



这一步的作用是为每个动作赋予一个“价值”，用来衡量其“好坏”。

------

### 三、奖励标准化（稳定训练）

\`\`\`python
G_tensor = torch.tensor(G_list, dtype=torch.float).to(self.device)
G_tensor = (G_tensor - G_tensor.mean()) / (G_tensor.std() + 1e-8)
\`\`\`

将 \`G_list\` 转为 tensor，并做了标准化处理（均值为 0，标准差为 1）：



- 目的：避免因为奖励值范围大、变化剧烈，导致网络更新不稳定。
- 1e-8 是为了防止除以 0。

------

### 四、计算策略损失并反向传播

\`\`\`python
for i in range(len(states)):
    
    state = torch.tensor([states[i]], dtype=torch.float).to(self.device)
    action = torch.tensor([actions[i]]).view(-1, 1).to(self.device)
    log_prob = torch.log(self.policy_net(state).gather(1, action))
    loss = -log_prob * G_tensor[i]
\`\`\`

- 对每一个状态：
    - 计算当前策略对 \`action[i]\` 的概率
    - 取对数概率 \`log_prob\`
    - 损失函数：\`-log_prob * G_tensor[i]\`

> \`∇J(θ) ≈ ∇ log π_θ(a|s) * G_t\`









------

##  A2C强化学习模型实现报告

### 选题意义

| 内容项       | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 项目背景 | 在策略梯度方法中，REINFORCE 存在高方差问题，难以稳定学习。Actor-Critic 方法通过引入“值函数”显著降低方差。 |
| 研究动机 | 采用 A2C 方法，可以结合策略网络和价值估计器，提升训练效率与稳定性，是通往 PPO、TD3 等主流算法的基础。 |
| 实用价值 | 适用于教学实验、控制类任务、OpenAI Gym 训练任务，如 CartPole、LunarLander 等。 |
| 课程关联 | 对应机器学习课程中的策略优化部分，是理解深度强化学习主流范式（Policy Gradient + Baseline）的重要案例。 |

------

### 技术细节

#### 模型结构（ACnet）：

\`\`\`python
# 状态 -> 特征
self.affine = nn.Linear(state_dim, hidden_dim)
# 特征 -> 策略概率
self.action_layer = nn.Linear(hidden_dim, action_dim)
# 特征 -> 状态值估计
self.value_layer = nn.Linear(hidden_dim, 1)
\`\`\`

- 使用共享特征层（\`affine\`），分别输出动作概率和状态值；
- softmax 用于生成 \`Categorical\` 分布实现动作采样。

#### 损失函数计算：

\`\`\`python
advantages = discounted_rewards - state_values.detach()
policy_loss = -(logprobs * advantages).mean()
value_loss = F.smooth_l1_loss(state_values, discounted_rewards)
\`\`\`

- \`advantages\` 是回报减去 value baseline；
- 策略损失基于 Advantage，值函数使用 Huber Loss（更稳）；
- 最终损失为 \`policy_loss + 0.5 * value_loss\`。

#### 更新逻辑（训练）：

\`\`\`python
if episode % 20 == 0:
    loss = self.actor_critic.calculateLoss(self.gamma)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(...)  # 梯度裁剪
\`\`\`

- 每 20 个 episode 更新一次（较保守）；
- 使用梯度裁剪避免爆炸；
- 使用 \`orthogonal_\` 初始化提升学习表现。

------

### 创新点

| 项目亮点               | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Advantage 用于策略更新 | 相比 REINFORCE 直接乘 Gt，这里用了 \`A = G - V\`，方差显著下降，训练更稳 |
| 共享特征提取层         | 减少冗余计算，结构紧凑                                       |
| 梯度裁剪与初始化       | 使用梯度裁剪 + 正交初始化，能有效防止 early divergence       |
| 模块化结构清晰         | ACnet + ActorCritic 分层明确，后续可扩展为 PPO、GAE 等复杂结构 |

------

### 问题反思

| 问题           | 分析                                                         |
| -------------- | ------------------------------------------------------------ |
| 更新频率过低   | 每 20 个 episode 才更新一次，可能导致学习效率低下（可调小为每 5 或 10） |
| GPU 利用率低   | 无并行环境采样，不能发挥 GPU 并行优势                        |
| 动作空间受限   | 只适用于离散动作（\`Categorical\`），若环境为连续动作需改为 \`Normal\` 分布 |
| 无熵正则       | 没有鼓励探索项（如 \`entropy bonus\`），容易陷入确定性策略     |
| 优化器参数固定 | \`lr=0.02\` 偏大，可能不适用于复杂环境（建议支持外部传参）     |



- GAE（广义优势估计）
- 多线程/异步更新（A3C）
- 动作熵正则项
- 动态学习率调整



\`\`\`text
Episode 100	Average Score: -182.44	
Episode 200	Average Score: -45.25	
Episode 300	Average Score: 91.90	
Episode 400	Average Score: 73.00	
Episode 500	Average Score: 138.67	
Episode 600	Average Score: 149.06	
Episode 700	Average Score: 160.24	
Episode 800	Average Score: 183.50	
Episode 900	Average Score: 184.82	
Episode 1000	Average Score: 152.13	
Episode 1100	Average Score: 224.76	

Environment solved in 1000 episodes!
\`\`\`







\`\`\`text
epoch = 1 --->  reward: 246.66
epoch = 2 --->  reward: 17.74
epoch = 3 --->  reward: 191.91
epoch = 4 --->  reward: 271.08
epoch = 5 --->  reward: 305.89
epoch = 6 --->  reward: 206.65
epoch = 7 --->  reward: 259.00
epoch = 8 --->  reward: 264.70
epoch = 9 --->  reward: 172.43
epoch = 10 --->  reward: 259.59
epoch = 11 --->  reward: 201.08
epoch = 12 --->  reward: 243.69
epoch = 13 --->  reward: -0.12
epoch = 14 --->  reward: 199.81
epoch = 15 --->  reward: 36.01
epoch = 16 --->  reward: 246.89
epoch = 17 --->  reward: 230.58
epoch = 18 --->  reward: -20.30
epoch = 19 --->  reward: 209.98
epoch = 20 --->  reward: 252.83
epoch = 21 --->  reward: 129.04
epoch = 22 --->  reward: 264.21
epoch = 23 --->  reward: 241.42
epoch = 24 --->  reward: 306.58
epoch = 25 --->  reward: 278.17
epoch = 26 --->  reward: 17.92
epoch = 27 --->  reward: 210.00
epoch = 28 --->  reward: 273.66
epoch = 29 --->  reward: 253.30
epoch = 30 --->  reward: 262.71
epoch = 31 --->  reward: -47.90
epoch = 32 --->  reward: 26.72
epoch = 33 --->  reward: 242.17
epoch = 34 --->  reward: 191.67
epoch = 35 --->  reward: 192.02
epoch = 36 --->  reward: 263.20
epoch = 37 --->  reward: 253.00
epoch = 38 --->  reward: 38.76
epoch = 39 --->  reward: 222.76
epoch = 40 --->  reward: 246.02
epoch = 41 --->  reward: 251.06
epoch = 42 --->  reward: 190.10
epoch = 43 --->  reward: 257.36
epoch = 44 --->  reward: 271.18
epoch = 45 --->  reward: 181.01
epoch = 46 --->  reward: 233.50
epoch = 47 --->  reward: 262.74
epoch = 48 --->  reward: 138.02
epoch = 49 --->  reward: 225.49
epoch = 50 --->  reward: 28.23
epoch = 51 --->  reward: 268.10
epoch = 52 --->  reward: 199.24
epoch = 53 --->  reward: 199.27
epoch = 54 --->  reward: 205.86
epoch = 55 --->  reward: 256.46
epoch = 56 --->  reward: 221.23
epoch = 57 --->  reward: 248.23
epoch = 58 --->  reward: 273.67
epoch = 59 --->  reward: 290.61
epoch = 60 --->  reward: 203.94
epoch = 61 --->  reward: 240.32
epoch = 62 --->  reward: 225.91
epoch = 63 --->  reward: 166.63
epoch = 64 --->  reward: 266.55
epoch = 65 --->  reward: 264.40
epoch = 66 --->  reward: 250.21
epoch = 67 --->  reward: 245.96
epoch = 68 --->  reward: 250.84
epoch = 69 --->  reward: 255.69
epoch = 70 --->  reward: 302.20
epoch = 71 --->  reward: 160.22
epoch = 72 --->  reward: 290.81
epoch = 73 --->  reward: 191.10
epoch = 74 --->  reward: 275.69
epoch = 75 --->  reward: -1.92
epoch = 76 --->  reward: 241.92
epoch = 77 --->  reward: 218.00
epoch = 78 --->  reward: 220.85
epoch = 79 --->  reward: 232.89
epoch = 80 --->  reward: 244.90
epoch = 81 --->  reward: 279.01
epoch = 82 --->  reward: -6.69
epoch = 83 --->  reward: 251.86
epoch = 84 --->  reward: 190.44
epoch = 85 --->  reward: 236.91
epoch = 86 --->  reward: 175.14
epoch = 87 --->  reward: 236.48
epoch = 88 --->  reward: 255.99
epoch = 89 --->  reward: 127.52
epoch = 90 --->  reward: 268.69
epoch = 91 --->  reward: 187.20
epoch = 92 --->  reward: 280.32
epoch = 93 --->  reward: 260.04
epoch = 94 --->  reward: 237.37
epoch = 95 --->  reward: 266.44
epoch = 96 --->  reward: 270.32
epoch = 97 --->  reward: 132.23
epoch = 98 --->  reward: 250.84
epoch = 99 --->  reward: 264.41
epoch = 100 --->  reward: -5.84


+-------------------+-------------------+
|      Metric       |       Value       |
+-------------------+-------------------+
|  Average Reward   | 207.6866597495643 |
|   Success Rate    |      69.00%       |
| Convergence Speed |       1100        |
|    Reward Std     | 83.44128774131534 |
+-------------------+-------------------+
\`\`\`





\`\`\`mermaid
flowchart TD
    A[state] --> B[共享层 state_dim --> hidden_dim]
    B --> C[Action \\nSoftmax+Categorical]
    B --> D[Value Head\\nLinear]
    C --> F[action 取样]
    D --> E[state Value]
    
    E --> G[Store\\naction概率对数 & state_values]
    F --> G
    G --> H[计算\\n policy loss + value loss]
    H --> I[反向传播]

\`\`\`





\`\`\`mermaid
flowchart TD
	A[env]
	A --> |state| C[ACnet]
	A -->|Rewards| B[ActorCritic]

    C --> |Action| A
    B --> G[计算 loss]
    G --> H[反向传播]
    H --> I[梯度裁剪]
    I --> J[optim Step]
    J --> K[清空存储的数据]
	
\`\`\`



### 3. \`forward(self, state)\`
算法流程：
1. 输入处理：
   - 将输入 \`state\` 转换为浮点张量并移至
2. 特征提取：
   - 通过 \`affine\` 层 + ReLU 激活，得到隐藏特征 \`features\`。
3. Critic（价值头）：
   - \`value_layer\` 输出状态价值 \`state_value\`
4. Actor（动作头）：
   - \`action_layer\` 输出动作 logits → Softmax 归一化为概率 \`action_probs\`。
   - 创建分类分布 \`Categorical\`，采样动作 \`action\`。
5. 轨迹记录：
   - 存储 \`log_prob(action)\`（策略梯度需用）和 \`state_value\`（后续计算优势函数）。
6. 返回动作：
   - 返回动作的标量值（\`.item()\` 脱离子图）。

---

### 4. \`calculateLoss(self, gamma)\`
功能：计算策略损失（Actor）和价值损失（Critic）。 
算法流程：

1. 数据准备：
   - 将缓冲区中的 \`rewards\`、\`logprobs\`、\`state_values\` 转为张量。
   - \`state_values\` 去掉多余的维度（\`squeeze\`）。
2. 计算折扣回报：
   - 逆序遍历 \`rewards\`，按公式计算累积折扣回报： 
   
   
   
   - $G_t = r_t + \\gamma \\cdot G_{t+1} $
   
   
   
   - 结果存入 \`discounted_rewards\`。
3. 回报标准化：
   - 减去均值，除以标准差稳定训练。
4. 优势函数计算：
   - $\\text{advantages} = \\text{discounted\\_rewards} - \\text{state\\_values}.detach() $
     （\`detach()\` 阻止梯度流向 Critic，仅用于评估策略）。
5. 损失计算：
   - 策略损失（Actor）： 
     $ -\\mathbb{E}[\\log \\pi(a|s) \\cdot \\text{advantages}]$ 
   - 价值损失（Critic）： 
     平滑 L1 损失（Huber 损失），减少 Critic 的估值误差。
6. 总损失：
   - 返回加权和：\`policy_loss + 0.5 * value_loss\`
   
   

1. Actor-Critic 协同：
   - Actor：通过 \`logprobs\` 和优势函数更新策略，引导动作选择。
   - Critic：通过 \`state_values\` 和折扣回报的差异优化价值估计。
2. 折扣回报标准化：
   - 减少不同回合回报的尺度差异，加速收敛。
3. 优势函数分离梯度：
   - \`state_values.detach()\` 确保 Critic 的梯度不影响 Actor 的更新。
4. 正交初始化：
   - 保持前向传播中信号范数稳定，缓解梯度消失/爆炸。







| 目标内容                            | 实现情况说明                                               |
|  ----------------------------------- | ---------------------------------------------------------- |
|  实现策略梯度算法 | 使用 REINFORCE 方法，含奖励标准化与 Monte Carlo 回报估计 |
| 实现 Actor-Critic 算法              | 包含 actor-critic 联合网络，使用 critic 进行优势估计     |
|支持轨迹存储与损失计算              | 实现 log-prob、状态价值、奖励的存储与处理                |
|奖励折扣与标准化处理                |  使用 gamma=0.99 计算折扣回报并进行标准化                 |





### **2. Actor-Critic 算法（1页PPT）**  
#### **核心思想**  
联合训练策略网络（Actor）和价值网络（Critic），用Critic的 \\(V(s)\\) 减小方差。

---

#### **关键公式**  
优势函数： 

$A(s,a) = R_t - V_\\phi(s)$



联合损失： 



$\\mathcal{L} = -\\log \\pi_\\theta(a|s) \\cdot A(s,a) + 0.5 \\cdot (V_\\phi(s) - R_t)^2$



其中：  

- $\\pi_\\theta$是Actor网络，$V_\\phi$是Critic网络  
- $R_t$





\`\`\`mermaid
flowchart TD
    A[state] --> B[共享层 state_dim --> hidden_dim]
    B --> C[action \\nhidden_dim --> action_dim]
    B --> D[critic\\nhidden_dim --> 1]

\`\`\`

`;export{n as default};
