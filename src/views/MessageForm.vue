<template>
  <div class="message-form">
    <div v-if="isLimitReached" class="limit-warning">
      今日留言已达上限（20条），请明天再来留言
    </div>
    <form v-else @submit.prevent="submitMessage" class="form-container">
      <div class="form-header">
        <input 
          type="text" 
          v-model="message.username" 
          required 
          placeholder="昵称"
          class="name-input"
        >
        <label class="private-toggle">
          <input 
            type="checkbox" 
            v-model="message.private_message"
          >
          <span class="toggle-label">私信 : 不会在主页显示，我会收到✅ </span>
        </label>
      </div>
      <div class="input-group">
        <textarea 
          v-model="message.content" 
          required 
          rows="1"
          placeholder="输入留言内容..."
          class="content-input"
          @keydown.enter.prevent="handleEnter"
          ref="contentInput"
        ></textarea>
        <button type="submit" class="submit-btn" title="发送">
          发送
        </button>
      </div>
      <div class="message-info">
        {{ isLoadingCount ? '加载中...' : `今日剩余留言次数：${remainingMessages}` }}
      </div>
    </form>
  </div>
</template>

<script>

import { getTodayMessageCount } from '../utils/supabase'

export default {
  name: 'MessageForm',
  data() {
    return {
      message: {
        username: '',
        content: '',
        private_message: false
      },
      dailyLimit: 20,
      todayCount: 0,
      isLoadingCount: false
    }
  },
  computed: {
    remainingMessages() {
      return Math.max(0, this.dailyLimit - this.todayCount);
    },
    isLimitReached() {
      return this.remainingMessages <= 0;
    }
  },
  methods: {
    async fetchTodayCount() {
      this.isLoadingCount = true;
      this.todayCount = await getTodayMessageCount();
      this.isLoadingCount = false;
    },

    async submitMessage() {
      if (this.isLimitReached || !this.message.content.trim()) {
        return;
      }

      this.$emit('message-submitted', { ...this.message });

      this.message.content = '';
      this.message.private_message = false;
      this.$nextTick(() => {
        this.$refs.contentInput.style.height = 'auto';
      });

      await this.fetchTodayCount();
    },

    handleEnter(e) {
      if (e.shiftKey) return;
      this.submitMessage();
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.contentInput;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  },

  mounted() {
    this.$refs.contentInput.addEventListener('input', this.adjustTextareaHeight);
    this.fetchTodayCount();
  },
  beforeUnmount() {
    this.$refs.contentInput.removeEventListener('input', this.adjustTextareaHeight);
  }
}
</script>


<style scoped>
@import '../css/message-form.css';
</style>

