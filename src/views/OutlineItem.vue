// ========================== 大纲项组件 ==============================
<template>
  <li>
    <!-- 大纲项容器 -->
    <div class="outline-item-wrapper" :class="[
      `level-${heading.level}`,
      { active: isActive }
    ]" @click="handleClick" @dblclick.stop="toggleExpand">
      <!-- 展开/折叠图标或占位 -->
      <span class="toggle-icon" v-if="hasChildren" @click.stop="toggleExpand" :title="heading.expanded ? '收起' : '展开'">
        <component :is="heading.expanded ? iconMap.minus : iconMap.chevronDown" class="icon-outline"
          :style="{ transform: heading.expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }" />
      </span>
      <span v-else class="toggle-icon placeholder" aria-hidden="true"></span>
      <!-- 标题文本 -->
      <a :title="heading.text">{{ heading.text }}</a>
    </div>

    <!-- 子项列表 -->
    <Transition name="outline-list">
      <ul v-if="heading.expanded && hasChildren" class="outline-list nested">
        <OutlineItem v-for="child in heading.children" :key="child.id" :heading="child" :active-id="activeId"
          @scroll-to="emitScrollTo" />
      </ul>
    </Transition>
  </li>
</template>

<script>
// ========================== 依赖导入 ==============================
import { ref, computed } from 'vue';
import { icons } from '../utils/icon.js';

export default {
  name: 'OutlineItem',
  props: {
    heading: { type: Object, required: true },
    activeId: { type: String, default: '' }
  },

  setup(props, { emit }) {
    // ========================== 计算属性 ==============================
    // 判断是否有子项
    const hasChildren = computed(() => {
      return props.heading.children && props.heading.children.length > 0;
    });

    // 判断当前项是否处于激活状态
    const isActive = computed(() => {
      return props.activeId === props.heading.id;
    });

    // ========================== 事件处理函数 ==============================
    // 处理点击事件，触发滚动到对应位置
    const handleClick = () => {
      emitScrollTo(props.heading.id);
    };

    // 切换大纲项的展开/折叠状态
    const toggleExpand = () => {
      if (hasChildren.value) {
        props.heading.expanded = !props.heading.expanded;
      }
    };

    // 触发滚动到指定标题的事件
    const emitScrollTo = (id) => {
      emit('scroll-to', id);
    };

    // ========================== 返回数据 ==============================
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
</style>