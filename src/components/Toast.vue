<template>
    <div v-if="visible" class="toast">{{ message }}</div>
</template>

<script>
export default {
    name: "Toast",
    props: {
        duration: { type: Number, default: 3000 }
    },
    data() {
        return {
            visible: false,
            message: "",
            timer: null
        };
    },
    methods: {
        show(msg) {
            this.message = msg;
            this.visible = false;
            void this.$nextTick(() => {
                this.visible = true;         // 强制触发一次重渲染
            });

            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.visible = false;
            }, this.duration);
        }

    }
};
</script>

<style scoped>
.toast {
    position: fixed;
    top: 5vh;
    /* 改为显示在顶部 */
    left: 50%;
    transform: translateX(-50%);
    background: rgba(161, 230, 192, 0.8);
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 4000;
    animation: fadeInOut 2s ease forwards;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translate(-50%, -20px);
        /* 改为向上移动 */
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
        /* 改为向上移动 */
    }
}
</style>
