<template>
  <li>
    <!-- 大纲项容器 -->
    <div class="outline-item-wrapper" 
         :class="[
           `level-${heading.level}`,
           { active: isActive }
         ]"
         @click="handleClick"
         @dblclick.stop="toggleExpand">
      <!-- 展开/折叠图标 -->
      <span v-if="hasChildren"
            class="toggle-icon"
            @click.stop="toggleExpand"
            :title="heading.expanded ? '收起' : '展开'">
        <component :is="heading.expanded ? iconMap.minus : iconMap.chevronDown" 
                  class="icon-outline"
                  :style="{ transform: heading.expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }" />
      </span>
      <!-- 标题文本 -->
      <a :title="heading.text">{{ heading.text }}</a>
    </div>

    <!-- 子项列表 -->
    <Transition name="outline-list">
      <ul v-if="heading.expanded && hasChildren" 
          class="outline-list nested">
        <OutlineItem v-for="child in heading.children"
                    :key="child.id"
                    :heading="child"
                    :active-id="activeId"
                    @scroll-to="emitScrollTo" />
      </ul>
    </Transition>
  </li>
</template>

<script>
import { ref, computed } from 'vue';
import { icons } from '../utils/icon.js';

export default {
  name: 'OutlineItem',
  
  props: {
    heading: {
      type: Object,
      required: true
    },
    activeId: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    // 计算是否有子项
    const hasChildren = computed(() => {
      return props.heading.children && props.heading.children.length > 0;
    });

    // 计算当前项是否激活
    const isActive = computed(() => {
      return props.activeId === props.heading.id;
    });

    // 处理点击事件
    const handleClick = () => {
      emitScrollTo(props.heading.id);
    };

    // 切换展开/折叠状态
    const toggleExpand = () => {
      if (hasChildren.value) {
        props.heading.expanded = !props.heading.expanded;
      }
    };

    // 触发滚动事件
    const emitScrollTo = (id) => {
      emit('scroll-to', id);
    };

    return {
      hasChildren,
      isActive,
      handleClick,
      toggleExpand,
      emitScrollTo,
      iconMap: icons
    };
  }
};
</script>

<style scoped>
@import '../css/outline.css';

/* 本地样式覆盖 */
.outline-item-wrapper {
  -webkit-tap-highlight-color: transparent;
}

/* 确保图标垂直居中 */
.toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 优化移动端点击区域 */
@media (max-width: 768px) {
  .outline-item-wrapper {
    min-height: 36px;
  }
  
  .toggle-icon {
    min-width: 24px;
    min-height: 24px;
  }
}
</style> 