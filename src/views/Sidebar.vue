<template>
    <div class="sidebar-container">
  
      <div class="info-card visitor-card">
        <h3>访问统计</h3>
  
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
  
        <!-- 地区（国家） -->
        <div class="info-item">
          <div class="info-content">
            <div class="info-label">国家/地区</div>
            <div class="info-value">
              <span v-if="loadingVisitorInfo">加载中...</span>
              <span v-else>{{ visitorInfo.country }}（{{ isDomestic ? '国内' : '国外' }}）</span>
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
          country: '',
          region: '',
          city: ''
        },
        isDomestic: false,  // 是否是国内访客
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
          const ipRes = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipRes.json();
          this.visitorInfo.ip = ipData.ip;
  
          const locationRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
          const loc = await locationRes.json();
  
          this.visitorInfo.country = loc.country_name || '未知';
          this.visitorInfo.region = loc.region || '未知';
          this.visitorInfo.city = loc.city || '未知';
  
          // 判断是否为国内（例如中国）
          this.isDomestic = loc.country === 'CN' || loc.country_name === 'China';
  
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