import{o as r,c as o,a as d}from"./index-7acf7975.js";const a={class:"markdown-body"},g="报告",h="2025-06-01T00:00:00.000Z",i="2025-06-02T00:00:00.000Z",s="深度学习",w="强化学习报告",u={__name:"dl 报告",setup(n,{expose:t}){return t({frontmatter:{title:"报告",date:"2025-06-01T00:00:00.000Z",updated:"2025-06-02T00:00:00.000Z",category:"深度学习",summary:"强化学习报告"}}),(l,e)=>(r(),o("div",a,e[0]||(e[0]=[d(`<hr><hr><h2>REINFORCE 算法实现报告</h2><h3>选题意义</h3><table><thead><tr><th>内容项</th><th>说明</th></tr></thead><tbody><tr><td>项目背景</td><td>随着深度学习的发展，强化学习（RL）已在游戏智能、自动控制、推荐系统等领域取得突破。</td></tr><tr><td>研究动机</td><td>REINFORCE 是最基础的策略梯度方法之一，学习成本低，适合入门理解策略优化过程。</td></tr><tr><td>实用价值</td><td>通过该算法，能直观理解“策略网络+采样+回报评估+优化”这一通用 RL 框架，具备教学和实验价值。</td></tr></tbody></table><hr><h3>🛠 技术细节</h3><h4>网络结构（PolicyNet）：</h4><pre><code class="language-text">self.network = torch.nn.Sequential(
    torch.nn.Linear(state_dim, hidden_dim),
    torch.nn.ReLU(),
    torch.nn.Linear(hidden_dim, hidden_dim),
    torch.nn.ReLU(),
    torch.nn.Linear(hidden_dim, action_dim)
)
</code></pre><ul><li>使用 两层隐藏层、ReLU 激活函数</li><li>输出通过 Softmax 得到动作概率分布。</li></ul><h4>策略更新过程：</h4><pre><code class="language-python">log_prob = torch.log(self.policy_net(state).gather(1, action))
loss = -log_prob * G_tensor[i]
loss.backward(retain_graph=True)
</code></pre><ul><li>使用 Monte Carlo 回报计算 reward-to-go；</li><li>损失函数是负的 log 概率乘以折扣奖励，符合策略梯度的基本形式。</li></ul><h4>训练流程图：</h4><pre><code class="language-mermaid">flowchart TD
    A[收集状态、动作、奖励] --&gt; B[计算 reward-to-go Gt]
    B --&gt; C[标准化 Gt]
    C --&gt; D[逐状态计算 log_prob]
    D --&gt; E[loss = -log_prob * Gt]
    E --&gt; F[反向传播优化策略网络]
</code></pre><hr><pre><code class="language-mermaid">flowchart TD
    B[&quot;for episode in 5000&quot;] --&gt; C[&quot;for step in 1000&quot;]
    C --&gt; D[&quot;agent take_action&quot;]
    D --&gt; A[&quot;env, state, action, reward, done&quot;]
    A --&gt; E{&quot;done?&quot;}
    E  -- 否 --&gt; C
    E  -- 是 --&gt; G[&quot;agent updata&quot;]
    G --&gt; H{&quot;av_reward &gt;= 200&quot;}
    H -- 否 --&gt; B
    G --&gt; n1[&quot;Untitled Node&quot;]

</code></pre><h3>创新点</h3><table><thead><tr><th>项目特色</th><th>说明</th></tr></thead><tbody><tr><td>网络结构较深</td><td>相比传统一层结构，引入两层隐藏层使表达能力增强，适配复杂策略学习</td></tr><tr><td>代码整洁易读</td><td>结构清晰，便于教学展示和后续扩展，如引入 baseline、actor-critic 等</td></tr><tr><td>训练流程清晰</td><td>reward-to-go + 标准化回报结合，提升学习稳定性</td></tr><tr><td>可扩展性强</td><td>可以在此基础上方便地引入 GAE、熵正则等改进方法</td></tr></tbody></table><hr><h3>问题反思</h3><table><thead><tr><th>问题</th><th>分析</th></tr></thead><tbody><tr><td>显存占用大</td><td>每步都 <code>retain_graph=True</code> 会导致图结构保留，训练集长或 batch 多时显存暴涨</td></tr><tr><td>收敛慢</td><td>纯策略梯度高方差，更新不稳定，learning rate 设置敏感</td></tr><tr><td>无 base line</td><td>没有 value function 或 baseline 会导致学习效率较低</td></tr><tr><td>不支持批训练</td><td>每一 episode 更新一次，不支持并行采样，效率低下</td></tr><tr><td>不具备泛化能力</td><td>训练结果高度依赖于随机采样，策略容易陷入局部最优</td></tr></tbody></table><pre><code class="language-text">Episode 100	Average Score: -146.32
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
</code></pre><pre><code class="language-text">epoch = 1 ---&gt;  reward: -7.46
epoch = 2 ---&gt;  reward: 230.76
epoch = 3 ---&gt;  reward: 235.02
epoch = 4 ---&gt;  reward: 189.14
epoch = 5 ---&gt;  reward: 219.01
epoch = 6 ---&gt;  reward: 153.39
epoch = 7 ---&gt;  reward: 272.93
epoch = 8 ---&gt;  reward: 249.66
epoch = 9 ---&gt;  reward: 54.81
epoch = 10 ---&gt;  reward: 205.40
epoch = 11 ---&gt;  reward: 6.12
epoch = 12 ---&gt;  reward: 230.40
epoch = 13 ---&gt;  reward: 248.88
epoch = 14 ---&gt;  reward: 244.75
epoch = 15 ---&gt;  reward: 283.14
epoch = 16 ---&gt;  reward: -4.69
epoch = 17 ---&gt;  reward: 141.05
epoch = 18 ---&gt;  reward: 241.56
epoch = 19 ---&gt;  reward: 272.23
epoch = 20 ---&gt;  reward: 237.42
epoch = 21 ---&gt;  reward: 251.93
epoch = 22 ---&gt;  reward: 251.34
epoch = 23 ---&gt;  reward: 249.70
epoch = 24 ---&gt;  reward: 281.36
epoch = 25 ---&gt;  reward: 217.68
epoch = 26 ---&gt;  reward: 259.00
epoch = 27 ---&gt;  reward: 262.94
epoch = 28 ---&gt;  reward: 242.75
epoch = 29 ---&gt;  reward: 281.92
epoch = 30 ---&gt;  reward: 237.16
epoch = 31 ---&gt;  reward: 204.92
epoch = 32 ---&gt;  reward: 247.11
epoch = 33 ---&gt;  reward: 197.90
epoch = 34 ---&gt;  reward: 278.52
epoch = 35 ---&gt;  reward: 274.76
epoch = 36 ---&gt;  reward: 126.98
epoch = 37 ---&gt;  reward: 270.55
epoch = 38 ---&gt;  reward: 272.50
epoch = 39 ---&gt;  reward: 280.41
epoch = 40 ---&gt;  reward: 181.37
epoch = 41 ---&gt;  reward: 17.20
epoch = 42 ---&gt;  reward: 261.41
epoch = 43 ---&gt;  reward: 232.13
epoch = 44 ---&gt;  reward: 226.22
epoch = 45 ---&gt;  reward: 259.87
epoch = 46 ---&gt;  reward: 224.74
epoch = 47 ---&gt;  reward: 272.55
epoch = 48 ---&gt;  reward: 269.76
epoch = 49 ---&gt;  reward: 224.96
epoch = 50 ---&gt;  reward: 226.60
epoch = 51 ---&gt;  reward: 261.46
epoch = 52 ---&gt;  reward: 259.08
epoch = 53 ---&gt;  reward: 286.08
epoch = 54 ---&gt;  reward: 234.99
epoch = 55 ---&gt;  reward: 29.77
epoch = 56 ---&gt;  reward: 278.37
epoch = 57 ---&gt;  reward: 228.79
epoch = 58 ---&gt;  reward: 26.79
epoch = 59 ---&gt;  reward: 240.21
epoch = 60 ---&gt;  reward: -13.87
epoch = 61 ---&gt;  reward: 272.62
epoch = 62 ---&gt;  reward: 257.74
epoch = 63 ---&gt;  reward: -49.93
epoch = 64 ---&gt;  reward: 264.38
epoch = 65 ---&gt;  reward: 296.17
epoch = 66 ---&gt;  reward: 261.53
epoch = 67 ---&gt;  reward: -11.95
epoch = 68 ---&gt;  reward: 248.83
epoch = 69 ---&gt;  reward: 301.57
epoch = 70 ---&gt;  reward: 241.39
epoch = 71 ---&gt;  reward: 245.54
epoch = 72 ---&gt;  reward: 245.15
epoch = 73 ---&gt;  reward: 276.73
epoch = 74 ---&gt;  reward: 232.26
epoch = 75 ---&gt;  reward: 240.04
epoch = 76 ---&gt;  reward: 222.23
epoch = 77 ---&gt;  reward: 237.17
epoch = 78 ---&gt;  reward: 259.85
epoch = 79 ---&gt;  reward: -34.41
epoch = 80 ---&gt;  reward: 30.59
epoch = 81 ---&gt;  reward: 17.30
epoch = 82 ---&gt;  reward: 208.32
epoch = 83 ---&gt;  reward: 14.22
epoch = 84 ---&gt;  reward: 320.08
epoch = 85 ---&gt;  reward: 240.21
epoch = 86 ---&gt;  reward: -20.13
epoch = 87 ---&gt;  reward: 186.43
epoch = 88 ---&gt;  reward: 261.44
epoch = 89 ---&gt;  reward: 259.87
epoch = 90 ---&gt;  reward: 16.64
epoch = 91 ---&gt;  reward: 277.03
epoch = 92 ---&gt;  reward: 260.86
epoch = 93 ---&gt;  reward: 44.96
epoch = 94 ---&gt;  reward: 274.66
epoch = 95 ---&gt;  reward: 270.30
epoch = 96 ---&gt;  reward: 235.32
epoch = 97 ---&gt;  reward: 228.23
epoch = 98 ---&gt;  reward: 293.38
epoch = 99 ---&gt;  reward: 286.10
epoch = 100 ---&gt;  reward: 232.23



+-------------------+--------+
|      Metric       | Value  |
+-------------------+--------+
|  Average Reward   | 205.66 |
|   Success Rate    | 76.00% |
| Convergence Speed |  2070  |
|    Reward Std     | 95.69  |
+-------------------+--------+
</code></pre><hr><h3>一、参数说明</h3><pre><code class="language-python">def update(self, transition_dict):
</code></pre><ul><li><code>transition_dict</code> 是一个包含以下键的字典： <ul><li><code>&#39;rewards&#39;</code>：智能体在每一步获得的即时奖励 <code>r_t</code></li><li><code>&#39;states&#39;</code>：每一步对应的状态 <code>s_t</code></li><li><code>&#39;actions&#39;</code>：每一步智能体选择的动作 <code>a_t</code></li></ul></li></ul><p>这些是一次完整回合（episode）的轨迹数据。</p><hr><h3>二、计算 reward-to-go（回报）</h3><pre><code class="language-python">G_list = []

for i in range(len(rewards)):
    
    G = 0
    discount = 1
    for j in range(i, len(rewards)):
        G += discount * rewards[j]
        discount *= self.gamma
    G_list.append(G)
</code></pre><p>这部分是计算每个时间步的 累积回报（Reward-to-Go）：</p><ul><li>$G_t = r_t + γ·r_{t+1} + γ²·r_{t+2} + …$</li><li></li><li>G_list[i] 存的是从第 <code>i</code> 步开始累加到终点的折扣回报。</li></ul><p>这一步的作用是为每个动作赋予一个“价值”，用来衡量其“好坏”。</p><hr><h3>三、奖励标准化（稳定训练）</h3><pre><code class="language-python">G_tensor = torch.tensor(G_list, dtype=torch.float).to(self.device)
G_tensor = (G_tensor - G_tensor.mean()) / (G_tensor.std() + 1e-8)
</code></pre><p>将 <code>G_list</code> 转为 tensor，并做了标准化处理（均值为 0，标准差为 1）：</p><ul><li>目的：避免因为奖励值范围大、变化剧烈，导致网络更新不稳定。</li><li>1e-8 是为了防止除以 0。</li></ul><hr><h3>四、计算策略损失并反向传播</h3><pre><code class="language-python">for i in range(len(states)):
    
    state = torch.tensor([states[i]], dtype=torch.float).to(self.device)
    action = torch.tensor([actions[i]]).view(-1, 1).to(self.device)
    log_prob = torch.log(self.policy_net(state).gather(1, action))
    loss = -log_prob * G_tensor[i]
</code></pre><ul><li>对每一个状态： <ul><li>计算当前策略对 <code>action[i]</code> 的概率</li><li>取对数概率 <code>log_prob</code></li><li>损失函数：<code>-log_prob * G_tensor[i]</code></li></ul></li></ul><blockquote><p><code>∇J(θ) ≈ ∇ log π_θ(a|s) * G_t</code></p></blockquote><hr><h2>A2C强化学习模型实现报告</h2><h3>选题意义</h3><table><thead><tr><th>内容项</th><th>说明</th></tr></thead><tbody><tr><td>项目背景</td><td>在策略梯度方法中，REINFORCE 存在高方差问题，难以稳定学习。Actor-Critic 方法通过引入“值函数”显著降低方差。</td></tr><tr><td>研究动机</td><td>采用 A2C 方法，可以结合策略网络和价值估计器，提升训练效率与稳定性，是通往 PPO、TD3 等主流算法的基础。</td></tr><tr><td>实用价值</td><td>适用于教学实验、控制类任务、OpenAI Gym 训练任务，如 CartPole、LunarLander 等。</td></tr><tr><td>课程关联</td><td>对应机器学习课程中的策略优化部分，是理解深度强化学习主流范式（Policy Gradient + Baseline）的重要案例。</td></tr></tbody></table><hr><h3>技术细节</h3><h4>模型结构（ACnet）：</h4><pre><code class="language-python"># 状态 -&gt; 特征
self.affine = nn.Linear(state_dim, hidden_dim)
# 特征 -&gt; 策略概率
self.action_layer = nn.Linear(hidden_dim, action_dim)
# 特征 -&gt; 状态值估计
self.value_layer = nn.Linear(hidden_dim, 1)
</code></pre><ul><li>使用共享特征层（<code>affine</code>），分别输出动作概率和状态值；</li><li>softmax 用于生成 <code>Categorical</code> 分布实现动作采样。</li></ul><h4>损失函数计算：</h4><pre><code class="language-python">advantages = discounted_rewards - state_values.detach()
policy_loss = -(logprobs * advantages).mean()
value_loss = F.smooth_l1_loss(state_values, discounted_rewards)
</code></pre><ul><li><code>advantages</code> 是回报减去 value baseline；</li><li>策略损失基于 Advantage，值函数使用 Huber Loss（更稳）；</li><li>最终损失为 <code>policy_loss + 0.5 * value_loss</code>。</li></ul><h4>更新逻辑（训练）：</h4><pre><code class="language-python">if episode % 20 == 0:
    loss = self.actor_critic.calculateLoss(self.gamma)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(...)  # 梯度裁剪
</code></pre><ul><li>每 20 个 episode 更新一次（较保守）；</li><li>使用梯度裁剪避免爆炸；</li><li>使用 <code>orthogonal_</code> 初始化提升学习表现。</li></ul><hr><h3>创新点</h3><table><thead><tr><th>项目亮点</th><th>描述</th></tr></thead><tbody><tr><td>Advantage 用于策略更新</td><td>相比 REINFORCE 直接乘 Gt，这里用了 <code>A = G - V</code>，方差显著下降，训练更稳</td></tr><tr><td>共享特征提取层</td><td>减少冗余计算，结构紧凑</td></tr><tr><td>梯度裁剪与初始化</td><td>使用梯度裁剪 + 正交初始化，能有效防止 early divergence</td></tr><tr><td>模块化结构清晰</td><td>ACnet + ActorCritic 分层明确，后续可扩展为 PPO、GAE 等复杂结构</td></tr></tbody></table><hr><h3>问题反思</h3><table><thead><tr><th>问题</th><th>分析</th></tr></thead><tbody><tr><td>更新频率过低</td><td>每 20 个 episode 才更新一次，可能导致学习效率低下（可调小为每 5 或 10）</td></tr><tr><td>GPU 利用率低</td><td>无并行环境采样，不能发挥 GPU 并行优势</td></tr><tr><td>动作空间受限</td><td>只适用于离散动作（<code>Categorical</code>），若环境为连续动作需改为 <code>Normal</code> 分布</td></tr><tr><td>无熵正则</td><td>没有鼓励探索项（如 <code>entropy bonus</code>），容易陷入确定性策略</td></tr><tr><td>优化器参数固定</td><td><code>lr=0.02</code> 偏大，可能不适用于复杂环境（建议支持外部传参）</td></tr></tbody></table><ul><li>GAE（广义优势估计）</li><li>多线程/异步更新（A3C）</li><li>动作熵正则项</li><li>动态学习率调整</li></ul><pre><code class="language-text">Episode 100	Average Score: -182.44	
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
</code></pre><pre><code class="language-text">epoch = 1 ---&gt;  reward: 246.66
epoch = 2 ---&gt;  reward: 17.74
epoch = 3 ---&gt;  reward: 191.91
epoch = 4 ---&gt;  reward: 271.08
epoch = 5 ---&gt;  reward: 305.89
epoch = 6 ---&gt;  reward: 206.65
epoch = 7 ---&gt;  reward: 259.00
epoch = 8 ---&gt;  reward: 264.70
epoch = 9 ---&gt;  reward: 172.43
epoch = 10 ---&gt;  reward: 259.59
epoch = 11 ---&gt;  reward: 201.08
epoch = 12 ---&gt;  reward: 243.69
epoch = 13 ---&gt;  reward: -0.12
epoch = 14 ---&gt;  reward: 199.81
epoch = 15 ---&gt;  reward: 36.01
epoch = 16 ---&gt;  reward: 246.89
epoch = 17 ---&gt;  reward: 230.58
epoch = 18 ---&gt;  reward: -20.30
epoch = 19 ---&gt;  reward: 209.98
epoch = 20 ---&gt;  reward: 252.83
epoch = 21 ---&gt;  reward: 129.04
epoch = 22 ---&gt;  reward: 264.21
epoch = 23 ---&gt;  reward: 241.42
epoch = 24 ---&gt;  reward: 306.58
epoch = 25 ---&gt;  reward: 278.17
epoch = 26 ---&gt;  reward: 17.92
epoch = 27 ---&gt;  reward: 210.00
epoch = 28 ---&gt;  reward: 273.66
epoch = 29 ---&gt;  reward: 253.30
epoch = 30 ---&gt;  reward: 262.71
epoch = 31 ---&gt;  reward: -47.90
epoch = 32 ---&gt;  reward: 26.72
epoch = 33 ---&gt;  reward: 242.17
epoch = 34 ---&gt;  reward: 191.67
epoch = 35 ---&gt;  reward: 192.02
epoch = 36 ---&gt;  reward: 263.20
epoch = 37 ---&gt;  reward: 253.00
epoch = 38 ---&gt;  reward: 38.76
epoch = 39 ---&gt;  reward: 222.76
epoch = 40 ---&gt;  reward: 246.02
epoch = 41 ---&gt;  reward: 251.06
epoch = 42 ---&gt;  reward: 190.10
epoch = 43 ---&gt;  reward: 257.36
epoch = 44 ---&gt;  reward: 271.18
epoch = 45 ---&gt;  reward: 181.01
epoch = 46 ---&gt;  reward: 233.50
epoch = 47 ---&gt;  reward: 262.74
epoch = 48 ---&gt;  reward: 138.02
epoch = 49 ---&gt;  reward: 225.49
epoch = 50 ---&gt;  reward: 28.23
epoch = 51 ---&gt;  reward: 268.10
epoch = 52 ---&gt;  reward: 199.24
epoch = 53 ---&gt;  reward: 199.27
epoch = 54 ---&gt;  reward: 205.86
epoch = 55 ---&gt;  reward: 256.46
epoch = 56 ---&gt;  reward: 221.23
epoch = 57 ---&gt;  reward: 248.23
epoch = 58 ---&gt;  reward: 273.67
epoch = 59 ---&gt;  reward: 290.61
epoch = 60 ---&gt;  reward: 203.94
epoch = 61 ---&gt;  reward: 240.32
epoch = 62 ---&gt;  reward: 225.91
epoch = 63 ---&gt;  reward: 166.63
epoch = 64 ---&gt;  reward: 266.55
epoch = 65 ---&gt;  reward: 264.40
epoch = 66 ---&gt;  reward: 250.21
epoch = 67 ---&gt;  reward: 245.96
epoch = 68 ---&gt;  reward: 250.84
epoch = 69 ---&gt;  reward: 255.69
epoch = 70 ---&gt;  reward: 302.20
epoch = 71 ---&gt;  reward: 160.22
epoch = 72 ---&gt;  reward: 290.81
epoch = 73 ---&gt;  reward: 191.10
epoch = 74 ---&gt;  reward: 275.69
epoch = 75 ---&gt;  reward: -1.92
epoch = 76 ---&gt;  reward: 241.92
epoch = 77 ---&gt;  reward: 218.00
epoch = 78 ---&gt;  reward: 220.85
epoch = 79 ---&gt;  reward: 232.89
epoch = 80 ---&gt;  reward: 244.90
epoch = 81 ---&gt;  reward: 279.01
epoch = 82 ---&gt;  reward: -6.69
epoch = 83 ---&gt;  reward: 251.86
epoch = 84 ---&gt;  reward: 190.44
epoch = 85 ---&gt;  reward: 236.91
epoch = 86 ---&gt;  reward: 175.14
epoch = 87 ---&gt;  reward: 236.48
epoch = 88 ---&gt;  reward: 255.99
epoch = 89 ---&gt;  reward: 127.52
epoch = 90 ---&gt;  reward: 268.69
epoch = 91 ---&gt;  reward: 187.20
epoch = 92 ---&gt;  reward: 280.32
epoch = 93 ---&gt;  reward: 260.04
epoch = 94 ---&gt;  reward: 237.37
epoch = 95 ---&gt;  reward: 266.44
epoch = 96 ---&gt;  reward: 270.32
epoch = 97 ---&gt;  reward: 132.23
epoch = 98 ---&gt;  reward: 250.84
epoch = 99 ---&gt;  reward: 264.41
epoch = 100 ---&gt;  reward: -5.84


+-------------------+-------------------+
|      Metric       |       Value       |
+-------------------+-------------------+
|  Average Reward   | 207.6866597495643 |
|   Success Rate    |      69.00%       |
| Convergence Speed |       1100        |
|    Reward Std     | 83.44128774131534 |
+-------------------+-------------------+
</code></pre><pre><code class="language-mermaid">flowchart TD
    A[state] --&gt; B[共享层 state_dim --&gt; hidden_dim]
    B --&gt; C[Action \\nSoftmax+Categorical]
    B --&gt; D[Value Head\\nLinear]
    C --&gt; F[action 取样]
    D --&gt; E[state Value]
    
    E --&gt; G[Store\\naction概率对数 &amp; state_values]
    F --&gt; G
    G --&gt; H[计算\\n policy loss + value loss]
    H --&gt; I[反向传播]

</code></pre><pre><code class="language-mermaid">flowchart TD
	A[env]
	A --&gt; |state| C[ACnet]
	A --&gt;|Rewards| B[ActorCritic]

    C --&gt; |Action| A
    B --&gt; G[计算 loss]
    G --&gt; H[反向传播]
    H --&gt; I[梯度裁剪]
    I --&gt; J[optim Step]
    J --&gt; K[清空存储的数据]
	
</code></pre><h3>3. <code>forward(self, state)</code></h3><p>算法流程：</p><ol><li>输入处理： <ul><li>将输入 <code>state</code> 转换为浮点张量并移至</li></ul></li><li>特征提取： <ul><li>通过 <code>affine</code> 层 + ReLU 激活，得到隐藏特征 <code>features</code>。</li></ul></li><li>Critic（价值头）： <ul><li><code>value_layer</code> 输出状态价值 <code>state_value</code></li></ul></li><li>Actor（动作头）： <ul><li><code>action_layer</code> 输出动作 logits → Softmax 归一化为概率 <code>action_probs</code>。</li><li>创建分类分布 <code>Categorical</code>，采样动作 <code>action</code>。</li></ul></li><li>轨迹记录： <ul><li>存储 <code>log_prob(action)</code>（策略梯度需用）和 <code>state_value</code>（后续计算优势函数）。</li></ul></li><li>返回动作： <ul><li>返回动作的标量值（<code>.item()</code> 脱离子图）。</li></ul></li></ol><hr><h3>4. <code>calculateLoss(self, gamma)</code></h3><p>功能：计算策略损失（Actor）和价值损失（Critic）。 算法流程：</p><ol><li><p>数据准备：</p><ul><li>将缓冲区中的 <code>rewards</code>、<code>logprobs</code>、<code>state_values</code> 转为张量。</li><li><code>state_values</code> 去掉多余的维度（<code>squeeze</code>）。</li></ul></li><li><p>计算折扣回报：</p><ul><li><p>逆序遍历 <code>rewards</code>，按公式计算累积折扣回报：</p></li><li><p>$G_t = r_t + \\gamma \\cdot G_{t+1} $</p></li><li><p>结果存入 <code>discounted_rewards</code>。</p></li></ul></li><li><p>回报标准化：</p><ul><li>减去均值，除以标准差稳定训练。</li></ul></li><li><p>优势函数计算：</p><ul><li>$\\text{advantages} = \\text{discounted_rewards} - \\text{state_values}.detach() $ （<code>detach()</code> 阻止梯度流向 Critic，仅用于评估策略）。</li></ul></li><li><p>损失计算：</p><ul><li>策略损失（Actor）： $ -\\mathbb{E}[\\log \\pi(a|s) \\cdot \\text{advantages}]$</li><li>价值损失（Critic）： 平滑 L1 损失（Huber 损失），减少 Critic 的估值误差。</li></ul></li><li><p>总损失：</p><ul><li>返回加权和：<code>policy_loss + 0.5 * value_loss</code></li></ul></li><li><p>Actor-Critic 协同：</p><ul><li>Actor：通过 <code>logprobs</code> 和优势函数更新策略，引导动作选择。</li><li>Critic：通过 <code>state_values</code> 和折扣回报的差异优化价值估计。</li></ul></li><li><p>折扣回报标准化：</p><ul><li>减少不同回合回报的尺度差异，加速收敛。</li></ul></li><li><p>优势函数分离梯度：</p><ul><li><code>state_values.detach()</code> 确保 Critic 的梯度不影响 Actor 的更新。</li></ul></li><li><p>正交初始化：</p><ul><li>保持前向传播中信号范数稳定，缓解梯度消失/爆炸。</li></ul></li></ol><table><thead><tr><th>目标内容</th><th>实现情况说明</th></tr></thead><tbody><tr><td>实现策略梯度算法</td><td>使用 REINFORCE 方法，含奖励标准化与 Monte Carlo 回报估计</td></tr><tr><td>实现 Actor-Critic 算法</td><td>包含 actor-critic 联合网络，使用 critic 进行优势估计</td></tr><tr><td>支持轨迹存储与损失计算</td><td>实现 log-prob、状态价值、奖励的存储与处理</td></tr><tr><td>奖励折扣与标准化处理</td><td>使用 gamma=0.99 计算折扣回报并进行标准化</td></tr></tbody></table><h3><strong>2. Actor-Critic 算法（1页PPT）</strong></h3><h4><strong>核心思想</strong></h4><p>联合训练策略网络（Actor）和价值网络（Critic），用Critic的 (V(s)) 减小方差。</p><hr><h4><strong>关键公式</strong></h4><p>优势函数：</p><p>$A(s,a) = R_t - V_\\phi(s)$</p><p>联合损失：</p><p>$\\mathcal{L} = -\\log \\pi_\\theta(a|s) \\cdot A(s,a) + 0.5 \\cdot (V_\\phi(s) - R_t)^2$</p><p>其中：</p><ul><li>$\\pi_\\theta$是Actor网络，$V_\\phi$是Critic网络</li><li>$R_t$</li></ul><pre><code class="language-mermaid">flowchart TD
    A[state] --&gt; B[共享层 state_dim --&gt; hidden_dim]
    B --&gt; C[action \\nhidden_dim --&gt; action_dim]
    B --&gt; D[critic\\nhidden_dim --&gt; 1]

</code></pre>`,91)])))}};export{s as category,h as date,u as default,w as summary,g as title,i as updated};
