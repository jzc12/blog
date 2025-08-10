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
    targetRef: {
      handler(newVal) {
        // 解绑旧事件
        if (this.scrollElement) {
          this.scrollElement.removeEventListener('scroll', this.handleScroll)
        }

        const el = newVal?.value || newVal || window
        this.scrollElement = el
        this.scrollElement.addEventListener('scroll', this.handleScroll)
        this.handleScroll()
      },
      immediate: true
    }
  },


  // ========================== 生命周期钩子 ==============================
  mounted() {
    if (this.targetRef) {
      this.scrollElement = this.targetRef;
      this.targetRef.addEventListener('scroll', this.handleScroll);
      this.handleScroll(); // 立即检查一次
    }
  },

  beforeUnmount() {
    // 组件卸载前移除滚动监听
    if (this.scrollElement && this.scrollElement !== window) {
      this.scrollElement.removeEventListener('scroll', this.handleScroll);
    } else if (this.scrollElement === window) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  },

  // ========================== 方法定义 ==============================
  methods: {
    // 处理滚动事件，控制按钮显示
    handleScroll() {
      if (this.scrollElement === window) {
        this.isVisible = window.pageYOffset > 400;
      }
    },

    // 滚动到顶部
    scrollToTop() {
      if (this.scrollElement === window) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // 如果是容器滚动
        this.scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
  bottom: 2rem;
  right: 1rem;
  float: right;
  margin-right: 0.2rem;
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