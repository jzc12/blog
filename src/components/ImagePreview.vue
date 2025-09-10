<template>
    <div v-if="visible" class="image-overlay" @click="close">
        <img :src="images[currentIndex]" class="preview-img" />
    </div>
</template>

<script>
export default {
    name: "ImagePreview",
    data() {
        return {
            visible: false,
            images: [],
            currentIndex: 0
        };
    },
    methods: {
        open(images, index = 0) {
            this.images = images;
            this.currentIndex = index;
            this.visible = true;
        },
        close() {
            this.visible = false;
            this.images = [];
            this.currentIndex = 0;
        },
        next() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
            } else {
                this.$emit("edge", "last"); // 到最后一张
            }
        },
        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.$emit("edge", "first"); // 到第一张
            }
        }
    },
    mounted() {
        document.addEventListener("keydown", (e) => {
            if (!this.visible) return;
            if (e.key === "Escape") this.close();
            if (e.key === "ArrowRight") this.next();
            if (e.key === "ArrowLeft") this.prev();
        });
    }
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
}

.preview-img {
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    cursor: zoom-out;
    transition: transform 0.3s ease;
}
</style>
