import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        fontSizeIndex: parseInt(localStorage.getItem('fontSizeIndex') || '2'),
        fontSizeSteps: ['14px', '16px', '18px', '20px', '22px'],
        contentOpacity: 85,
        theme: 'system', // 'light', 'dark', or 'system'
        systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', // 初始化时就检测系统主题
    }),
    getters: {
        currentFontSize() {
            return this.fontSizeSteps[this.fontSizeIndex];
        },
        effectiveTheme() {
            return this.theme === 'system' ? this.systemTheme : this.theme;
        },
    },
    actions: {
        initTheme() {
            // 检查本地存储的主题设置
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                this.theme = savedTheme;
            }

            // 初始化系统主题检测
            this.detectSystemTheme();

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.detectSystemTheme);

            // 应用字体大小
            this.applyFontSize();
        },

        detectSystemTheme() {
            this.systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            this.applyTheme();
        },

        setTheme(newTheme) {
            this.theme = newTheme;
            localStorage.setItem('theme', newTheme);
            this.applyTheme();
        },

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

        setFontSize(index) {
            this.fontSizeIndex = index;
            localStorage.setItem('fontSizeIndex', index.toString());
            this.applyFontSize();
        },

        applyFontSize() {
            document.documentElement.style.setProperty('--global-font-size', this.currentFontSize);
        },

        $reset() {
            this.fontSizeIndex = 2;
            this.contentOpacity = 85;
            this.theme = 'system';
            localStorage.setItem('fontSizeIndex', '2');
            this.detectSystemTheme();
            this.applyFontSize();
        }
    },

    persist: true
}); 