<template>
  <div class="message-list">
    <div v-if="messages.length === 0" class="no-messages">
      <i class="far fa-comments"></i>
      还没有留言，来做第一个留言的人吧！
    </div>
    <div v-else class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message-item">
        <div class="message-content">
          <div class="message-header">
            <span class="user-name">{{ message.username }}</span>
            <span class="message-date">{{ formatDate(message.created_at) }}</span>
          </div>
          <div class="message-text">{{ message.content }}</div>
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
      const now = new Date();
      const diff = now - date;
      
      // 如果是今天的消息，只显示时间
      if (diff < 24 * 60 * 60 * 1000 && 
          date.getDate() === now.getDate()) {
        return date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // 如果是最近7天的消息，显示星期几
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekdays[date.getDay()] + ' ' + 
               date.toLocaleTimeString('zh-CN', {
                 hour: '2-digit',
                 minute: '2-digit'
               });
      }
      
      // 其他情况显示完整日期
      return date.toLocaleDateString('zh-CN', {
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
@import '../css/message-list.css';
</style>
