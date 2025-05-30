<template>
  <div class="message-form">
    <div v-if="isLimitReached" class="limit-warning">
      今日留言已达上限（20条），请明天再来留言
    </div>
    <form v-else @submit.prevent="submitMessage" class="form-container">
      <input 
        type="text" 
        v-model="message.name" 
        required 
        placeholder="昵称"
        class="name-input"
      >
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
        今日剩余留言次数：{{ remainingMessages }}
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MessageForm',
  data() {
    return {
      message: {
        name: '',
        content: '',
        date: null
      },
      dailyLimit: 20
    }
  },
  computed: {
    todayMessages() {
      const today = new Date().toLocaleDateString();
      const messages = JSON.parse(localStorage.getItem('blog-messages') || '[]');
      return messages.filter(msg => {
        const msgDate = new Date(msg.date).toLocaleDateString();
        return msgDate === today;
      }).length;
    },
    remainingMessages() {
      return Math.max(0, this.dailyLimit - this.todayMessages);
    },
    isLimitReached() {
      return this.todayMessages >= this.dailyLimit;
    }
  },
  methods: {
    submitMessage() {
      if (this.isLimitReached || !this.message.content.trim()) {
        return;
      }
      
      this.message.date = new Date().toISOString();
      this.$emit('message-submitted', { ...this.message });
      
      this.message.content = '';
      this.$nextTick(() => {
        this.$refs.contentInput.style.height = 'auto';
      });
    },
    handleEnter(e) {
      if (e.shiftKey) {
        return;
      }
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
  },
  beforeUnmount() {
    this.$refs.contentInput.removeEventListener('input', this.adjustTextareaHeight);
  }
}
</script>

<style scoped>
.message-form {
  background: #ffffff;
  padding: 1rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name-input {
  width: 120px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.content-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: none;
  max-height: 150px;
  overflow-y: auto;
}

.content-input:focus {
  outline: none;
  border-color: #4a90e2;
}

.submit-btn {
  background-color: #4a90e2;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 40px;
  display: flex;
  align-items: center;
}

.submit-btn:hover {
  background-color: #357abd;
}

.message-info {
  color: #666;
  font-size: 0.8rem;
  text-align: right;
}

.limit-warning {
  text-align: center;
  padding: 0.5rem;
  background-color: #fff3cd;
  color: #856404;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style> 