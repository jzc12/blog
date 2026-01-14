// utils/toast.js
import { createApp } from 'vue';
import ToastComponent from '@/components/Toast.vue';

class Toast {
    constructor() {
        this.toastInstance = null;
        this.container = null;
        this.timerId = null; // ✅ 统一管理自动关闭定时器

        this.defaultOptions = {
            duration: 3000,
            position: 'top',
            type: 'info'
        };
    }

    /**
     * 显示 Toast
     * @param {string|Object} content
     * @param {Object} options
     */
    show(content, options = {}) {
        // ✅ 关键：先彻底清理旧实例 + 旧 timer
        this.close();

        let message = '';
        let config = {};

        if (typeof content === 'string') {
            message = content;
            config = { ...this.defaultOptions, ...options };
        } else if (typeof content === 'object' && content !== null) {
            message = content.message || '';
            config = { ...this.defaultOptions, ...content, ...options };
        }

        // 创建容器
        this.container = document.createElement('div');
        this.container.id = 'global-toast-container';
        document.body.appendChild(this.container);

        // 创建 Vue 实例
        this.toastInstance = createApp(ToastComponent, {
            message,
            duration: config.duration,
            position: config.position,
            type: config.type
        });

        const vm = this.toastInstance.mount(this.container);

        // 显示
        if (vm && typeof vm.show === 'function') {
            vm.show(message);
        }

        // ✅ 只存在一个有效 timer
        if (config.duration > 0) {
            this.timerId = setTimeout(() => {
                this.close();
            }, config.duration);
        }
    }

    success(message, options = {}) {
        this.show(message, { ...options, type: 'success' });
    }

    error(message, options = {}) {
        this.show(message, { ...options, type: 'error' });
    }

    warning(message, options = {}) {
        this.show(message, { ...options, type: 'warning' });
    }

    info(message, options = {}) {
        this.show(message, { ...options, type: 'info' });
    }

    /**
     * 关闭 Toast（幂等、安全）
     */
    close() {
        // ✅ 清 timer，防止旧回调误触发
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        if (this.toastInstance) {
            this.toastInstance.unmount();
            this.toastInstance = null;
        }

        if (this.container && document.body.contains(this.container)) {
            document.body.removeChild(this.container);
            this.container = null;
        }
    }
}

export default new Toast();
