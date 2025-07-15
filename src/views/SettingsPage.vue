// ========================== 设置页面组件 ==============================
<template>
  <div class="settings-page">
    <!-- 页面标题 -->
    <h1>
      <i class="fas fa-cog"></i>
      个性化设置
    </h1>

    <!-- 主题设置 -->
    <div class="setting-section">
      <div class="setting-header">
        <h2>
          <i class="fas fa-moon"></i>
          主题设置
        </h2>
        <span class="setting-description">选择您喜欢的主题模式</span>
      </div>
      <div class="theme-buttons">
        <button 
          class="theme-button" 
          :class="{ active: settingsStore.theme === 'light' }"
          @click="settingsStore.setTheme('light')"
        >
          <i class="fas fa-sun"></i>
          浅色模式
        </button>
        <button 
          class="theme-button" 
          :class="{ active: settingsStore.theme === 'dark' }"
          @click="settingsStore.setTheme('dark')"
        >
          <i class="fas fa-moon"></i>
          深色模式
        </button>
        <button 
          class="theme-button" 
          :class="{ active: settingsStore.theme === 'system' }"
          @click="settingsStore.setTheme('system')"
        >
          <i class="fas fa-desktop"></i>
          跟随系统
        </button>

        
      </div>
    </div>

    <!-- 字体大小设置 -->
    <div class="setting-section">
      <div class="setting-header">
        <h2>
          <i class="fas fa-text-height"></i>
          字体大小
        </h2>
        <span class="setting-description">调整字体大小 x 已经异常，之后再改吧</span>
      </div>
      <div class="control-group">
        <!-- 字体大小滑块 -->
        <input
          type="range"
          min="0"
          :max="settingsStore.fontSizeSteps.length - 1"
          step="1"
          v-model="fontSizeIndex"
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
        <span class="setting-description">调整背景透明度</span>
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
import { onMounted, computed } from 'vue';

export default {
  name: 'SettingsPage',

  // ========================== 组件逻辑 ==============================
  setup() {
    const settingsStore = useSettingsStore();
    
    const fontSizeIndex = computed({
      get: () => settingsStore.fontSizeIndex,
      set: (value) => {
        settingsStore.setFontSize(parseInt(value));
      }
    });

    // 组件挂载时初始化主题
    onMounted(() => {
      settingsStore.initTheme();
    });

    // 重置所有设置到默认值
    const resetSettings = () => {
      settingsStore.$reset();
    };

    // ========================== 返回数据 ==============================
    return { 
      settingsStore,    // 设置状态管理
      resetSettings,    // 重置设置方法
      fontSizeIndex     // 字体大小索引
    };
  }
}
</script>

<style scoped>
@import '../css/settings.css';
</style> 