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
        <!-- 头像 -->
        <img :src="getAvatar(message.email, message.username)" class="message-item-avatar"
          @error="onAvatarError($event)" />

        <!-- 右边内容区域 -->
        <div class="message-item-right">
          <div class="message-header">
            <!-- 用户信息 -->
            <div class="user-info">
              <span class="user-name">{{ message.username }}</span>
            </div>
          </div>

          <!-- 留言内容 -->
          <div class="message-text">{{ message.content }}</div>

          <!-- 底部信息 -->
          <div class="message-footer">
            <span class="message-date">{{ formatDate(message.created_at) }}</span>
            <button class="reply-btn" @click="handleReply(message.id)">
              <i class="far fa-comment-dots"></i>
              回复
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import md5 from 'blueimp-md5';
import toast from '@/utils/toast';
export default {
  name: 'MessageList',

  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      // 这里可以添加一些本地数据
    };
  },

  methods: {
    // 格式化日期显示（优化为更紧凑的格式）
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;

      // 1分钟内：刚刚
      if (diff < 60 * 1000) {
        return '刚刚';
      }

      // 1小时内：X分钟前
      if (diff < 60 * 60 * 1000) {
        return Math.floor(diff / (60 * 1000)) + '分钟前';
      }

      // 今天内：小时:分钟
      if (date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()) {
        return date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      // 今年内：月-日 小时:分钟
      if (date.getFullYear() === now.getFullYear()) {
        return `${date.getMonth() + 1}-${date.getDate()} ` +
          date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          });
      }

      // 其他：完整日期
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
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

    // 获取用户头像
    getAvatar(email, username) {
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const lowerEmail = email.trim().toLowerCase();
        // QQ 邮箱
        const qqMatch = lowerEmail.match(/^(\d{5,11})@qq\.com$/);
        if (qqMatch) {
          const qqNumber = qqMatch[1];
          return `https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=100`;
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

    // 回复主评论
    handleReply() {
      toast.warning("功能开发中");
    },

    // 回复子评论
    handleReplyToReply(message, reply) {
      this.$set(message, 'showReplyInput', true);
      this.$set(message, 'replyText', `@${reply.username} `);
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('.reply-input-container textarea');
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
      });
    },

    // 提交回复
    submitReply(message) {
      if (!message.replyText?.trim()) return;

      // 这里应该发送API请求，这里只是模拟
      const newReply = {
        id: Date.now(),
        username: '当前用户',
        level: 1,
        content: message.replyText,
        created_at: new Date().toISOString(),
        likes: 0
      };

      if (!message.replies) {
        this.$set(message, 'replies', []);
      }
      message.replies.push(newReply);

      // 重置回复状态
      message.showReplyInput = false;
      message.replyText = '';

      this.$emit('reply-submitted', {
        parentId: message.id,
        content: newReply.content
      });
    },

    // 取消回复
    cancelReply(message) {
      message.showReplyInput = false;
      message.replyText = '';
    },

    // 点赞
    handleLike(message) {
      if (!message.likes) {
        this.$set(message, 'likes', 0);
      }
      message.likes += 1;
      this.$emit('message-liked', { id: message.id, likes: message.likes });
    },

    // 加载更多回复
    loadMoreReplies(message) {
      this.$emit('load-more-replies', message.id);
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
/* ========================== 样式导入 ============================== */
@import '../css/message-list.css';
</style>
