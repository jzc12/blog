<template>
  <div class="message-page">
    <div class="message-container">
      <MessageList :messages="messages" />
      <div class="input-area" :class="{ 'hidden': isInputHidden }">
        <MessageForm @message-submitted="addMessage" />
      </div>
      <button 
        class="toggle-input-btn"
        @click="toggleInput"
        :title="isInputHidden ? '显示输入框' : '隐藏输入框'"
      >
        {{ isInputHidden ? '↑' : '↓' }}
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
      isInputHidden: false
    }
  },
  methods: {
    addMessage(message) {
      // In a real application, you would typically send this to a backend
      // For now, we'll just add it to the local array
      this.messages.unshift(message);
      
      // Save to localStorage
      this.saveMessages();
    },
    saveMessages() {
      localStorage.setItem('blog-messages', JSON.stringify(this.messages));
    },
    loadMessages() {
      const savedMessages = localStorage.getItem('blog-messages');
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);
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