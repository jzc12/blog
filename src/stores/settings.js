import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        fontSizeIndex: 2,
        fontSizeSteps: [14, 15, 16, 17, 18],
        contentOpacity: 100
    }),
    getters: {
        currentFontSize: (state) => `${state.fontSizeSteps[state.fontSizeIndex]}px`,
        currentContentOpacity: (state) => state.contentOpacity / 100
    },
    actions: {
        setFontSize(index) {
            if (index >= 0 && index < this.fontSizeSteps.length) {
                this.fontSizeIndex = index;
            }
        },
        setContentOpacity(opacity) {
            if (opacity >= 0 && opacity <= 100) {
                this.contentOpacity = opacity;
            }
        }
    },

    persist: true
}); 