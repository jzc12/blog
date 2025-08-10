import{o as e,c as r,a as o}from"./index-c90d635e.js";const a={class:"markdown-body"},c="2025-01-18T00:00:00.000Z",d="2025-01-18T00:00:00.000Z",m="演示",p="展示美化后的代码块样式效果",g={__name:"代码块样式演示",setup(s,{expose:t}){return t({frontmatter:{date:"2025-01-18T00:00:00.000Z",updated:"2025-01-18T00:00:00.000Z",category:"演示",summary:"展示美化后的代码块样式效果"}}),(i,n)=>(e(),r("div",a,n[0]||(n[0]=[o(`<h1>代码块样式演示</h1><p>这篇文章展示了博客中美化后的代码块样式，包括多种编程语言的语法高亮效果。</p><h2>JavaScript 代码示例</h2><pre><code class="language-javascript">// JavaScript 函数示例
function calculateFibonacci(n) {
    if (n &lt;= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i &lt;= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    
    return b;
}

// 使用箭头函数和解构赋值
const users = [
    { name: &#39;Alice&#39;, age: 25 },
    { name: &#39;Bob&#39;, age: 30 },
    { name: &#39;Charlie&#39;, age: 35 }
];

const getAdultUsers = (users) =&gt; {
    return users
        .filter(user =&gt; user.age &gt;= 18)
        .map(({ name, age }) =&gt; ({ name, age, status: &#39;adult&#39; }));
};

console.log(getAdultUsers(users));
</code></pre><h2>Python 代码示例</h2><pre><code class="language-python"># Python 类和装饰器示例
import functools
from typing import List, Optional

class DataProcessor:
    def __init__(self, data: List[int]):
        self.data = data
        self._cache = {}
    
    @functools.lru_cache(maxsize=128)
    def calculate_statistics(self) -&gt; dict:
        &quot;&quot;&quot;计算数据统计信息&quot;&quot;&quot;
        if not self.data:
            return {&quot;mean&quot;: 0, &quot;median&quot;: 0, &quot;std&quot;: 0}
        
        mean = sum(self.data) / len(self.data)
        sorted_data = sorted(self.data)
        n = len(sorted_data)
        
        # 计算中位数
        if n % 2 == 0:
            median = (sorted_data[n//2-1] + sorted_data[n//2]) / 2
        else:
            median = sorted_data[n//2]
        
        # 计算标准差
        variance = sum((x - mean) ** 2 for x in self.data) / n
        std = variance ** 0.5
        
        return {
            &quot;mean&quot;: round(mean, 2),
            &quot;median&quot;: median,
            &quot;std&quot;: round(std, 2)
        }

# 使用示例
processor = DataProcessor([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
stats = processor.calculate_statistics()
print(f&quot;统计结果: {stats}&quot;)
</code></pre><h2>C# 代码示例</h2><pre><code class="language-csharp">// C# LINQ 和异步编程示例
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class UserService
{
    private readonly List&lt;User&gt; _users;
    
    public UserService()
    {
        _users = new List&lt;User&gt;();
    }
    
    // 异步方法示例
    public async Task&lt;IEnumerable&lt;User&gt;&gt; GetActiveUsersAsync()
    {
        await Task.Delay(100); // 模拟异步操作
        
        return _users
            .Where(u =&gt; u.IsActive &amp;&amp; u.LastLoginDate &gt; DateTime.Now.AddDays(-30))
            .OrderByDescending(u =&gt; u.LastLoginDate)
            .Select(u =&gt; new User
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                IsActive = u.IsActive
            });
    }
    
    // 泛型方法示例
    public T ProcessData&lt;T&gt;(T data, Func&lt;T, T&gt; processor) where T : class
    {
        if (data == null)
            throw new ArgumentNullException(nameof(data));
            
        return processor(data);
    }
}

public record User(int Id, string Name, string Email, bool IsActive, DateTime LastLoginDate);
</code></pre><h2>Java 代码示例</h2><pre><code class="language-java">// Java Stream API 和函数式编程示例
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

public class OrderProcessor {
    private final List&lt;Order&gt; orders;
    
    public OrderProcessor(List&lt;Order&gt; orders) {
        this.orders = new ArrayList&lt;&gt;(orders);
    }
    
    // 使用 Stream API 处理订单
    public Map&lt;String, Double&gt; calculateRevenueByCategory() {
        return orders.stream()
            .filter(order -&gt; order.getStatus() == OrderStatus.COMPLETED)
            .flatMap(order -&gt; order.getItems().stream())
            .collect(Collectors.groupingBy(
                OrderItem::getCategory,
                Collectors.summingDouble(item -&gt; 
                    item.getPrice() * item.getQuantity())
            ));
    }
    
    // 函数式接口示例
    public Optional&lt;Order&gt; findOrderBy(Predicate&lt;Order&gt; condition) {
        return orders.stream()
            .filter(condition)
            .findFirst();
    }
    
    // 记录类型 (Java 14+)
    public record OrderSummary(
        String orderId,
        double totalAmount,
        int itemCount,
        LocalDateTime orderDate
    ) {}
}

enum OrderStatus {
    PENDING, PROCESSING, COMPLETED, CANCELLED
}
</code></pre><h2>SQL 查询示例</h2><pre><code class="language-sql">-- 复杂 SQL 查询示例
WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC(&#39;month&#39;, order_date) as month,
        category,
        SUM(amount) as total_sales,
        COUNT(*) as order_count,
        AVG(amount) as avg_order_value
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE order_date &gt;= &#39;2024-01-01&#39;
        AND status = &#39;completed&#39;
    GROUP BY DATE_TRUNC(&#39;month&#39;, order_date), category
),
category_rankings AS (
    SELECT 
        month,
        category,
        total_sales,
        ROW_NUMBER() OVER (
            PARTITION BY month 
            ORDER BY total_sales DESC
        ) as rank
    FROM monthly_sales
)
SELECT 
    month,
    category,
    total_sales,
    rank,
    LAG(total_sales) OVER (
        PARTITION BY category 
        ORDER BY month
    ) as prev_month_sales,
    ROUND(
        (total_sales - LAG(total_sales) OVER (
            PARTITION BY category 
            ORDER BY month
        )) / LAG(total_sales) OVER (
            PARTITION BY category 
            ORDER BY month
        ) * 100, 2
    ) as growth_rate
FROM category_rankings
WHERE rank &lt;= 5
ORDER BY month DESC, rank ASC;
</code></pre><h2>Bash 脚本示例</h2><pre><code class="language-bash">#!/bin/bash

# 自动化部署脚本示例
set -euo pipefail

# 配置变量
PROJECT_NAME=&quot;my-blog&quot;
BUILD_DIR=&quot;dist&quot;
DEPLOY_SERVER=&quot;user@server.com&quot;
DEPLOY_PATH=&quot;/var/www/html&quot;

# 颜色输出函数
print_info() {
    echo -e &quot;\\033[1;34m[INFO]\\033[0m $1&quot;
}

print_success() {
    echo -e &quot;\\033[1;32m[SUCCESS]\\033[0m $1&quot;
}

print_error() {
    echo -e &quot;\\033[1;31m[ERROR]\\033[0m $1&quot;
}

# 检查依赖
check_dependencies() {
    local deps=(&quot;node&quot; &quot;npm&quot; &quot;rsync&quot; &quot;ssh&quot;)
    
    for dep in &quot;\${deps[@]}&quot;; do
        if ! command -v &quot;$dep&quot; &amp;&gt; /dev/null; then
            print_error &quot;依赖 $dep 未安装&quot;
            exit 1
        fi
    done
    
    print_success &quot;所有依赖检查通过&quot;
}

# 构建项目
build_project() {
    print_info &quot;开始构建项目...&quot;
    
    npm ci
    npm run build
    
    if [[ ! -d &quot;$BUILD_DIR&quot; ]]; then
        print_error &quot;构建失败，未找到 $BUILD_DIR 目录&quot;
        exit 1
    fi
    
    print_success &quot;项目构建完成&quot;
}

# 部署到服务器
deploy_to_server() {
    print_info &quot;开始部署到服务器...&quot;
    
    rsync -avz --delete \\
        --exclude=&#39;.git&#39; \\
        --exclude=&#39;node_modules&#39; \\
        &quot;$BUILD_DIR/&quot; \\
        &quot;$DEPLOY_SERVER:$DEPLOY_PATH/&quot;
    
    print_success &quot;部署完成&quot;
}

# 主函数
main() {
    print_info &quot;开始部署 $PROJECT_NAME&quot;
    
    check_dependencies
    build_project
    deploy_to_server
    
    print_success &quot;部署流程完成！&quot;
}

# 执行主函数
main &quot;$@&quot;
</code></pre><h2>特殊效果展示</h2><h3>行内代码</h3><p>这是一个行内代码示例：<code>const result = calculateSum(a, b);</code>，它会有特殊的背景色和字体。</p><h3>数学公式与代码结合</h3><p>在算法实现中，我们经常需要将数学公式转换为代码：</p><pre><code class="language-python">
def merge_sort(arr):
    
    if len(arr) &lt;= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i &lt; len(left) and j &lt; len(right):
        if left[i] &lt;= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
</code></pre><p>空间复杂度：$O(n)$</p><h2>总结</h2>`,22)])))}};export{m as category,c as date,g as default,p as summary,d as updated};
