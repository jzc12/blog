<template>
    <div class="sidebar-container">
  
      <div class="info-card visitor-card">
          <h3>访客信息</h3>

          <!-- IP 地址 -->
          <div class="info-item">
            <div class="info-content">
              <div class="info-label">当前访客 IP</div>
              <div class="info-value">
                <span v-if="loadingVisitorInfo">加载中...</span>
                <span v-else>{{ visitorInfo.ip }}</span>
              </div>
            </div>
          </div>
  
          <!-- 运营商 -->
          <div class="info-item">
            <div class="info-content">
              <div class="info-label">运营商</div>
              <div class="info-value">
                <span v-if="loadingVisitorInfo">加载中...</span>
                <span v-else>{{ visitorInfo.owner }}</span>
              </div>
            </div>
          </div>
  
          <!-- 城市 / 省份 -->
          <div class="info-item">
            <div class="info-content">
              <div class="info-label">省份 / 城市</div>
              <div class="info-value">
                <span v-if="loadingVisitorInfo">加载中...</span>
                <span v-else>{{ visitorInfo.region }} / {{ visitorInfo.city }}</span>
              </div>
            </div>
          </div>
      </div>
  
      <div class="info-card article-info">
        <h3>文章信息</h3>
        <div class="info-item">
          <div class="info-content">
            <div class="info-label">字数</div>
            <div class="info-value">{{ wordCount }}字</div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-content">
            <div class="info-label">预计阅读</div>
            <div class="info-value">{{ readingTime }}分钟</div>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loadingVisitorInfo: true,
        visitorInfo: {
          ip: '获取中...',
          owner: '',
          region: '',
          city: ''
        },
        currentTime: '',
        wordCount: 0,
        readingTime: 0,
        timeInterval: null
      }
    },
    watch: {
      content: {
        handler(newContent) {
          if (newContent) this.calculateReadingTime(newContent)
        },
        immediate: true
      }
    },
    methods: {
            async fetchVisitorInfo() {
        try {
          const ipRes = await fetch('https://qifu-api.baidubce.com/ip/local/geo/v1/district');
          const ipData = await ipRes.json();
          this.visitorInfo.ip = ipData.ip;
          const loc = ipData.data;

          this.visitorInfo.owner = loc.owner || '未知';
          this.visitorInfo.region = loc.prov || '未知';
          this.visitorInfo.city = loc.city || '未知';
  
        } catch (err) {
          console.error('获取访客信息失败', err);
          this.visitorInfo = {
            ip: '无法获取',
            country: '未知',
            region: '未知',
            city: '未知'
          };
        } finally {
          this.loadingVisitorInfo = false;
        }
      },
  
      calculateReadingTime(content) {
        const textOnly = content.replace(/<[^>]*>/g, '');
        this.wordCount = textOnly.length;
        this.readingTime = Math.ceil(this.wordCount / 500);
      },
  
      updateCurrentTime() {
        const now = new Date();
        this.currentTime = now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    },
    mounted() {
      this.fetchVisitorInfo();
      this.updateCurrentTime();
      this.timeInterval = setInterval(this.updateCurrentTime, 1000);
    },
    beforeUnmount() {
      clearInterval(this.timeInterval);
    }
  }
  </script>
  

<style scoped>
@import '../css/sidebar.css';
</style> 