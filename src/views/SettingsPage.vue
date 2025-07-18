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
      </div>
      <div class="theme-buttons">
      <button 
        class="theme-button" 
        :class="{ active: settings.theme === 'light' }"
        @click="settings.setTheme('light')"
      >
        <i class="fas fa-sun"></i>
        浅色模式
      </button>
      <button 
        class="theme-button" 
        :class="{ active: settings.theme === 'dark' }"
        @click="settings.setTheme('dark')"
      >
        <i class="fas fa-moon"></i>
        深色模式
      </button>
      <button 
        class="theme-button" 
        :class="{ active: settings.theme === 'system' }"
        @click="settings.setTheme('system')"
      >
        <i class="fas fa-desktop"></i>
        跟随系统
      </button>
      </div>
    </div>

    <!-- 背景图片设置 -->
    <div class="setting-section">
      <div class="setting-header">
      <h2>
        <i class="fas fa-image"></i>
        背景设置
      </h2>
      </div>
      <div class="theme-buttons">
        <button 
        class="theme-button" 
        :class="{ active: settings.backgroundType === 'image' }"
        @click="settings.setBackgroundType('image')"
      >
        <i class="fas fa-image"></i>
        图片模式
        </button>
        
        <button 
          class="theme-button" 
          :class="{ active: settings.backgroundType === 'color' }"
          @click="settings.setBackgroundType('color')"
        >
          <i class="fas fa-moon"></i>
          纯色模式
        </button>

        <div v-if="settings.backgroundType === 'color'" class="background-color-picker">
          <input
            type="color"
            v-model="settings.backgroundColor"
          />
        </div>

      </div>

    </div>

    <!-- 字体大小设置 -->
    <div class="setting-section">
      <div class="setting-header">
        <h2>
          <i class="fas fa-text-height"></i>
          字体大小
        </h2>
      </div>
      <div class="control-group">
        <!-- 字体大小滑块 -->
        <input
          type="range"
          min="0"
          :max="3"
          step="1"
          v-model="settings.fontSizeIndex"
          class="slider"
        />
        <!-- 当前字体大小显示 -->
        <span class="value-display">{{ settings.currentFontSize }}</span>
      </div>
    </div>

    <!-- 透明度设置 -->
    <div class="setting-section">
      <div class="setting-header">
        <h2>
          <i class="fas fa-adjust"></i>
          背景透明度
        </h2>
      </div>
      <div class="control-group">
        <!-- 透明度滑块 -->
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          v-model="settings.contentOpacity"
          class="slider"
        />
        <!-- 当前透明度显示 -->
        <span class="value-display">{{ settings.contentOpacity }}%</span>
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
import { onMounted } from 'vue';

export default {
  name: 'SettingsPage',

  // ========================== 组件逻辑 ==============================
  setup() {
    const settings = useSettingsStore();

    // 组件挂载时初始化主题
    onMounted(() => {
      settings.initTheme();
    });

    // 重置所有设置到默认值
    const resetSettings = () => {
      settings.$reset();
    };

    // ========================== 返回数据 ==============================
    return { 
      settings,         // 设置状态管理
      resetSettings,    // 重置设置方法
    };
  }
}
</script>

<style scoped>
@import '../css/settings.css';
</style> 