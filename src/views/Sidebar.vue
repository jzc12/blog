<template>
  <div class="sidebar-container">

    <div class="info-card visitor-card">
      <h3>访客信息</h3>

      <!-- IP 地址 -->
      <div class="info-item">
        <div class="info-content">
          <div class="info-label">
            <component :is="iconMap.earth" class="icon" />
          </div>
          <div class="info-value">
            <span v-if="loadingVisitorInfo">加载中...</span>
            <span v-else>{{ visitorInfo.ip }}</span>
          </div>
        </div>
      </div>

      <!-- 运营商 -->
      <div class="info-item">
        <div class="info-content">
          <div class="info-label">
            <component :is="iconMap.network" class="icon" />
          </div>
          <div class="info-value">
            <span v-if="loadingVisitorInfo">加载中...</span>
            <span v-else>{{ extractISP(visitorInfo.org) }}</span>
          </div>
        </div>
      </div>

      <!-- 城市 / 省份 -->
      <div class="info-item">
        <div class="info-content">
          <div class="info-label">
            <component :is="iconMap.building" class="icon" />
          </div>
          <div class="info-value">
            <span v-if="loadingVisitorInfo">加载中...</span>
            <span v-else>{{ visitorInfo.city }} / {{ visitorInfo.region }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-card article-info">
      <h3>文章信息</h3>
      <div class="info-item">
        <div class="info-content">
          <div class="info-label">
            <component :is="iconMap.library" class="icon" />
          </div>
          <div class="info-value">{{ wordCount }}字</div>
        </div>
      </div>
      <div class="info-item">
        <div class="info-content">
          <div class="info-label">
            <component :is="iconMap.clock" class="icon" />
          </div>
          <div class="info-value">{{ readingTime }}min</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { icons } from '../utils/icon.js'
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
        org: '',
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
        // 使用ipinfo.io API获取访客信息
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();

        // 更新访客信息
        this.visitorInfo = {
          ip: data.ip,
          org: data.org,
          region: data.region,
          city: data.city
        };

      } catch (err) {
        console.error('获取访客信息失败:', err);
        this.visitorInfo = {
          ip: '无法获取',
          org: '未知',
          region: '未知',
          city: '未知'
        };
      } finally {
        this.loadingVisitorInfo = false;
      }
    },

    // 从org字段提取ISP名称
    extractISP(org) {
      if (!org) return '未知';
      // 移除AS编号部分，只保留ISP名称
      return org.replace(/AS\d+\s/, '');
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
    },
  },
  mounted() {
    this.fetchVisitorInfo();
    this.updateCurrentTime();
    this.timeInterval = setInterval(this.updateCurrentTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timeInterval);
  },
  computed: {
    // 图标映射
    iconMap() {
      return icons;
    }
  },
}
</script>


<style scoped>
@import '../css/sidebar.css';
</style>