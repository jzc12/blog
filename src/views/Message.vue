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
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mwqfbczqulrtcqjxmvud.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cWZiY3pxdWxydGNxanhtdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTgzODAsImV4cCI6MjA2NDE5NDM4MH0.e5TinPO93eKHmn2amIWynxKJ09UtBk8jL00BLPm_9kg'
const supabase = createClient(supabaseUrl, supabaseKey)

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
        // 检查今天的消息数量
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayMessages, error: countError } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .gte('created_at', today.toISOString())
          .lt('created_at', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

        if (countError) throw countError;

        if (todayMessages.length >= 20) {
          alert('今日留言已达上限（20条），请明天再来留言');
          return;
        }

        const { error } = await supabase.from('messages').insert([{
          username: message.username || '匿名',
          content: message.content
        }])
        if (error) throw error

        // 重新加载最新留言
        await this.loadMessages()
      } catch (error) {
        console.error('发送消息失败：', error)
        alert('发送消息失败，请稍后重试')
      }
    },
    async loadMessages() {
      if (this.isLoading) return
      this.isLoading = true
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.messages = data
      } catch (error) {
        console.error('加载消息失败：', error)
        alert('加载消息失败，请稍后重试')
      } finally {
        this.isLoading = false
      }
    },
    toggleInput() {
      this.isInputHidden = !this.isInputHidden
    }
  },
  created() {
    this.loadMessages()
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