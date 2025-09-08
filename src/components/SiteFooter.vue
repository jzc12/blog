<template>
  <footer class="site-footer" :class="{ 'visible': showFooter }">
    <div class="footer-content">
      <p title="浏览统计">
        <component :is="iconMap.about" />{{ uniqueVisitors }}
        <component :is="iconMap.eye" />{{ totalVisits }}
      </p>
      <p class="beian-info" title="备案号">
        <img src="https://qcloudimg.tencent-cloud.cn/raw/eed02831a0e201b8d794c8282c40cf2e.png" alt="备案图标">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">黔ICP备2025055086号</a>
      </p>
      <p title="技术栈">Vue 3 + Vite + Supabase + GitHub Pages + Cloudflare</p>
    </div>
  </footer>
</template>

<script>
import { incrementSiteVisits } from '../utils/supabase'
import { icons } from '../utils/icon.js'
export default {
  name: 'SiteFooter',

  data() {
    return {
      showFooter: false,
      totalVisits: 0,
      uniqueVisitors: 0,
      isNewVisitor: false,
      loading: true
    }
  },

  computed: {
    iconMap() {
      return icons
    }
  },

  methods: {
    // ========================== Footer 相关方法 ==============================
    setupFooterScrollHandler() {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 当滚动到页面中部以下时就显示footer
        const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
        const pageIsShort = documentHeight <= windowHeight * 1.2;

        // 滚动超过50%或页面较短时显示footer
        this.showFooter = scrollPercentage > 0.5 || pageIsShort;
      };

      window.addEventListener('scroll', handleScroll);
      // 初始检查
      handleScroll();

      // 延迟再次检查，确保页面完全加载
      setTimeout(() => {
        handleScroll();
        // 如果页面很短，直接显示footer
        if (document.documentElement.scrollHeight <= window.innerHeight * 1.2) {
          this.showFooter = true;
        }
      }, 1000);
    },

    // 初始化访问统计（使用Supabase）
    async initVisitStats() {
      try {
        this.loading = true;

        // 调用Supabase函数增加访问量
        const result = await incrementSiteVisits();

        // 更新数据
        this.totalVisits = result.totalVisits;
        this.uniqueVisitors = result.uniqueVisitors;
        this.isNewVisitor = result.isNewVisitor || false;

        // 如果是新访客，输出欢迎信息
        if (result.isNewVisitor) {
          console.log('🎉 欢迎首次访问 ZC\'s Blog!');
        }

      } catch (error) {
        console.error('初始化访问统计失败:', error);
        // 降级到本地存储
        this.initLocalVisitStats();
      } finally {
        this.loading = false;
      }
    },

    // 降级方案：使用本地存储
    initLocalVisitStats() {
      const today = new Date().toDateString();
      const todayKey = `visits_${today}`;
      const totalKey = 'total_visits';
      const lastVisitKey = 'last_visit_time';
      const sessionKey = 'session_visit_counted';

      this.totalVisits = parseInt(localStorage.getItem(totalKey) || '0');
      this.uniqueVisitors = parseInt(localStorage.getItem('unique_visitors') || '0');

      // 检查是否应该增加访问量
      const shouldCount = this.shouldCountVisit(lastVisitKey, sessionKey);

      if (shouldCount) {
        // 检查是否是新访客
        this.isNewVisitor = parseInt(localStorage.getItem(totalKey) || '0') === 0;
        this.totalVisits++;
        if (this.isNewVisitor) {
          this.uniqueVisitors++;
        }

        localStorage.setItem(totalKey, this.totalVisits.toString());
        localStorage.setItem('unique_visitors', this.uniqueVisitors.toString());
        localStorage.setItem(lastVisitKey, Date.now().toString());

        // 标记本次会话已计数
        sessionStorage.setItem(sessionKey, 'true');

        // 如果是新访客，可以在控制台输出欢迎信息
        if (this.isNewVisitor) {
          console.log('🎉 欢迎首次访问 ZC\'s Blog! (本地模式)');
        }
      }

      // 清理过期的日访问量数据（保留最近7天）
      this.cleanupOldVisitData();
    },

    shouldCountVisit(lastVisitKey, sessionKey) {
      // 检查会话存储，如果本次会话已经计数则不再计数
      if (sessionStorage.getItem(sessionKey) === 'true') {
        return false;
      }

      // 获取上次访问时间
      const lastVisitTime = parseInt(localStorage.getItem(lastVisitKey) || '0');
      const currentTime = Date.now();

      // 如果是首次访问，直接计数
      if (lastVisitTime === 0) {
        return true;
      }

      // 设置最小间隔时间（30分钟）
      const minInterval = 30 * 60 * 1000; // 30分钟

      // 如果距离上次访问超过30分钟，则计数
      return (currentTime - lastVisitTime) > minInterval;
    },

    cleanupOldVisitData() {
      const keys = Object.keys(localStorage);
      const visitKeys = keys.filter(key => key.startsWith('visits_'));
      const now = new Date();

      visitKeys.forEach(key => {
        const dateStr = key.replace('visits_', '');
        const date = new Date(dateStr);
        const daysDiff = (now - date) / (1000 * 60 * 60 * 24);

        // 删除7天前的数据
        if (daysDiff > 7) {
          localStorage.removeItem(key);
        }
      });
    },

    // 获取访问统计详情（可用于调试或扩展功能）
    getVisitStats() {
      const lastVisitKey = 'last_visit_time';

      const lastVisitTime = parseInt(localStorage.getItem(lastVisitKey) || '0');
      const lastVisitDate = lastVisitTime ? new Date(lastVisitTime).toLocaleString('zh-CN') : '从未访问';

      return {
        totalVisits: this.totalVisits,
        uniqueVisitors: this.uniqueVisitors,
        lastVisitTime: lastVisitDate,
        isNewVisitor: this.isNewVisitor,
        sessionCounted: sessionStorage.getItem('session_visit_counted') === 'true',
        loading: this.loading
      };
    },

    // 重置访问统计
    resetVisitStats() {
      if (process.env.NODE_ENV === 'development') {
        // 清理本地存储
        localStorage.removeItem('total_visits');
        localStorage.removeItem('unique_visitors');
        localStorage.removeItem('visitor_id');
        const today = new Date().toDateString();
        localStorage.removeItem(`visits_${today}`);
        localStorage.removeItem('last_visit_time');
        sessionStorage.removeItem('session_visit_counted');

        this.totalVisits = 0;
        this.uniqueVisitors = 0;
        this.isNewVisitor = false;

      }
    }
  },

  mounted() {
    // 初始化访问统计
    this.initVisitStats();

    // 设置footer滚动监听
    this.setupFooterScrollHandler();

  },

  beforeUnmount() {
    // 移除footer滚动监听
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
@import "../css/footer.css";
</style>
