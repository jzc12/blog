<template>
  <div class="message-list">
    <div v-if="messages.length === 0" class="no-messages">
      还没有留言，来做第一个留言的人吧！
    </div>
    <div v-else class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message-item">
        <div class="message-content">
          <div class="message-header">
            <span class="user-name">{{ message.username }}</span>
            <span class="message-date">{{ formatDate(message.created_at) }}</span>
          </div>
          <div class="message-text">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MessageList',
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  },
  watch: {
    messages: {
      handler() {
        this.scrollToBottom();
      },
      deep: true
    }
  },
  mounted() {
    this.scrollToBottom();
  }
}
</script>

<style scoped>
@import '../css/message-list.css'
</style>
