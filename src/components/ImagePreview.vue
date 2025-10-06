<template>
    <div v-if="visible" class="image-overlay" @click.self="close">
        <!-- @click.self 只在点击 overlay 自身时触发（不冒泡） -->
        <img ref="img" :src="images[currentIndex]" class="preview-img" :style="{ transform: transformStyle }"
            @wheel.stop.prevent="onWheel" @mousedown.stop="onMouseDown" @mouseup.stop="onMouseUp"
            @mousemove.stop="onMouseMove" @dblclick.stop="resetTransform" />

        <!-- 左右切换按钮 -->
        <button class="nav-btn left" @click.stop="prev" title="上一张">
            <component :is="iconMap.chevronLeft" class="icon" />
        </button>
        <button class="nav-btn right" @click.stop="next" title="下一张">
            <component :is="iconMap.chevronRight" class="icon" />
        </button>

        <!-- 关闭按钮 -->
        <button class="close-btn" @click.stop="close" title="关闭预览">
            <component :is="iconMap.x" class="icon" />
        </button>
    </div>
</template>


<script>
import { icons } from "../utils/icon.js";

export default {
    name: "ImagePreview",
    data() {
        return {
            visible: false,
            images: [],
            currentIndex: 0,
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            // 拖动状态管理
            isDragging: false,
            dragReady: false,
            dragTimer: null,
            lastMouse: { x: 0, y: 0 },
        };
    },
    computed: {
        iconMap() {
            return icons;
        },
        transformStyle() {
            return `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
        },
    },
    methods: {
        // ==================== 基础控制 ====================
        open(images, index = 0) {
            this.images = images;
            this.currentIndex = index;
            this.visible = true;
            this.resetTransform();
        },
        close() {
            this.visible = false;
            this.images = [];
            this.currentIndex = 0;
            this.resetTransform();
        },
        next() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
                this.resetTransform();
            } else {
                this.$emit("edge", "last");
            }
        },
        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.resetTransform();
            } else {
                this.$emit("edge", "first");
            }
        },
        resetTransform() {
            this.scale = 1;
            this.offsetX = 0;
            this.offsetY = 0;
        },

        // ==================== 放大缩小 ====================
        onWheel(e) {
            const img = this.$refs.img;
            if (!img) return;

            const rect = img.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const prevScale = this.scale;
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.min(Math.max(prevScale + delta, 0.4), 2);

            const scaleRatio = newScale / prevScale;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = (e.clientX - centerX) - (e.clientX - centerX) * scaleRatio;
            const dy = (e.clientY - centerY) - (e.clientY - centerY) * scaleRatio;

            this.offsetX += dx;
            this.offsetY += dy;
            this.scale = newScale;

            this.limitOffset(); // 限制平移范围
        },

        // ==================== 拖动平移（长按生效） ====================
        onMouseDown(e) {
            if (e.button !== 0) return; // 只响应左键

            clearTimeout(this.dragTimer);
            this.isDragging = false;
            this.dragReady = false;
            this.lastMouse = { x: e.clientX, y: e.clientY };

            // 按下后等待150ms再进入拖动准备状态
            this.dragTimer = setTimeout(() => {
                this.dragReady = true;
                this.isDragging = true;
            }, 50);
        },

        onMouseMove(e) {
            if (!this.isDragging) return;

            const dx = e.clientX - this.lastMouse.x;
            const dy = e.clientY - this.lastMouse.y;
            this.offsetX += dx;
            this.offsetY += dy;
            this.lastMouse = { x: e.clientX, y: e.clientY };
            this.limitOffset();
        },

        onMouseUp(e) {
            clearTimeout(this.dragTimer);

            // 如果还没进入拖动状态，说明只是短点，不执行拖动
            if (this.dragReady) {
                this.isDragging = false;
                this.dragReady = false;
            } else {
                this.isDragging = false;
                this.dragReady = false;
            }
        },

        // ==================== 平移范围限制 ====================
        limitOffset() {
            const img = this.$refs.img;
            if (!img) return;
            const rect = img.getBoundingClientRect();
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            // 图片缩放后的宽高
            const scaledW = rect.width;
            const scaledH = rect.height;

            const maxX = Math.max((scaledW - viewportW) / 2, 0);
            const maxY = Math.max((scaledH - viewportH) / 2, 0);

            // 限制在边界内
            this.offsetX = Math.min(Math.max(this.offsetX, -maxX), maxX);
            this.offsetY = Math.min(Math.max(this.offsetY, -maxY), maxY);
        },
    },
    mounted() {
        document.addEventListener("keydown", (e) => {
            if (!this.visible) return;
            if (e.key === "Escape") this.close();
            if (e.key === "ArrowRight") this.next();
            if (e.key === "ArrowLeft") this.prev();
        });
    },
};
</script>

<style scoped>
.image-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    overflow: hidden;
    transition: background 0.3s ease;
}

.image-overlay:active {
    background: rgba(0, 0, 0, 0.9);
}


.preview-img {
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    transition: transform 0.1s ease-out;
    user-select: none;
    /* 🚫 禁止文字选择 */
    -webkit-user-drag: none;
    /* 🚫 禁止浏览器默认拖拽图片 */
    -webkit-user-select: none;
    /* 🚫 禁止 Safari 选区 */
}


/* 按钮样式 */
.nav-btn,
.close-btn {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    transition: background 0.2s;
}

.nav-btn:hover,
.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.nav-btn.left {
    left: 40px;
}

.nav-btn.right {
    right: 40px;
}

.close-btn {
    top: 40px;
    right: 40px;
}

.icon {
    width: 24px;
    height: 24px;
}
</style>
