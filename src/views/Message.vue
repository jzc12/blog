<template>
  <div class="message-page">
    <div class="message-container">
      <div class="controls">
        <button 
          class="refresh-btn"
          @click="loadMessages"
          :disabled="isLoading"
          :title="'刷新留言'"
        >
          {{ isLoading ? '加载中...' : '刷新留言' }}
        </button>
      </div>
      <MessageList :messages="messages" />
      <div class="input-area" :class="{ 'hidden': isInputHidden }">
        <MessageForm @message-submitted="addMessage" />
      </div>
      <button 
        class="toggle-input-btn"
        @click="toggleInput"
        :title="isInputHidden ? '显示输入框' : '隐藏输入框'"
      >
        {{ isInputHidden ? 'v' : '^' }}
      </button>
    </div>
  </div>
</template>

<script>
import MessageForm from './MessageForm.vue'
import MessageList from './MessageList.vue'

export default {
  name: 'Message',
  components: {
    MessageForm,
    MessageList
  },
  data() {
    return {
      messages: [],
      isInputHidden: false,
      isLoading: false
    }
  },
  methods: {
    async addMessage(message) {
      try {
        // 先获取最新的消息
        await this.loadMessages();
        
        // 添加新消息
        this.messages.unshift(message);
        
        // 保存到文件
        await this.saveMessages();
        
      } catch (error) {
        console.error('Error adding message:', error);
        alert('发送消息失败，请稍后重试');
      }
    },
    async saveMessages() {
      try {
        const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/public/data/messages.json', {
          method: 'PUT',
          headers: {
            'Authorization': `token YOUR_GITHUB_TOKEN`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Update messages',
            content: btoa(JSON.stringify(this.messages)),
            sha: this.currentSha
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save messages');
        }
        
        const data = await response.json();
        this.currentSha = data.content.sha;
      } catch (error) {
        console.error('Error saving messages:', error);
        throw error;
      }
    },
    async loadMessages() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      try {
        const response = await fetch('/data/messages.json');
        if (!response.ok) {
          throw new Error('Failed to load messages');
        }
        const messages = await response.json();
        this.messages = messages;
      } catch (error) {
        console.error('Error loading messages:', error);
        alert('加载消息失败，请稍后重试');
      } finally {
        this.isLoading = false;
      }
    },
    toggleInput() {
      this.isInputHidden = !this.isInputHidden;
    }
  },
  created() {
    this.loadMessages();
  }
}
</script>

<style scoped>
.message-page {
  height: calc(100vh - 4rem);
  padding: 2rem;
}

.message-container {
  position: relative;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.controls {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #eee;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #357abd;
}

.refresh-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.input-area {
  position: sticky;
  bottom: 0;
  background: #ffffff;
  transition: transform 0.3s ease;
  border-top: 1px solid #eee;
}

.input-area.hidden {
  transform: translateY(100%);
}

.toggle-input-btn {
  position: absolute;
  bottom: 100%;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  z-index: 10;
}

.toggle-input-btn:hover {
  background: #357abd;
}
</style> 