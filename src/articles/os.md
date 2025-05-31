# 摸鱼中

## 1



### 并发

#### 💡 场景：两个线程同时执行各自的任务。

```cpp
void taskA() {
    for (int i = 0; i < 5; ++i) {
        print("A");
    }
}

void taskB() {
    for (int i = 0; i < 5; ++i) {
        print("B");
    }
}

int main() {
    thread t1(taskA);
    thread t2(taskB);
    t1.join();
    t2.join();
}
```

#### 🔍 输出（可能）：

```
ABABABABAB
或 AAAAA...BBBBB...
或 BBAABBAABB
```

#### 📌 说明：

两个线程交替执行，顺序不可预测。并发执行，但可能不是同时执行。

------

### 2. 🔒 同步（Synchronous）

#### 💡 场景：主线程等待任务完成，顺序执行。

```cpp
int slow_add(int a, int b) {
    sleep(2);
    return a + b;
}

int main() {
    int result = slow_add(1, 2); // 阻塞，必须等函数返回
    print(result);               // 必须在前一步完成后执行
}
```

#### 📌 说明：

程序必须等待结果返回才能继续，任务是同步执行的。

------

### 3. 🚀 异步（Asynchronous）

#### 💡 场景：任务提交后立即返回，稍后获取结果。

```cpp
int slow_add(int a, int b) {
    sleep(2);
    return a + b;
}

int main() {
    auto future = std::async(std::launch::async, slow_add, 1, 2);  // 异步启动
    print("doing other work...");  // 不等待任务完成，继续执行其他代码
    int result = future.get();     // 等需要时再取结果
    print(result);
}
```

#### 📌 输出（可能）：

```
doing other work...
3
```

#### 📌 说明：

任务是异步执行的，主线程不中断，可以继续做别的事情。等结果时再阻塞（`future.get()`）。

------

### ✅ 总结（加一句话理解）：

| 类型 | 简介                       | 是否立即返回 | 是否阻塞   | 示例重点                     |
| ---- | -------------------------- | ------------ | ---------- | ---------------------------- |
| 并发 | 多个线程“同时”执行任务     | 是           | 否         | 多线程交错打印               |
| 同步 | 先做完一个再做下一个       | 否           | 是         | 顺序执行、阻塞等待           |
| 异步 | 提交任务后继续执行其他逻辑 | 是           | 否（初期） | 提交任务立即返回，延后取结果 |

------

