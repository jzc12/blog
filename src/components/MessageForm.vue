// ========================== 留言表单组件 ==============================
<template>
  <div class="message-form">
    <!-- 留言次数限制提示 -->
    <div v-if="isLimitReached" class="limit-warning">
      今日留言已达上限（20条），请明天再来留言
    </div>

    <!-- 留言表单 -->
    <form v-else @submit.prevent="submitMessage" class="form-container">
      <!-- 表单头部：包含用户信息输入和控制按钮 -->
      <div class="form-header">
        <!-- 展开/收起输入区域按钮 -->
        <button type="button" class="toggle-input-btn" @click="showInputs = !showInputs">
          <component :is="showInputs ? iconMap.squareChevronDown : iconMap.squareChevronUp" />
        </button>

        <!-- 随机昵称生成按钮 -->
        <button type="button" class="toggle-input-btn" @click="generateRandomName" v-if="showInputs" title="随机昵称">
          <component :is="iconMap.shuffle" />
        </button>


        <!-- 用户名输入框 -->
        <input v-if="showInputs" type="text" v-model="message.username" required placeholder="昵称" class="name-input">

        <input v-if="showInputs" v-model="message.email" placeholder="邮箱（可选）" type="email" class="email-input" />

      </div>

      <!-- 留言内容输入区域 -->
      <div v-if="showInputs" class="input-group">

        <!-- 私信开关 -->
        <label class="private-toggle" v-if="showInputs">
          <input type="checkbox" v-model="message.private_message">
          <span class="toggle-label">私信</span>
        </label>

        <textarea v-model="message.content" required rows="1" placeholder="输入留言内容..." class="content-input"
          @keydown.enter.prevent="handleEnter" ref="contentInput"></textarea>

        <!-- 提交按钮 -->
        <button type="submit" class="submit-btn">
          发送
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// ========================== 依赖导入 ==============================
import { getTodayMessageCount } from '../utils/supabase.js'
import { icons } from '../utils/icon.js'

// ========================== 随机昵称生成数据 ==============================
const adjectives = ['快乐的', '可爱的', '聪明的', '温柔的', '活泼的', '优雅的', '善良的', '开朗的', '文静的', '机智的', '幽默的', '热情的'];
const nouns = ['小猫', '小狗', '小兔', '小鸟', '小熊', '小鹿', '小象', '小狐狸', '小松鼠', '小浣熊', '小海豚', '小企鹅'];

export default {
  name: 'MessageForm',

  // ========================== 组件数据 ==============================
  data() {
    return {
      showInputs: true,              // 输入区域显示状态
      message: {                     // 留言信息
        username: '',                // 用户名
        content: '',                 // 留言内容
        email: '',                   // 用户邮箱
        private_message: false       // 是否私信
      },
      dailyLimit: 20,                // 每日留言限制
      todayCount: 0,                 // 今日已发送留言数
      isLoadingCount: false          // 是否正在加载计数
    }
  },

  // ========================== 计算属性 ==============================
  computed: {
    // 计算剩余可留言次数
    remainingMessages() {
      return Math.max(0, this.dailyLimit - this.todayCount)
    },
    // 判断是否达到留言限制
    isLimitReached() {
      return this.remainingMessages <= 0
    },
    // 图标映射
    iconMap() {
      return icons
    }
  },

  // ========================== 方法定义 ==============================
  methods: {
    // 生成随机昵称
    generateRandomName() {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      this.message.username = adjective + noun;
    },

    // 获取今日留言计数
    async fetchTodayCount() {
      this.isLoadingCount = true
      this.todayCount = await getTodayMessageCount()
      this.isLoadingCount = false
    },

    // 提交留言
    async submitMessage() {
      if (this.isLimitReached || !this.message.content.trim()) return

      this.$emit('message-submitted', { ...this.message })

      // 重置表单状态
      this.message.content = ''
      this.message.private_message = false
      this.$nextTick(() => {
        this.$refs.contentInput.style.height = 'auto'
      })

      await this.fetchTodayCount()
    },

    // 处理回车键提交
    handleEnter(e) {
      if (e.shiftKey) return
      this.submitMessage()
    },

    // 自动调整文本框高度
    adjustTextareaHeight() {
      const textarea = this.$refs.contentInput
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  },

  // ========================== 生命周期钩子 ==============================
  mounted() {
    // 初始化文本框事件监听和计数
    this.$refs.contentInput.addEventListener('input', this.adjustTextareaHeight)
    this.fetchTodayCount()
  },

  // ========================== 侦听器 ==============================
  watch: {
    // 监听输入区域显示状态变化
    showInputs(newVal) {
      this.$nextTick(() => {
        const el = this.$refs.contentInput;
        if (newVal && el) {
          el.addEventListener('input', this.adjustTextareaHeight);
        } else if (el) {
          el.removeEventListener('input', this.adjustTextareaHeight);
        }
      });
    }
  }
}
</script>

<style scoped>
/* ========================== 样式导入 ============================== */
@import '../css/message-form.css';
@import '../css/icons.css';
</style>
