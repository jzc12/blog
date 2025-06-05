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
      // Use a simple local toggle, if you need global state, use Pinia/Vuex
      heading.expanded = !heading.expanded;
    },
    emitScrollTo(id) {
      this.$emit('scroll-to', id);
    }
  }
}
</script>

<style scoped>
/* Add scoped styles here if needed, or put them in outline.css */
.outline-item-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.toggle-icon {
  margin-right: 5px;
  cursor: pointer;
  user-select: none; /* Prevent text selection */
  font-size: 0.8em;
  width: 1em;
  text-align: center;
}

.outline-list.nested {
  margin-left: 15px; /* Indent nested lists */
  list-style: none;
  padding: 0;
}

a {
  text-decoration: none;
  color: #5c8dee; /* Match the color from outline.css */
}

a:hover {
  text-decoration: underline;
}

/* Indentation for different heading levels - can be moved to outline.css */
.level-1 .outline-item-wrapper {
  padding-left: 0;
  font-weight: bold;
}

.level-2 .outline-item-wrapper {
  padding-left: 15px;
}

.level-3 .outline-item-wrapper {
  padding-left: 30px;
}

.level-4 .outline-item-wrapper {
  padding-left: 45px;
}

.level-5 .outline-item-wrapper {
  padding-left: 60px;
}

.level-6 .outline-item-wrapper {
  padding-left: 75px;
}
</style> 