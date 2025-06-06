<template>
  <li>
    <div class="outline-item-wrapper" 
       :class="`level-${heading.level}`" 
       @dblclick.stop="toggleExpand(heading)"
       @click="emitScrollTo(heading.id)">
      <span
      v-if="heading.children && heading.children.length > 0"
      class="toggle-icon"
      @click.stop="toggleExpand(heading)"
      >
      <component :is="heading.expanded ? iconMap.minus : iconMap.chevronDown" class="icon-outline"  />
      </span>
      <a>{{ heading.text }}</a>
    </div>
    <ul v-if="heading.expanded && heading.children && heading.children.length > 0" class="outline-list nested">
      <OutlineItem
        v-for="child in heading.children"
        :key="child.id"
        :heading="child"
        @scroll-to="emitScrollTo"
      />
    </ul>
  </li>
</template>

<script>
import { icons } from '../utils/icon.js';

export default {
  name: 'OutlineItem', 
  props: { 
    heading: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggleExpand(heading) {
      heading.expanded = !heading.expanded;
    },
    // 向父组件发送信息，触发滚动
    emitScrollTo(id) {
      this.$emit('scroll-to', id);
    }
  },
  computed: {
    iconMap() {
      return icons;
    }
  },
}
</script>

<style scoped>
@import '../css/outline.css'
</style> 