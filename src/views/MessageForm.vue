<template>
  <div class="message-form">
    <div v-if="isLimitReached" class="limit-warning">
      今日留言已达上限（20条），请明天再来留言
    </div>

    <form v-else @submit.prevent="submitMessage" class="form-container">

      <!-- form-header 始终显示，但其中的 input-group 可控制显示 -->
      <div class="form-header">
        <button type="button" class="toggle-input-btn" @click="showInputs = !showInputs">
          <component :is="showInputs ? iconMap.squareChevronDown : iconMap.squareChevronUp"/>
        </button>

        <input 
          v-if="showInputs"
          type="text" 
          v-model="message.username" 
          required 
          placeholder="昵称"
          class="name-input"
        >
        
        <button type="button" class="toggle-input-btn" @click="generateRandomName" v-if="showInputs" title="随机昵称">
          <component :is="iconMap.shuffle" />
        </button>
        
        <label class="private-toggle" v-if="showInputs">
          <input 
            type="checkbox" 
            v-model="message.private_message"
          >
          <span class="toggle-label">私信</span>
        </label>

        <div class="message-info">
          {{ isLoadingCount ? '加载中...' : `今日剩余留言次数：${remainingMessages}` }}
        </div>

      </div>

      <div v-if="showInputs" class="input-group">
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

    </form>
  </div>
</template>

<script>
import { getTodayMessageCount } from '../utils/supabase'
import { icons } from '../utils/icon.js'

const adjectives = ['快乐的', '可爱的', '聪明的', '温柔的', '活泼的', '优雅的', '善良的', '开朗的', '文静的', '机智的', '幽默的', '热情的'];
const nouns = ['小猫', '小狗', '小兔', '小鸟', '小熊', '小鹿', '小象', '小狐狸', '小松鼠', '小浣熊', '小海豚', '小企鹅'];

export default {
  name: 'MessageForm',
  data() {
    return {
      showInputs: true,
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
    generateRandomName() {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      this.message.username = adjective + noun;
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
        this.$refs.contentInput.style.height = 'auto'
      })

      await this.fetchTodayCount()
    },
    handleEnter(e) {
      if (e.shiftKey) return
      this.submitMessage()
    },
    adjustTextareaHeight() {
      const textarea = this.$refs.contentInput
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  },
  mounted() {
    this.$refs.contentInput.addEventListener('input', this.adjustTextareaHeight)
    this.fetchTodayCount()
  },
  watch: {
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
@import '../css/message-form.css';
@import '../css/icons.css';
</style>
