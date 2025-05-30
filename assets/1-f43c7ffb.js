const n=`
# Hi

这是一篇示例文章，用来测试文章系统是否正常工作。

## Markdown 特性

### 4. \`calculateLoss(self, gamma)\`

1. 计算折扣回报：
   - 逆序遍历 \`rewards\`，按公式计算累积折扣回报：
   - $G_t = r_t + \\gamma \\cdot G_{t+1}$
   - 结果存入 \`discounted_rewards\`。
2. 回报标准化：
   - 减去均值，除以标准差稳定训练。
3. 优势函数计算：
   - $\\text{advantages} = \\text{discounted\\_rewards} - \\text{state\\_values}.detach()$
        （\`detach()\` 阻止梯度流向 Critic，仅用于评估策略）。

4. 损失计算：
    - 策略损失（Actor）：
        $\\mathbb{E}[\\log \\pi(a|s) \\cdot \\text{advantages}]$

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
`;export{n as default};
