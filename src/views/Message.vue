<template>
  <div class="message-page">
    <div class="message-container">
      <div class="controls">
        <div class="text">
          <p>欢迎留言！私信不会显示，但是我会收到</p>
        </div>
        <div class="control-group">
          <button 
            class="refresh-btn"
            @click="loadMessages"
            :disabled="isLoading"
            :title="'刷新留言'"
          >
            <component :is="isLoading ? iconMap.loading : iconMap.refresh" class="icon" />
          </button>
        </div>
      </div>
      <MessageList :messages="messages" />
      <div class="input-area" :class="{ 'hidden': isInputHidden }">
        <MessageForm 
          v-if="!isInputHidden" 
          ref="messageForm"
          @message-submitted="addMessage" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import MessageForm from './MessageForm.vue'
import MessageList from './MessageList.vue'
import { addMessage, getAllMessages } from '../utils/supabase'
import { icons } from '../utils/icon.js';

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
        const success = await addMessage(message)
        if (success) {
          await this.loadMessages()
          if (this.$refs.messageForm) {
            await this.$refs.messageForm.fetchTodayCount()
          }
        } else {
          alert('发送消息失败，请稍后重试')
        }
      } catch (error) {
        console.error('发送消息失败：', error)
        alert('发送消息失败，请稍后重试')
      }
    },
    async loadMessages() {
      if (this.isLoading) return
      this.isLoading = true
      try {
        const data = await getAllMessages()
        this.messages = data
        if (this.$refs.messageForm) {
          await this.$refs.messageForm.fetchTodayCount()
        }
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
  },
  computed: {
    iconMap() {
      return icons;
    }
  },
}
</script>

<style scoped>
@import '../css/message.css';
</style>

