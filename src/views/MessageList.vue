<template>
  <div class="message-list">
    <div v-if="messages.length === 0" class="no-messages">
      还没有留言，来做第一个留言的人吧！
    </div>
    <div v-else class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message-item">
        <div class="message-content">
          <div class="message-header">
            <span class="user-name">{{ message.name }}</span>
            <span class="message-date">{{ formatDate(message.date) }}</span>
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
.message-list {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.no-messages {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f5f5f577;
  margin: 1rem;
  border-radius: 8px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}

.message-item {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}

.message-content {
  max-width: 80%;
  background: #f0f2f5;
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: #4a90e2;
  font-size: 0.9rem;
}

.message-date {
  color: #666;
  font-size: 0.8rem;
}

.message-text {
  color: #ba9d9ddd;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 自定义滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f17a;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 