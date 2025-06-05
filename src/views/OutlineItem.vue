<template>
  <li>
    <div class="outline-item-wrapper" :class="`level-${heading.level}`">
      <span
        v-if="heading.children && heading.children.length > 0"
        class="toggle-icon"
        @click.stop="toggleExpand(heading)"
      >
        {{ heading.expanded ? '▼' : '▶' }}
      </span>
      <a :href="`#${heading.id}`" @click.prevent="emitScrollTo(heading.id)">
        {{ heading.text }}
      </a>
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
export default {
  name: 'OutlineItem', // Important for recursive components
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
    emitScrollTo(id) {
      this.$emit('scroll-to', id);
    }
  }
}
</script>

<style scoped>
@import '../css/outline.css'
</style> 