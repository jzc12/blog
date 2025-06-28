const n=`---
date: 2025-06-19
updated: 2025-06-19
category: 想法
summary: 实习随笔
---

## 1

---



第一周： 感觉很多都是在干打杂，虽然也没有期望什么，更多的是体验吧，还拿到实习证明，就OK了。

实习内容累倒是不累，但是每天通勤啊，实习第一个月没多少钱啊，一个人租房没人一起玩啊……累、不舒畅的感觉倒是来源于这些方向。

对**还有作业、论文、报告没写完**， 这就太痛苦了。



学习到的东西呢：

- 公司里的分工、交流都太细、太完善了，好难看清全局
- mentor 一直 是有dll 库， 有开源包可以用吗
- “你先写好一个小 demo 展示”
- 还行，现阶段还比较简单，对我来说能实现



具体的点

------

**WPF 架构**

> MVVM 模式
>
> - View：界面显示，绑定 ViewModel 中的数据和命令，无业务逻辑。
> - ViewModel：处理界面逻辑，暴露属性供绑定，使用 INotifyPropertyChanged 通知 UI 更新。
> - Model：业务逻辑与数据实体。

**dll 动态链接库的调用**

> - 使用 \`DllImport\` 引入非托管代码：
>
>     \`\`\`csharp
>     [DllImport("user32.dll")]
>     public static extern int MessageBox(IntPtr hWnd, string text, string caption, int type);
>     \`\`\`
>
> - 在 WPF 项目中添加引用方式：
>
>     - 托管 DLL：通过“添加引用”引入，命名空间方式调用
>     - 非托管 DLL（C/C++）：需使用 Platform Invoke (P/Invoke)
>
> - 动态加载 DLL：使用 \`Assembly.LoadFrom()\` 加载 DLL 并反射调用指定类与方法

> 之后再补上吧

**adb**

- 电脑端操作

    \`\`\`text
    adb push {local} {remote}
    adb pull {remote} {local}
    \`\`\`

- 调用手机的 shell 执行命令，receiver 接收执行输出

    \`\`\`text
    adb shell
    \`\`\`

    常用命令示例：

    \`\`\`bash
    adb shell ls /sdcard/           		# 列出手机存储目录  
    adb shell pm list packages      		# 显示所有安装包名  
    adb shell am start -n 包名/.MainActivity # 启动指定应用  
    adb shell screencap /sdcard/screen.png  # 截图  
    \`\`\`

------

`;export{n as default};
