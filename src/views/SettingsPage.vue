// ========================== 设置页面组件 ==============================
<template>
  <div class="settings-page">
    <!-- 页面标题 -->
    <h1>
      <i class="fas fa-cog"></i>
      个性化设置
    </h1>

    <!-- 字体大小设置 -->
    <div class="setting-section">
      <div class="setting-header">
        <h2>
          <i class="fas fa-text-height"></i>
          字体大小
        </h2>
        <span class="setting-description">调整文章内容的字体大小</span>
      </div>
      <div class="control-group">
        <!-- 字体大小滑块 -->
        <input
          type="range"
          min="0"
          :max="settingsStore.fontSizeSteps.length - 1"
          step="1"
          v-model="settingsStore.fontSizeIndex"
          class="slider"
        />
        <!-- 当前字体大小显示 -->
        <span class="value-display">{{ settingsStore.currentFontSize }}</span>
      </div>
    </div>

    <!-- 透明度设置 -->
    <div class="setting-section">
      <div class="setting-header">
        <h2>
          <i class="fas fa-adjust"></i>
          背景透明度
        </h2>
        <span class="setting-description">调整内容区域的背景透明度</span>
      </div>
      <div class="control-group">
        <!-- 透明度滑块 -->
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          v-model="settingsStore.contentOpacity"
          class="slider"
        />
        <!-- 当前透明度显示 -->
        <span class="value-display">{{ settingsStore.contentOpacity }}%</span>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="reset-section">
      <button class="reset-button" @click="resetSettings">
        <i class="fas fa-undo"></i>
        恢复默认设置
      </button>
    </div>
  </div>
</template>

<script>
// ========================== 依赖导入 ==============================
import { useSettingsStore } from '../stores/settings';

export default {
  name: 'SettingsPage',

  // ========================== 组件逻辑 ==============================
  setup() {
    const settingsStore = useSettingsStore();

    // 增加背景透明度
    const increaseOpacity = () => {
      if (settingsStore.contentOpacity < 100) {
        settingsStore.contentOpacity++;
      }
    };

    // 减少背景透明度
    const decreaseOpacity = () => {
      if (settingsStore.contentOpacity > 0) {
        settingsStore.contentOpacity--;
      }
    };

    // 重置所有设置到默认值
    const resetSettings = () => {
      settingsStore.$reset();
    };

    // ========================== 返回数据 ==============================
    return { 
      settingsStore,         // 设置状态管理
      increaseOpacity,       // 增加透明度方法
      decreaseOpacity,       // 减少透明度方法
      resetSettings          // 重置设置方法
    };
  }
}
</script>

<style scoped>
/* ========================== 页面基础样式 ============================== */
.settings-page {
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.249);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* ========================== 标题样式 ============================== */
.settings-page h1 {
  font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ========================== 设置区块样式 ============================== */
.setting-section {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.107);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* 设置区块悬停效果 */
.setting-section:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* ========================== 设置标题样式 ============================== */
.setting-header {
  margin-bottom: 1rem;
}

.setting-header h2 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-description {
  color: #666;
  font-size: 0.9rem;
  margin-left: 1.5rem;
}

/* ========================== 控制组样式 ============================== */
.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

/* ========================== 滑块样式 ============================== */
.slider {
  flex-grow: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  outline: none;
  opacity: 0.9;
  transition: all 0.2s ease;
}

/* 滑块悬停效果 */
.slider:hover {
  opacity: 1;
}

/* Webkit 滑块样式 */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

/* Firefox 滑块样式 */
.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

/* ========================== 数值显示样式 ============================== */
.value-display {
  width: 2rem;
  padding: 0.5rem;
  background: #f8f9fa00;
  border-radius: 6px;
  color: #2c3e50;
  font-size: 0.9rem;
  text-align: center;
}

/* ========================== 重置按钮样式 ============================== */
.reset-section {
  margin-top: 2rem;
  text-align: center;
}

.reset-button {
  padding: 0.8rem 1.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

/* 重置按钮悬停效果 */
.reset-button:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

/* ========================== 响应式布局 ============================== */
@media (max-width: 768px) {
  .settings-page {
    padding: 1rem;
  }

  .setting-section {
    padding: 1rem;
  }
}
</style> 