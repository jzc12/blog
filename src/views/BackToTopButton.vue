// ========================== 返回顶部按钮组件 ==============================
<template>
  <!-- 淡入淡出过渡效果 -->
  <transition name="fade">
    <!-- 返回顶部按钮 -->
    <div v-show="isVisible" class="back-to-top" @click="scrollToTop">
      <component :is="iconMap.up" class="icon" />
    </div>
  </transition>
</template>

<script>
// ========================== 依赖导入 ==============================
import { icons } from '../utils/icon.js';

export default {
  name: 'BackToTopButton',

  // ========================== 组件属性定义 ==============================
  props: {
    // 目标滚动容器引用
    targetRef: {
      type: Object,
      required: false
    }
  },

  // ========================== 组件数据 ==============================
  data() {
    return {
      isVisible: false,      // 按钮显示状态
      scrollElement: null    // 滚动容器元素
    };
  },

  // ========================== 侦听器 ==============================
  watch: {
    // 监听目标容器变化，更新滚动事件监听
    targetRef: {
      handler(newVal, oldVal) {
        // 移除旧容器的滚动监听
        if (oldVal) {
          oldVal.removeEventListener('scroll', this.handleScroll);
        }
        // 添加新容器的滚动监听
        if (newVal) {
          this.scrollElement = newVal;
          newVal.addEventListener('scroll', this.handleScroll);
        } else {
          // 如果没有指定容器，则监听窗口滚动
          this.scrollElement = window;
          window.addEventListener('scroll', this.handleScroll);
        }
      },
      immediate: true
    }
  },

  // ========================== 生命周期钩子 ==============================
  beforeUnmount() {
    // 组件卸载前移除滚动监听
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.handleScroll);
    }
  },

  // ========================== 方法定义 ==============================
  methods: {
    // 处理滚动事件，控制按钮显示
    handleScroll() {
      this.isVisible = this.scrollElement.scrollTop > 400;
    },

    // 滚动到顶部
    scrollToTop() {
      this.scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  // ========================== 计算属性 ==============================
  computed: {
    // 图标映射
    iconMap() {
      return icons;
    }
  },
};
</script>

<style scoped>
/* ========================== 按钮基础样式 ============================== */
.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 40px;
  background-color: #93b9ea77;
  color: #ffffff77;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 999;
}

/* 按钮悬停效果 */
.back-to-top:hover {
  opacity: 1;
  transform: translateY(-4px);
}

/* ========================== 过渡动画 ============================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>