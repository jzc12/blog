import{o as t,c as a,a as l}from"./index-2cd69f56.js";const s={class:"markdown-body"},i="2025-06-30T00:00:00.000Z",r="2025-06-30T00:00:00.000Z",u="工具",b="adb学习记录",h={__name:"adb",setup(o,{expose:n}){return n({frontmatter:{date:"2025-06-30T00:00:00.000Z",updated:"2025-06-30T00:00:00.000Z",category:"工具",summary:"adb学习记录"}}),(c,e)=>(t(),a("div",s,e[0]||(e[0]=[l(`<h1>adb 使用记录说明</h1><h2>连接</h2><blockquote><p>手机需要打开开发者模式，并且打开USB调试选项 无线连接和有线连接都行，但是无线连接配对码进行配对好像还是需要打开USB调试的选项，否则很容易连接就断开(我也不知道为什么)</p></blockquote><blockquote><p>连接后</p><pre><code class="language-bash">adb devices
List of devices attached
adb-5204d4a9-iq9Cok._adb-tls-connect._tcp       device    
# 设备的       Serial                             状态      
</code></pre><p>可以看到连接的设备</p></blockquote><h2>将命令发送到选择的设备</h2><p>如果是多个设备的话需要进行设备的选择, 举个栗子：</p><pre><code class="language-bash">adb -s adb-5204d4a9-iq9Cok._adb-tls-connect._tcp shell screencap -p /sdcard/temp.png
# 只有一个设备的话
adb shell screencap -p /sdcard/temp.png
</code></pre><blockquote><p>有一些命令运行的环境是手机设备的，有一些是电脑的</p></blockquote><p>• 电脑端命令</p><pre><code class="language-bash"># 不带 shell
adb pull {remote} {local}
adb push {local} {remote}
</code></pre><p>• 移动端命令</p><pre><code class="language-bash"># adb shell：会启动设备中的 Unix 命令行工具，并运行后续命令
adb shell {command}
</code></pre><h2>常见指令</h2><p>• 基础</p><pre><code class="language-bash"># ===== 输入操作 =====

# 1. 输入文本 (自动转义特殊字符)
adb shell input text &quot;hello_1234\\$&quot;

# 2. 输入键盘按键 (KEYCODE列表见注释)
adb shell input keyevent KEYCODE_ENTER        # 回车
adb shell input keyevent KEYCODE_BACK         # 返回键
adb shell input keyevent KEYCODE_HOME         # 主页键
adb shell input keyevent KEYCODE_POWER        # 电源键


# ===== 触摸操作 =====

# 3. 点击
adb shell input tap 500 700 

# 4. 长按
adb shell input swipe 500 500 500 500 1000

# 5. 双击
adb shell input tap 300 400; Start-Sleep -Milliseconds 200; adb shell input tap 300 400

# 6. 拖拽 
adb shell input swipe 100 200 400 600 800 

# 7. 滑动
adb shell input swipe 800 1000 200 1000 200 

# ===== 其他 =====

# 8. 截屏
adb shell screencap -p /sdcard/temp.png

# 9.日期
adb shell date

# 10.屏幕尺寸(从左上角为原点，向右为x轴正方向，向下为y轴正方向)
adb shell wm size 

</code></pre><p>• 电池</p><pre><code class="language-bash">
# 1. 查看电池信息
adb shell dumpsys battery
# (显示的电池温度要除以10    temperature: 282 = 28.2°C)


# 2. 设置电池信息

adb shell dumpsys battery set level 12  # 设置电量百分比
adb shell dumpsys battery set ac 1      # 设置是否充电
adb shell dumpsys battery reset         # 重置电池信息
# 没用的知识增加了
</code></pre><p>• activity 管理</p><pre><code class="language-bash">
# 1. 查看当前界面的Activity：
adb shell dumpsys activity top | findstr ACTIVITY

# 2. 打开Activity
adb shell am start -n {应用名}/{activity名}
adb shell am start -n com.coloros.gallery3d/.app.MainActivity
adb shell am start -a android.intent.action.VIEW -d &quot;https://baidu.com&quot;
adb shell am start -a android.intent.action.DIAL -d tel:10086

# 3. 关闭Activity
adb shell am force-stop {应用名}

</code></pre><h2>AdvancedSharpAdbClient 使用记录说明</h2><blockquote><pre><code class="language-bash"># csharp 安装
dotnet add package AdvancedSharpAdbClient --version 3.4.14
</code></pre></blockquote><blockquote><p>我自己的理解是有一些需要异步执行，传输安全，中断，恢复继续传输，这个包提供了这些功能 并且封装了一些常用的命令，可以在满足开闭原则的基础上进行开发。</p></blockquote><pre><code class="language-mermaid">graph TD
    %% 第一步：启动adb服务
    AdbServer[&quot;AdbServer&quot;] --&gt;|StartServer| LocalAdb[adb.exe]
    
    %% 第二步：AdbClient 连接服务
    LocalAdb --&gt;|设备数据流| AdbClient[&quot;AdbClient&quot;]
    
    %% 第三步：设备发现与操作
    AdbClient --&gt;|设备列表| DeviceData[&quot;DeviceData&quot;]
    AdbClient --&gt;|操作指令| DeviceClient[&quot;DeviceClient&quot;]
    
    DeviceData --&gt;|Serial| PhysicalDevice[&quot;物理设备&quot;]
    DeviceData --&gt;|Serial| Emulator[&quot;模拟器&quot;]
    
    %% 协议执行层
    DeviceClient --&gt;|执行| Commands[&quot;ADB命令&quot;]
    DeviceClient --&gt;|访问| FileSystem[&quot;文件系统&quot;]
    

    subgraph ADB协议层[&quot;ADB协议层&quot;]
        Commands --&gt; Shell[&quot;Shell命令&quot;]
        Commands --&gt; Command[&quot;自定义指令&quot;]
        FileSystem --&gt; PushPull[&quot;文件传输&quot;]
        FileSystem --&gt; Sync[&quot;同步服务&quot;]
    end
    
    %% 物理连接
    subgraph 物理设备层[&quot;物理设备层&quot;]
        PhysicalDevice --&gt;|USB/WiFi| AndroidOS[&quot;Android系统&quot;]
        Emulator --&gt;|虚拟连接| AndroidOS
    end
    
    %% 添加虚线表示通信
    AdbClient -. &quot;命令&quot; .-&gt; LocalAdb
    
    %% 样式定义
    classDef server fill:#e6f7ff,stroke:#3399ff;
    classDef client fill:#e6ffe6,stroke:#33cc33;
    classDef device fill:#fff2e6,stroke:#ff9933;
    classDef protocol fill:#f9f2e4,stroke:#e0c17a;
    classDef physical fill:#f4f4f4,stroke:#999999;
    
    class AdbServer,LocalAdb server;
    class AdbClient client;
    class DeviceData,DeviceClient device;
    class ADB协议层 protocol;
    class 物理设备层 physical;
</code></pre><blockquote><p>图画的很烂，最终对接手机设备的都是adb.exe, Serial、执行、访问都是通过adb.exe实现</p></blockquote>`,24)])))}};export{u as category,i as date,h as default,b as summary,r as updated};
