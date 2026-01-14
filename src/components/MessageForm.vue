<!-- ========================== 留言表单组件 ============================== -->
<template>
  <div class="message-form">
    <!-- 留言次数限制提示 -->
    <div v-if="isLimitReached" class="limit-warning">
      今日留言已达上限（20条），请明天再来留言
    </div>

    <!-- 留言表单 -->
    <form v-else @submit.prevent="submitMessage" class="form-container">
      <!-- 表单头部 -->
      <div class="form-header">
        <!-- 展开 / 收起按钮 -->
        <button type="button" class="toggle-input-btn" @click="toggleInput">
          <component :is="showInputs
            ? iconMap.squareChevronDown
            : iconMap.squareChevronUp" />
        </button>

        <!-- 随机昵称 -->
        <button v-if="showInputs" type="button" class="toggle-input-btn" @click="generateRandomName" title="随机昵称">
          <component :is="iconMap.shuffle" />
        </button>

        <!-- 用户名 -->
        <input v-if="showInputs" v-model="message.username" type="text" required placeholder="昵称" class="name-input" />

        <!-- 邮箱 -->
        <input v-if="showInputs" v-model="message.email" type="email" placeholder="邮箱（可选）" class="email-input" />
      </div>

      <!-- 输入区 -->
      <div v-if="showInputs" class="input-group">
        <!-- 私信 -->
        <label class="private-toggle">
          <input type="checkbox" v-model="message.private_message" />
          <span class="toggle-label">私信</span>
        </label>

        <!-- 内容 -->
        <textarea ref="contentInput" v-model="message.content" required rows="1" placeholder="输入留言内容..."
          class="content-input" @input="adjustTextareaHeight" @keydown.enter.prevent="handleEnter"></textarea>

        <!-- 提交 -->
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

// ========================== 随机昵称数据 ==============================
const adjectives = [
  '快乐的', '可爱的', '聪明的', '温柔的', '活泼的', '优雅的',
  '善良的', '开朗的', '文静的', '机智的', '幽默的', '热情的'
]

const nouns = [
  '小猫', '小狗', '小兔', '小鸟', '小熊', '小鹿',
  '小象', '小狐狸', '小松鼠', '小浣熊', '小海豚', '小企鹅'
]

export default {
  name: 'MessageForm',

  data() {
    return {
      showInputs: false, // ✅ 初始化为折叠状态
      message: {
        username: '',
        content: '',
        email: '',
        private_message: false
      },
      dailyLimit: 20,
      todayCount: 0,
      isLoadingCount: false
    }
  },

  computed: {
    remainingMessages() {
      return Math.max(0, this.dailyLimit - this.todayCount)
    },
    isLimitReached() {
      return this.remainingMessages <= 0
    },
    iconMap() {
      return icons
    }
  },

  methods: {
    toggleInput() {
      this.showInputs = !this.showInputs
    },

    generateRandomName() {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      this.message.username = adj + noun
    },

    async fetchTodayCount() {
      this.isLoadingCount = true
      this.todayCount = await getTodayMessageCount()
      this.isLoadingCount = false
    },

    async submitMessage() {
      if (this.isLimitReached || !this.message.content.trim()) return

      this.$emit('message-submitted', { ...this.message })

      this.message.content = ''
      this.message.private_message = false

      this.$nextTick(() => {
        if (this.$refs.contentInput) {
          this.$refs.contentInput.style.height = 'auto'
        }
      })

      await this.fetchTodayCount()
    },

    handleEnter(e) {
      if (e.shiftKey) return
      this.submitMessage()
    },

    adjustTextareaHeight() {
      const el = this.$refs.contentInput
      if (!el) return
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  },

  mounted() {
    this.fetchTodayCount()
  }
}
</script>

<style scoped>
@import '../css/message-form.css';
@import '../css/icons.css';
</style>
