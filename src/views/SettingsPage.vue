<template>
  <div class="settings-page">
    <h1>设置</h1>
    <div class="setting-section">
      <h2>字体大小</h2>
      <div class="control-group">
        <input
          type="range"
          min="0"
          :max="settingsStore.fontSizeSteps.length - 1"
          step="1"
          v-model="settingsStore.fontSizeIndex"
          class="slider"
        />
        <span>{{ settingsStore.currentFontSize }}</span>
      </div>
    </div>

    <div class="setting-section">
      <h2>透明度</h2>
      <div class="control-group">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          v-model="settingsStore.contentOpacity"
          class="slider"
        />
        <span>{{ settingsStore.contentOpacity }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../stores/settings';

export default {
  name: 'SettingsPage',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  }
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
}

.setting-section {
  margin: 20px;
  padding: 15px;
  border: 1px solid #eeeeee00;
  border-radius: 8px;

}

.settings-page h1 {
    font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
    font-size: 1.5rem;
    margin: 0 auto;
    color: #347dc2;
    margin-bottom: 1rem;
    font-weight: 600;
    letter-spacing: -0.5px;
}
.setting-section h2 {
  font-size: 1.3rem;
  color: #5c8dee;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.slider {
  flex-grow: 1;
  -webkit-appearance: none; 
  appearance: none;
  height: 8px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  border-radius: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #5c8dee;
  cursor: pointer;
  border-radius: 50%;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #5c8dee;
  cursor: pointer;
  border-radius: 50%;
}

.control-group span {
  font-size: 0.9em;
  color: #555;
  min-width: 40px; 
  text-align: right;
}
</style> 