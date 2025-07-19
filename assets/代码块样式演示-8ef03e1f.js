const n=`---
date: 2025-01-18
updated: 2025-01-18
category: 演示
summary: 展示美化后的代码块样式效果
---

# 代码块样式演示

这篇文章展示了博客中美化后的代码块样式，包括多种编程语言的语法高亮效果。

## JavaScript 代码示例

\`\`\`javascript
// JavaScript 函数示例
function calculateFibonacci(n) {
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    
    return b;
}

// 使用箭头函数和解构赋值
const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 35 }
];

const getAdultUsers = (users) => {
    return users
        .filter(user => user.age >= 18)
        .map(({ name, age }) => ({ name, age, status: 'adult' }));
};

console.log(getAdultUsers(users));
\`\`\`

## Python 代码示例

\`\`\`python
# Python 类和装饰器示例
import functools
from typing import List, Optional

class DataProcessor:
    def __init__(self, data: List[int]):
        self.data = data
        self._cache = {}
    
    @functools.lru_cache(maxsize=128)
    def calculate_statistics(self) -> dict:
        """计算数据统计信息"""
        if not self.data:
            return {"mean": 0, "median": 0, "std": 0}
        
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
            "mean": round(mean, 2),
            "median": median,
            "std": round(std, 2)
        }

# 使用示例
processor = DataProcessor([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
stats = processor.calculate_statistics()
print(f"统计结果: {stats}")
\`\`\`

## C# 代码示例

\`\`\`csharp
// C# LINQ 和异步编程示例
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class UserService
{
    private readonly List<User> _users;
    
    public UserService()
    {
        _users = new List<User>();
    }
    
    // 异步方法示例
    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        await Task.Delay(100); // 模拟异步操作
        
        return _users
            .Where(u => u.IsActive && u.LastLoginDate > DateTime.Now.AddDays(-30))
            .OrderByDescending(u => u.LastLoginDate)
            .Select(u => new User
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                IsActive = u.IsActive
            });
    }
    
    // 泛型方法示例
    public T ProcessData<T>(T data, Func<T, T> processor) where T : class
    {
        if (data == null)
            throw new ArgumentNullException(nameof(data));
            
        return processor(data);
    }
}

public record User(int Id, string Name, string Email, bool IsActive, DateTime LastLoginDate);
\`\`\`

## Java 代码示例

\`\`\`java
// Java Stream API 和函数式编程示例
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

public class OrderProcessor {
    private final List<Order> orders;
    
    public OrderProcessor(List<Order> orders) {
        this.orders = new ArrayList<>(orders);
    }
    
    // 使用 Stream API 处理订单
    public Map<String, Double> calculateRevenueByCategory() {
        return orders.stream()
            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
            .flatMap(order -> order.getItems().stream())
            .collect(Collectors.groupingBy(
                OrderItem::getCategory,
                Collectors.summingDouble(item -> 
                    item.getPrice() * item.getQuantity())
            ));
    }
    
    // 函数式接口示例
    public Optional<Order> findOrderBy(Predicate<Order> condition) {
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
\`\`\`

## SQL 查询示例

\`\`\`sql
-- 复杂 SQL 查询示例
WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        category,
        SUM(amount) as total_sales,
        COUNT(*) as order_count,
        AVG(amount) as avg_order_value
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE order_date >= '2024-01-01'
        AND status = 'completed'
    GROUP BY DATE_TRUNC('month', order_date), category
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
WHERE rank <= 5
ORDER BY month DESC, rank ASC;
\`\`\`

## Bash 脚本示例

\`\`\`bash
#!/bin/bash

# 自动化部署脚本示例
set -euo pipefail

# 配置变量
PROJECT_NAME="my-blog"
BUILD_DIR="dist"
DEPLOY_SERVER="user@server.com"
DEPLOY_PATH="/var/www/html"

# 颜色输出函数
print_info() {
    echo -e "\\033[1;34m[INFO]\\033[0m $1"
}

print_success() {
    echo -e "\\033[1;32m[SUCCESS]\\033[0m $1"
}

print_error() {
    echo -e "\\033[1;31m[ERROR]\\033[0m $1"
}

# 检查依赖
check_dependencies() {
    local deps=("node" "npm" "rsync" "ssh")
    
    for dep in "\${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            print_error "依赖 $dep 未安装"
            exit 1
        fi
    done
    
    print_success "所有依赖检查通过"
}

# 构建项目
build_project() {
    print_info "开始构建项目..."
    
    npm ci
    npm run build
    
    if [[ ! -d "$BUILD_DIR" ]]; then
        print_error "构建失败，未找到 $BUILD_DIR 目录"
        exit 1
    fi
    
    print_success "项目构建完成"
}

# 部署到服务器
deploy_to_server() {
    print_info "开始部署到服务器..."
    
    rsync -avz --delete \\
        --exclude='.git' \\
        --exclude='node_modules' \\
        "$BUILD_DIR/" \\
        "$DEPLOY_SERVER:$DEPLOY_PATH/"
    
    print_success "部署完成"
}

# 主函数
main() {
    print_info "开始部署 $PROJECT_NAME"
    
    check_dependencies
    build_project
    deploy_to_server
    
    print_success "部署流程完成！"
}

# 执行主函数
main "$@"
\`\`\`

## 特殊效果展示

### 行内代码
这是一个行内代码示例：\`const result = calculateSum(a, b);\`，它会有特殊的背景色和字体。

### 数学公式与代码结合
在算法实现中，我们经常需要将数学公式转换为代码：

\`\`\`python

def merge_sort(arr):
    
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

空间复杂度：$O(n)$

## 总结

这些美化后的代码块具有以下特点：

1. **🎨 美观的视觉效果**：圆角边框、阴影效果、悬停动画
2. **🌈 丰富的语法高亮**：支持多种编程语言的精确语法着色
3. **📱 响应式设计**：在不同设备上都有良好的显示效果
4. **🔧 实用功能**：一键复制、行号显示、语言标识
5. **🌙 主题适配**：完美支持明暗主题切换
6. **♿ 无障碍访问**：支持键盘导航和高对比度模式

希望这些美化效果能够提升您的代码阅读体验！
`;export{n as default};
