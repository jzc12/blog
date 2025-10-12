import{o as t,c as a,a as i}from"./index-9496946b.js";const r={class:"markdown-body"},u="2025-06-30T00:00:00.000Z",d="2025-06-30T00:00:00.000Z",g="工具",p="adb学习记录",v={__name:"adb",setup(c,{expose:n}){return n({frontmatter:{date:"2025-06-30T00:00:00.000Z",updated:"2025-06-30T00:00:00.000Z",category:"工具",summary:"adb学习记录"}}),(o,e)=>(t(),a("div",r,e[0]||(e[0]=[i(`<h1>adb 使用记录说明</h1><h2>连接</h2><blockquote><p>手机需要打开开发者模式，并且打开USB调试选项 无线连接和有线连接都行，但是无线连接配对码进行配对好像还是需要打开USB调试的选项，否则很容易连接就断开(我也不知道为什么)</p></blockquote><blockquote><p>连接后</p><pre><code class="language-bash">adb devices
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

</code></pre><h2>栗子</h2><blockquote><pre><code class="language-bash"># csharp 安装
dotnet add package AdvancedSharpAdbClient --version 3.4.14
</code></pre></blockquote><blockquote><p>我自己的理解是有一些需要异步执行，传输安全，中断，恢复继续传输，这个包提供了这些功能 并且封装了一些常用的命令，可以在满足开闭原则的基础上进行开发。</p></blockquote><pre><code class="language-mermaid">graph TD
    %% 第一步：启动adb服务
    LocalAdb[adb.exe] --&gt;|StartServer| AdbServer[&quot;AdbServer&quot;]
    
    %% 第二步：AdbClient 连接服务
    AdbServer --&gt;|设备数据流| AdbClient[&quot;AdbClient&quot;]
    
    %% 第三步：设备发现与操作
    AdbClient --&gt;|设备连接| DeviceConnect[&quot;DeviceConnect&quot;]
    AdbClient --&gt;|操作指令| DeviceOperate[&quot;DeviceOperate&quot;]
    
    DeviceConnect --&gt;|Serial| PhysicalDevice[&quot;物理设备&quot;]
    DeviceConnect --&gt;|Serial| Emulator[&quot;模拟器&quot;]
    
    %% 协议执行层
    DeviceOperate --&gt;|执行| Commands[&quot;ADB命令&quot;]
    DeviceOperate --&gt;|访问| FileSystem[&quot;文件系统&quot;]
    

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
    
    %% 样式定义
    classDef server fill:#e6f7ff,stroke:#3399ff;
    classDef client fill:#e6ffe6,stroke:#33cc33;
    classDef device fill:#fff2e6,stroke:#ff9933;
    classDef protocol fill:#f9f2e4,stroke:#e0c17a;
    classDef physical fill:#f4f4f4,stroke:#999999;
    
    class AdbServer,LocalAdb server;
    class AdbClient client;
    class DeviceConnect,DeviceOperate device;
    class ADB协议层 protocol;
    class 物理设备层 physical;
</code></pre><blockquote><p>我没有使用 AdvancedSharpAdbClient 封装的DeviceClient , 设备很可能断连，DeviceClient 封装的功能也很少，而不是虚基类或者接口类，主要就是封装功能，就利用adbClient 实现就好了。</p><p>AdbServer 提供检查本地的adb.exe, 建立socket 节点让adb.exe与设备进行通信，提供启动服务、关闭服务的功能</p><p>AdbClient 提供连接、断连、配对及发送操作指令对手机进行操作的基本接口，提供自定义的指令功能函数</p><p>所以，需要维护连接的设备，设备的序列号来实例化DeviceData, 通过AdbClient 利用 DeviceData对手机进行操作</p></blockquote><h3>对外服务接口</h3><pre><code class="language-c#">using System.Net.Sockets;
using AdvancedSharpAdbClient;
using AdvancedSharpAdbClient.DeviceCommands;
using AdvancedSharpAdbClient.Models;
using System;
using Microsoft.Extensions.Logging;
using System.Collections.ObjectModel;
using System.Windows;

namespace AdbDevice
{
    /// &lt;summary&gt;
    /// 设备连接状态信息
    /// &lt;/summary&gt;
    public struct ConnectStatus
    {
        public string Result { get; set; }
        public string DeviceName { get; set; }
        public string DeviceSerial { get; set; }
        public bool IsSuccess { get; set; }
    }

    public static class AdbService
    {
        private static AdbClient _adbClient;
        private static AdbServer _adbServer;
        private static DevicesManager _devicesManager;
        private static DevicesOperate _devicesOperate;
        private static ILogger _logger;

        private static List&lt;string&gt; _NetSerials;
        public static string _adbPath = @&quot;Adb\\adb.exe&quot;;

        static AdbService()
        {
            // 
        }

        public static void Initialize(ILogger logger)
        {
            _logger = logger;
            _adbClient = new AdbClient();
            _adbServer = new AdbServer();
            _ = StartAdbServerAsync();
            _devicesManager = new DevicesManager(_adbClient);
            _devicesOperate = new DevicesOperate(_adbClient, _devicesManager);
            _NetSerials = new List&lt;string&gt;();
        }


        #region 服务启动关闭
        // =================== ADB 服务管理 ===================== //
        /// &lt;summary&gt;
        /// 启动ADB服务才能运行， 节流避免多次调用
        /// &lt;/summary&gt;
        private static readonly SemaphoreSlim _adbServerLock = new SemaphoreSlim(1, 1);
        
        public static async Task&lt;bool&gt; StartAdbServerAsync()
        {
            await _adbServerLock.WaitAsync();
            try
            {
                var result = await _adbServer.StartServerAsync(_adbPath);
                bool isStarted = (result == StartServerResult.Started || result == StartServerResult.AlreadyRunning);
                _isStopped = !isStarted;
                return isStarted;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;ADB服务启动失败&quot;);
                return false;
            }
            finally
            {
                _adbServerLock.Release();
            }
        }

        /// &lt;summary&gt;
        /// ADB 服务重启
        /// &lt;/summary&gt;
        public static async Task RestartAdbServerAsync()
        {
            try
            {
                await _adbServer.RestartServerAsync(_adbPath);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;ADB服务重启失败&quot;);
            }
        }

        private static bool _isStopped = true;
        
        /// &lt;summary&gt;
        /// 关闭ADB服务
        /// &lt;/summary&gt;
        public static void StopServer()
        {
            if (_isStopped) return;
            try
            {
                _adbClient.KillAdbAsync().GetAwaiter().GetResult();
                _isStopped = true;
                _devicesManager.SetCurrentDevice(string.Empty);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;ADB服务关闭失败&quot;);
            }
        }
        #endregion

        // =================== 设备连接管理 ===================== //
        #region 设备连接
        /// &lt;summary&gt;
        /// 当连接的设备信息更改时，传递信息给Setting部分的前端
        /// &lt;/summary&gt;
        public static event EventHandler&lt;ConnectStatus&gt; ConnectionStatusChanged;

        /// &lt;summary&gt;
        /// 设备连接异步处理
        /// &lt;/summary&gt;
        public static async Task ConnectDeviceAsync(string ipAddress, int port, string code = &quot;&quot;)
        {
            try
            {
                if (_isStopped)
                {
                    NotifyConnectionStatus(false, &quot;Adb服务未启动&quot;);
                    return;
                }
                string result = !string.IsNullOrEmpty(code)
                    ? await _adbClient.PairAsync(ipAddress, port, code)
                    : await _adbClient.ConnectAsync(ipAddress, port);

                if (!result.Contains(&quot;connected&quot;) &amp;&amp; !result.Contains(&quot;success&quot;))
                {
                    NotifyConnectionStatus(false, result);
                    return;
                }
                string serial = $&quot;{ipAddress}:{port.ToString()}&quot;;
                RefreshDevices(serial, false);
                
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;ADB连接失败&quot;);
                NotifyConnectionStatus(false, ex.Message);
            }
        }

        /// &lt;summary&gt;
        /// 根据参数获取连接的设备
        /// &lt;/summary&gt;
        /// &lt;param name=&quot;serial&quot;&gt;&lt;/param&gt;
        /// &lt;param name=&quot;isUsb&quot;&gt;&lt;/param&gt;
        /// &lt;returns&gt;&lt;/returns&gt;
        private static DeviceData GetDeviceData(string serial, bool isUsb = false)
        {
            _devicesManager.RefreshDevicesAsync();
            var devices = _devicesManager.ConnectedDevices;
            if (devices.Count &gt; 0)
            {
                if (isUsb)
                {
                    if (!_NetSerials.Contains(serial))
                        return devices[0];
                }
                else
                {
                    var device = devices.FirstOrDefault(d =&gt; d.Serial == serial);
                    return device;
                }
            }
            return default(DeviceData);
        }

        /// &lt;summary&gt;
        /// 刷新设备列表
        /// &lt;/summary&gt;
        public static void RefreshDevices(string serial = &quot;&quot;, bool isUsb = false)
        {
            try
            {
                if (_isStopped)
                {
                    NotifyConnectionStatus(false, &quot;Adb服务未启动&quot;);
                    return;
                }
                var device = GetDeviceData(serial, isUsb);
                if (device != default(DeviceData))
                {
                    if (!isUsb) _NetSerials.Add(serial);
                    _devicesManager.SetCurrentDevice(device.Serial);
                    string testMessage = &quot;USB: &quot; + device.Usb + &quot;  Model: &quot; + device.Model + &quot; Serial: &quot; + device.Serial;
                    NotifyConnectionStatus(true, device, testMessage);
                }
                else
                {
                    NotifyConnectionStatus(false, isUsb ? &quot;未找到可用的USB设备&quot; : &quot;设备连接异常&quot;);
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;设备刷新失败&quot;);
                NotifyConnectionStatus(false, ex.Message);
            }
        }

        private static void NotifyConnectionStatus(bool success, DeviceData device = default, string message = &quot;&quot;)
        {
            var status = new ConnectStatus
            {
                IsSuccess = success,
                Result = message,
                DeviceName = (device == default) ? &quot;Unknown&quot; : device.Name,
                DeviceSerial = (device == default) ? &quot;Unknown&quot; : device.Serial
            };
            ConnectionStatusChanged?.Invoke(null, status);
        }

        private static void NotifyConnectionStatus(bool success, string message)
        {
            ConnectionStatusChanged?.Invoke(null, new ConnectStatus
            {
                IsSuccess = success,
                Result = message,
                DeviceName = &quot;None&quot;,
                DeviceSerial = &quot;None&quot;
            });
        }

        #endregion

        // =================== 设备操作管理 ===================== //

        #region 设备操作
        /// &lt;summary&gt;
        /// 执行远程命令
        /// &lt;/summary&gt;
        public static async Task ExecuteRemoteCommandAsync(string command)
        {
            try
            {
                await _devicesOperate.ExecuteRemoteCommandAsync(command);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;命令执行失败&quot;);
            }
        }

        /// &lt;summary&gt;
        /// 从设备拉取文件
        /// &lt;/summary&gt;
        public static async Task PullFileAsync(string remotePath, string localPath)
        {
            try
            {
                await _devicesOperate.PullFileAsync(remotePath, localPath);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;文件拉取失败&quot;);
            }
        }

        /// &lt;summary&gt;
        /// 推送文件到设备
        /// &lt;/summary&gt;
        public static async Task PushFileAsync(string localPath, string remotePath)
        {
            try
            {
                await _devicesOperate.PushFileAsync(localPath, remotePath);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;文件推送失败&quot;);
            }
        }

        public static async void HomeAsync()
        {
            try
            {
                await _devicesOperate.HomeAsync();
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;操作失败&quot;);
            }
        }

        public static async Task&lt;string&gt; GetLogcatAsync()
        {
            try
            {
                return await _devicesOperate.GetLogcatAsync();
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;设备日志获取失败&quot;);
                return string.Empty;
            }
        }

        public static async Task ScreenshotAsync(string savePath, bool deviceSave = false)
        {
            try
            {
                await _devicesOperate.ScreenshotAsync(savePath);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, &quot;设备日志获取失败&quot;);
            }
        }
        
        #endregion
    }
}

</code></pre><h3>设备管理</h3><pre><code class="language-c#">using System.Collections.Concurrent;
using System.Collections.ObjectModel;
using AdvancedSharpAdbClient;
using AdvancedSharpAdbClient.DeviceCommands;
using AdvancedSharpAdbClient.Models;

namespace AdbDevice
{
    public class DevicesManager
    {
        private readonly AdbClient _adbClient;
        // 当前选择设备的序列号 与前端对接
        private string _currentDeviceSerial = string.Empty;
        public void SetCurrentDevice(string serial)
        {
            _currentDeviceSerial = serial;
        }
        public List&lt;DeviceData&gt; ConnectedDevices { get; } = new();
        public DevicesManager(AdbClient adbClient)
        {
            _adbClient = adbClient;
        }

        /// &lt;summary&gt;
        /// 获取连接的设备
        /// &lt;/summary&gt;
        /// &lt;returns&gt;&lt;/returns&gt;
        public void RefreshDevicesAsync()
        {
            var devices = _adbClient.GetDevices();
            var newSerials = new HashSet&lt;string&gt;(devices.Select(d =&gt; d.Serial));

            ConnectedDevices.Clear();
            foreach (var device in devices)
            {
                ConnectedDevices.Add(device);
            }
        }

        /// &lt;summary&gt;
        /// 获取与 _currentDeviceSerial 名相同的 DeviceData， 否则返回 default(DeviceData)
        /// &lt;/summary&gt;
        /// &lt;returns&gt;&lt;/returns&gt;
        public DeviceData GetCurrentDeviceData()
        {
            if (ConnectedDevices.Count == 0)
            {
                return default(DeviceData);
            }
            if (!string.IsNullOrEmpty(_currentDeviceSerial))
            {
                foreach (var device in ConnectedDevices)
                {
                    if (device.Serial == _currentDeviceSerial)
                    {
                        return device;
                    }
                }
            }
            return default(DeviceData);
        }
    }

}

</code></pre><h3>服务功能实现</h3><pre><code class="language-c#">using System.IO;
using AdvancedSharpAdbClient;
using AdvancedSharpAdbClient.DeviceCommands;
using AdvancedSharpAdbClient.Exceptions;
using AdvancedSharpAdbClient.Models;
using AdvancedSharpAdbClient.Receivers;

namespace AdbDevice
{
    public class DevicesOperate
    {
        private readonly AdbClient _adbClient;
        private readonly DevicesManager _devicesManager;
        public DevicesOperate(AdbClient adbClient, DevicesManager devicesManager)
        {
            _adbClient = adbClient;
            _devicesManager = devicesManager;
        }
        #region 底层函数抽象

        /// &lt;summary&gt;
        /// 先获取选择的连接的设备，执行没有返回结果的指令
        /// &lt;/summary&gt;
        /// &lt;param name=&quot;action&quot;&gt;&lt;/param&gt;
        /// &lt;returns&gt;&lt;/returns&gt;
        /// &lt;exception cref=&quot;InvalidOperationException&quot;&gt;&lt;/exception&gt;
        private async Task ExecuteForCurrentDeviceAsync(Func&lt;DeviceData, Task&gt; action)
        {
            var device = _devicesManager.GetCurrentDeviceData();
            if (device == default(DeviceData))
            {
                throw new InvalidOperationException(&quot;No device is connected.&quot;);
            }
            await action(device);
        }

        /// &lt;summary&gt;
        /// 先获取选择的连接的设备，执行有返回结果的指令
        /// &lt;/summary&gt;
        /// &lt;typeparam name=&quot;T&quot;&gt;&lt;/typeparam&gt;
        /// &lt;param name=&quot;func&quot;&gt;&lt;/param&gt;
        /// &lt;returns&gt;&lt;/returns&gt;
        /// &lt;exception cref=&quot;InvalidOperationException&quot;&gt;&lt;/exception&gt;
        private async Task&lt;T&gt; ExecuteForCurrentDeviceAsync&lt;T&gt;(Func&lt;DeviceData, Task&lt;T&gt;&gt; func)
        {
            var device = _devicesManager.GetCurrentDeviceData();
            if (device == default(DeviceData))
            {
                throw new InvalidOperationException(&quot;No device is connected.&quot;);
            }
            return await func(device);
        }

        /// &lt;summary&gt;
        /// 在手机或者车机上执行的指令，在电脑端实例化 receiver 接收
        /// &lt;/summary&gt;
        /// &lt;param name=&quot;command&quot;&gt;&lt;/param&gt;
        /// &lt;returns&gt;&lt;/returns&gt;
        public async Task&lt;string&gt; ExecuteRemoteCommandAsync(string command)
        {
            return await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                var receiver = new ConsoleOutputReceiver();
                await _adbClient.ExecuteRemoteCommandAsync(
                    command,
                    device,
                    receiver,
                    CancellationToken.None
                );
                return receiver.ToString();
            });
        }

        #endregion


        // ============================ Adb 具体功能函数 ========================== // 

        #region 具体的功能
        // 从设备拉取文件
        public async Task PullFileAsync(string remotePath, string localPath)
        {
            if (string.IsNullOrWhiteSpace(remotePath))
                throw new ArgumentException(&quot;远程路径不能为空&quot;, nameof(remotePath));

            if (!remotePath.StartsWith(&quot;/&quot;))
                throw new ArgumentException(&quot;远程路径必须是绝对路径&quot;, nameof(remotePath));

            if (string.IsNullOrWhiteSpace(localPath))
                throw new ArgumentException(&quot;本地路径不能为空&quot;, nameof(localPath));

            await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                try
                {
                    using var syncService = new SyncService(_adbClient, device);
                    await using var stream = File.Create(localPath);
                    await syncService.PullAsync(remotePath, stream, null, CancellationToken.None);
                }
                catch (FileNotFoundException)
                {
                    throw new ArgumentException($&quot;文件在设备上不存在: {remotePath}&quot;);
                }
                catch (AdbException ex)
                {
                    throw new IOException($&quot;从设备拉取文件失败: {remotePath}&quot;, ex);
                }
            });
        }

        // 推送文件到设备
        public async Task PushFileAsync(string localPath, string remotePath)
        {
            if (string.IsNullOrWhiteSpace(remotePath))
                throw new ArgumentException(&quot;远程路径不能为空&quot;, nameof(remotePath));

            if (string.IsNullOrWhiteSpace(localPath))
                throw new ArgumentException(&quot;本地路径不能为空&quot;, nameof(localPath));

            if (!File.Exists(localPath))
                throw new FileNotFoundException(&quot;本地文件不存在&quot;, localPath);

            await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                try
                {
                    using var syncService = new SyncService(_adbClient, device);
                    await using var stream = File.OpenRead(localPath);
                    await syncService.PushAsync(stream, remotePath, default, DateTime.Now, null, CancellationToken.None);
                }
                catch (AdbException ex)
                {
                    throw new IOException($&quot;推送文件到设备失败: {ex.Message}&quot;, ex);
                }
            });
        }
        public async Task HomeAsync()
        {
            await ExecuteForCurrentDeviceAsync(device =&gt;
            {
                _adbClient.SendKeyEvent(device, &quot;KEYCODE_HOME&quot;);
                return Task.CompletedTask;
            });
        }

        // 锁屏
        public async Task LockScreenAsync()
        {
            await ExecuteForCurrentDeviceAsync(device =&gt;
            {
                _adbClient.SendKeyEvent(device, &quot;KEYCODE_POWER&quot;);
                return Task.CompletedTask;
            });
        }

        // 解锁
        public async Task UnlockScreenAsync(string password)
        {
            await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                // 唤醒屏幕
                _adbClient.SendKeyEvent(device, &quot;KEYCODE_WAKEUP&quot;);
                await Task.Delay(300);

                // 滑动解锁
                _adbClient.ExecuteRemoteCommand(&quot;input swipe 500 1800 500 1000&quot;, device);
                await Task.Delay(500);

                // 输入密码
                _adbClient.ExecuteRemoteCommand($&quot;input text \\&quot;{password}\\&quot;&quot;, device);
                await Task.Delay(300);

                // 确认解锁
                _adbClient.SendKeyEvent(device, &quot;KEYCODE_ENTER&quot;);
            });
        }

        // 点击坐标
        public async Task ClickAsync(int x, int y)
        {
            await ExecuteForCurrentDeviceAsync(device =&gt;
            {
                _adbClient.ExecuteRemoteCommand($&quot;input tap {x} {y}&quot;, device);
                return Task.CompletedTask;
            });
        }

        // 获取设备日志
        /// &lt;summary&gt;
        /// 获取设备日志
        /// &lt;/summary&gt;
        /// &lt;returns&gt;返回最近100条日志记录&lt;/returns&gt;
        /// &lt;exception cref=&quot;InvalidOperationException&quot;&gt;设备未连接时抛出&lt;/exception&gt;
        public async Task&lt;string&gt; GetLogcatAsync()
        {
            return await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                try
                {
                    var receiver = new ConsoleOutputReceiver();
                    await _adbClient.ExecuteRemoteCommandAsync(
                        &quot;logcat -t 100&quot;,  // 获取最近100条日志
                        device,
                        receiver,
                        CancellationToken.None
                    );
                    return !string.IsNullOrEmpty(receiver.ToString()) ?
                        receiver.ToString() :
                        &quot;未获取到日志内容&quot;;
                }
                catch (AdbException ex)
                {
                    throw new InvalidOperationException(&quot;获取设备日志失败&quot;, ex);
                }
            });
        }

        /// &lt;summary&gt;
        /// 按时间段获取设备日志
        /// &lt;/summary&gt;
        /// &lt;param name=&quot;startTime&quot;&gt;开始时间(格式: MM-DD hh:mm:ss)&lt;/param&gt;
        /// &lt;param name=&quot;endTime&quot;&gt;结束时间(格式: MM-DD hh:mm:ss)&lt;/param&gt;
        public async Task&lt;string&gt; GetLogcatByTimeAsync(string startTime, string endTime)
        {
            return await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                try
                {
                    var receiver = new ConsoleOutputReceiver();
                    await _adbClient.ExecuteRemoteCommandAsync(
                        $&quot;logcat -t &#39;{startTime}&#39; -t &#39;{endTime}&#39;&quot;,
                        device,
                        receiver,
                        CancellationToken.None
                    );
                    return !string.IsNullOrEmpty(receiver.ToString()) ?
                        receiver.ToString() :
                        $&quot;未获取到{startTime}至{endTime}时间段的日志&quot;;
                }
                catch (AdbException ex)
                {
                    throw new InvalidOperationException($&quot;获取时间段日志失败&quot;, ex);
                }
            });
        }

        /// &lt;summary&gt;
        /// 获取指定应用的日志
        /// &lt;/summary&gt;
        /// &lt;param name=&quot;packageName&quot;&gt;应用包名&lt;/param&gt;
        public async Task&lt;string&gt; GetAppLogcatAsync(string packageName)
        {
            return await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                try
                {
                    var receiver = new ConsoleOutputReceiver();
                    await _adbClient.ExecuteRemoteCommandAsync(
                        $&quot;logcat --pid=$(pidof {packageName})&quot;,
                        device,
                        receiver,
                        CancellationToken.None
                    );
                    return !string.IsNullOrEmpty(receiver.ToString()) ?
                        receiver.ToString() :
                        $&quot;未获取到{packageName}应用的日志&quot;;
                }
                catch (AdbException ex)
                {
                    throw new InvalidOperationException($&quot;获取应用日志失败&quot;, ex);
                }
            });
        }

        // 设备截图
        public async Task ScreenshotAsync(string savePath, bool deviceSave = false)
        {
            await ExecuteForCurrentDeviceAsync(async device =&gt;
            {
                // 在设备上生成临时截图文件路径
                string tempFile = $&quot;/sdcard/Pictures/Screenshots/screenshot_{DateTime.Now:yyyyMMdd_HHmmssfff}.png&quot;;

                try
                {
                    await _adbClient.ExecuteRemoteCommandAsync($&quot;screencap -p \\&quot;{tempFile}\\&quot;&quot;, device);
                }
                catch (AdbException ex) when (ex.Message.Contains(&quot;unknown option&quot;, StringComparison.OrdinalIgnoreCase))
                {
                    await _adbClient.ExecuteRemoteCommandAsync($&quot;screencap \\&quot;{tempFile}\\&quot;&quot;, device);
                }

                // 使用ADB同步服务将截图拉取到本地
                using var syncService = new SyncService(_adbClient, device);
                await using var stream = File.Create(savePath);
                await syncService.PullAsync(tempFile, stream, null, CancellationToken.None);

                // 清理设备上的临时文件
                if (!deviceSave)
                    await _adbClient.ExecuteRemoteCommandAsync($&quot;rm \\&quot;{tempFile}\\&quot;&quot;, device);
            });
        }
        
        #endregion

    }
}

</code></pre>`,30)])))}};export{g as category,u as date,v as default,p as summary,d as updated};
