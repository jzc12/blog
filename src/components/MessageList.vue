// ========================== 留言列表组件 ==============================
<template>
  <div class="message-list">
    <!-- 空留言提示 -->
    <div v-if="messages.length === 0" class="no-messages">
      <i class="far fa-comments"></i>
      还没有留言，来做第一个留言的人吧！
    </div>
    <!-- 留言列表容器 -->
    <div v-else class="messages-container" ref="messagesContainer">
      <!-- 单条留言项 -->
      <div v-for="(message, index) in messages" :key="index" class="message-item">
        <div class="message-content">
          <!-- 留言头部：用户名和时间 -->
          <div class="message-header">
            <img :src="getAvatar(message.email, message.username)" class="avatar" @error="onAvatarError($event)" />
            <span class="user-name">{{ message.username }}</span>
            <span class="message-date">{{ formatDate(message.created_at) }}</span>
          </div>
          <!-- 留言内容 -->
          <div class="message-text">{{ message.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'blueimp-md5';
export default {
  name: 'MessageList',

  // ========================== 组件属性定义 ==============================
  props: {
    // 留言数据数组
    messages: {
      type: Array,
      default: () => []
    }
  },

  // ========================== 方法定义 ==============================
  methods: {
    // 格式化日期显示
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
    
    // 滚动到列表底部
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    // 获取用户头像，支持 QQ 邮箱、网易邮箱、Gravatar，其他用默认头像
    getAvatar(email, username) {
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const lowerEmail = email.trim().toLowerCase();
        // QQ 邮箱
        const qqMatch = lowerEmail.match(/^(\d{5,11})@qq\.com$/);
        if (qqMatch) {
          const qqNumber = qqMatch[1];
          return `https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=100`;
        }
        // 网易邮箱（163/126/yeah）
        const neteaseMatch = lowerEmail.match(/^([a-zA-Z0-9_.-]+)@(163|126|yeah)\.com$/);
        if (neteaseMatch) {
          // 网易邮箱没有公开头像API，通常用 Gravatar
          const hash = md5(lowerEmail);
          return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
        }
        // 其他邮箱，使用 Gravatar
        const hash = md5(lowerEmail);
        return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
      } else {
        const idx = username ? username.length % 4 : 0;
        return new URL(`../assets/avatar_${idx}.png`, import.meta.url).href;
      }
    },

    onAvatarError(event) {
      event.target.src = require(`../assets/avatar_0.png`);
    },
  },
  
  // ========================== 侦听器 ==============================
  watch: {
    // 监听留言列表变化，自动滚动到底部
    messages: {
      handler() {
        this.scrollToBottom();
      },
      deep: true
    }
  },
  
  // ========================== 生命周期钩子 ==============================
  mounted() {
    // 组件挂载后滚动到底部
    this.scrollToBottom();
  }
}
</script>

<style scoped>
/* ========================== 样式导入 ============================== */
@import '../css/message-list.css';
</style>
