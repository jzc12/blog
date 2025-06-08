<template>
  <transition name="fade">
    <div v-show="isVisible" class="back-to-top" @click="scrollToTop">
      <component :is="iconMap.up" class="icon" />
    </div>
  </transition>
</template>

<script>
import { icons } from '../utils/icon.js';

export default {
  name: 'BackToTopButton',
  props: {
    targetRef: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      isVisible: false,
      scrollElement: null
    };
  },
  watch: {
    targetRef: {
      handler(newVal, oldVal) {
        if (oldVal) {
          oldVal.removeEventListener('scroll', this.handleScroll);
        }
        if (newVal) {
          this.scrollElement = newVal;
          newVal.addEventListener('scroll', this.handleScroll);
        } else {
          this.scrollElement = window;
          window.addEventListener('scroll', this.handleScroll);
        }
      },
      immediate: true
    }
  },
  beforeUnmount() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    handleScroll() {
      this.isVisible = this.scrollElement.scrollTop > 400;
    },
    scrollToTop() {
      this.scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
  },
  computed: {
    iconMap() {
      return icons;
    }
  },
};

</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 80px;
  background-color: #93b9ea; 
  color: #fff;
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

.back-to-top:hover {
  opacity: 1;
  transform: translateY(-4px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style> 