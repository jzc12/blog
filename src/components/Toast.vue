<template>
    <div v-if="render" class="toast" :class="[`toast--${type}`, { active: visible }]">
        {{ message }}
    </div>
</template>

<script>
export default {
    name: "Toast",
    props: {
        duration: {
            type: Number,
            default: 3000
        },
        type: {
            type: String,
            default: "info" // success / error / warning / info
        }
    },
    data() {
        return {
            render: false,
            visible: false,
            message: "",
            timer: null
        };
    },
    methods: {
        show(msg) {
            this.message = msg;

            // 1️⃣ 清理旧状态
            this._clearTimer();
            this.visible = false;
            this.render = false;

            // 2️⃣ 重建 DOM + 触发动画
            this.$nextTick(() => {
                this.render = true;
                requestAnimationFrame(() => {
                    this.visible = true;
                });
            });

            // 3️⃣ 生命周期兜底
            this.timer = setTimeout(() => {
                this.visible = false;
                this.render = false;
                this.timer = null;
            }, this.duration);
        },

        _clearTimer() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        }
    },
    beforeUnmount() {
        this._clearTimer();
    }
};
</script>

<style scoped>
/* ================= 基础样式 ================= */
.toast {
    position: fixed;
    top: 5vh;
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: var(--font-size-md);
    z-index: 4000;
    opacity: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ================= 动画 ================= */
.toast.active {
    animation: fadeInOut 2s ease forwards;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translate(-50%, -20px);
    }

    10% {
        opacity: 1;
        transform: translate(-50%, 0);
    }

    90% {
        opacity: 1;
        transform: translate(-50%, 0);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -20px);
    }
}

/* ================= 不同类型颜色 ================= */
.toast--success {
    background: rgba(82, 196, 26, 0.9);
}

.toast--error {
    background: rgba(255, 77, 79, 0.9);
}

.toast--warning {
    background: rgba(255, 215, 134, 0.9);
}

.toast--info {
    background: rgba(170, 205, 255, 0.9);
}
</style>
