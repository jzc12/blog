// ========================== 留言页面组件 ==============================
<template>
  <div class="message-container">
    <!-- 控制区域 -->
    <div class="controls">
      <!-- 提示文本 -->
      <div class="text">
        <p>欢迎留言！私信不会显示，但是我会收到</p>
      </div>
      <!-- 控制按钮组 -->
      <div class="control-group">
        <!-- 排序切换按钮 -->
        <button class="control-btn" @click="toggleSort" :title="isAscending ? '切换为最新消息在前' : '切换为最早消息在前'">
          <component :is="isAscending ? iconMap.sortDesc : iconMap.sortAsc" class="icon" />
        </button>
        <!-- 刷新按钮 -->
        <button class="control-btn" @click="loadMessages" :disabled="isLoading" title="刷新留言">
          <component :is="isLoading ? iconMap.loading : iconMap.refresh" class="icon" />
        </button>
      </div>
    </div>
    <!-- 留言列表 -->
    <MessageList :messages="sortedMessages" />
    <!-- 留言输入区域 -->
    <div class="input-area">
      <MessageForm ref="messageForm" @message-submitted="addMessage" />
    </div>
  </div>
</template>

<script>
// ========================== 依赖导入 ==============================
import MessageForm from '../components/MessageForm.vue'
import MessageList from '../components/MessageList.vue'
import { addMessage, getAllMessages } from '../utils/supabase'
import { icons } from '../utils/icon.js';

export default {
  name: 'Message',

  // ========================== 组件注册 ==============================
  components: {
    MessageForm,    // 留言表单组件
    MessageList     // 留言列表组件
  },

  // ========================== 组件数据 ==============================
  data() {
    return {
      messages: [],         // 留言数据数组
      isLoading: false,     // 加载状态
      isAscending: true     // 排序方式（升序/降序）
    }
  },

  // ========================== 计算属性 ==============================
  computed: {
    // 根据排序方式对留言进行排序
    sortedMessages() {
      return [...this.messages].sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return this.isAscending ? timeA - timeB : timeB - timeA;
      });
    },
    // 图标映射
    iconMap() {
      return icons;
    }
  },

  // ========================== 方法定义 ==============================
  methods: {
    // 切换排序方式
    toggleSort() {
      this.isAscending = !this.isAscending;
    },

    // 添加新留言
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
        alert('发送消息失败，请稍后重试')
      }
    },

    // 加载所有留言
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
        alert('加载消息失败，请稍后重试')
      } finally {
        this.isLoading = false
      }
    },
  },

  // ========================== 生命周期钩子 ==============================
  created() {
    // 组件创建时加载留言数据
    this.loadMessages()
  }
}
</script>

<style scoped>
/* ========================== 样式导入 ============================== */
@import '../css/message.css';
@import '../css/icons.css';
</style>
