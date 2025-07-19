import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {

    state: () => ({
        // 字体大小索引（从 localStorage 中读取，默认为 1）
        fontSizeIndex: parseInt(localStorage.getItem('fontSizeIndex') || '1'),

        // 内容透明度（默认 70）
        contentOpacity: parseInt(localStorage.getItem('contentOpacity') || '70'),

        // 主题设置：'light' | 'dark' | 'system'
        theme: localStorage.getItem('theme') || 'system',
        // 当前系统主题
        systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',

        // 背景类型：'image' | 'color'
        backgroundType: localStorage.getItem('backgroundType') || 'color',
        // 背景颜色（用于 color 模式）
        backgroundColor: localStorage.getItem('backgroundColor') || '#436273',
    }),

    getters: {
        // 当前字体大小（带 px 单位）
        currentFontSize() { return `${13 + this.fontSizeIndex * 1}px`; },

        // 实际应用的主题（考虑系统设置）
        effectiveTheme() {
            return this.theme === 'system' ? this.systemTheme : this.theme;
        },
    },

    actions: {
        /**
         * 初始化主题相关设置
         */
        initTheme() {
            this.detectSystemTheme();
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', this.detectSystemTheme);
            this.applyFontSize();
        },

        /**
         * 检测系统主题并更新
         */
        detectSystemTheme() {
            this.systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            this.applyTheme();
            this.applyBackground();
        },

        /**
         * 应用当前主题样式变量
         */
        applyTheme() {
            const isDark = this.effectiveTheme === 'dark';

            document.documentElement.style.setProperty('--bg-opacity', isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)');
            document.documentElement.style.setProperty('--text-color', isDark ? '#ffffff' : '#2c3e50');
            document.documentElement.style.setProperty('--text-secondary', isDark ? '#aaaaaa' : '#666666');
            document.documentElement.style.setProperty('--section-bg', isDark ? 'rgba(40, 40, 40, 0.5)' : 'rgba(255, 255, 255, 0.5)');
            document.documentElement.style.setProperty('--slider-bg', isDark ? '#444444' : '#e0e0e0');
            document.documentElement.style.setProperty('--slider-thumb', isDark ? '#666666' : '#ffffff');
            document.documentElement.style.setProperty('--value-display-bg', isDark ? 'rgba(60, 60, 60, 0.5)' : 'rgba(248, 249, 250, 0.5)');
            document.documentElement.style.setProperty('--button-bg', isDark ? '#333333' : '#ffffff');
            document.documentElement.style.setProperty('--button-active-bg', isDark ? '#444444' : '#e0e0e0');
            document.documentElement.style.setProperty('--button-active-border', isDark ? '#666666' : '#999999');
            document.documentElement.style.setProperty('--border-color', isDark ? '#444444' : '#dddddd');
            document.documentElement.style.setProperty('--danger-color', '#e74c3c');
            document.documentElement.style.setProperty('--danger-hover-color', '#c0392b');
        },

        /**
         * 应用字体大小样式
         */
        applyFontSize() {
            document.documentElement.style.setProperty('--global-font-size', this.currentFontSize);
            localStorage.setItem('fontSizeIndex', this.fontSizeIndex);
        },

        /**
         * 应用背景设置
         */
        applyBackground() {
            if (this.backgroundType === 'image') {
                this.contentOpacity = 80;
                document.body.style.backgroundImage = `url(../assets/background1.png)`;
            } else if (this.backgroundType === 'color') {
                document.body.style.backgroundImage = '';
                document.body.style.backgroundColor = this.backgroundColor;
            } else {
                document.body.style.backgroundImage = '';
                document.body.style.backgroundColor = '#436273';
            }
        },

        /**
         * 设置主题并保存
         * @param {string} newTheme - 'light' | 'dark' | 'system'
         */
        setTheme(newTheme) {
            this.theme = newTheme;
            localStorage.setItem('theme', newTheme);
            this.applyTheme();
        },

        /**
         * 设置背景类型
         * @param {string} type - 'image' | 'color'
         */
        setBackgroundType(type) {
            this.backgroundType = type;
            localStorage.setItem('backgroundType', type);
            this.applyBackground();
        },

        /**
         * 设置背景颜色
         * @param {string} color - HEX颜色值
         */
        setBackgroundColor(color) {
            this.backgroundColor = color;
            localStorage.setItem('backgroundColor', color);
            this.applyBackground();
        },

        /**
         * 保存设置到本地存储
         */
        saveSettings() {
            localStorage.setItem('fontSizeIndex', this.fontSizeIndex);
            localStorage.setItem('contentOpacity', this.contentOpacity);
            localStorage.setItem('theme', this.theme);
            localStorage.setItem('backgroundType', this.backgroundType);
            localStorage.setItem('backgroundColor', this.backgroundColor);
        },

        /**
         * 重置为默认设置
         */
        $reset() {
            this.fontSizeIndex = 1;
            this.contentOpacity = 70;
            this.backgroundType = 'color';
            this.theme = 'system';
            this.saveSettings();
            this.applyTheme();
        }
    },

    // 开启持久化
    persist: true
});
