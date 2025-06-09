<template>
    <div class="tip-page-container">
        <p>感谢您的支持！</p>

        <div class="qr-codes">
            <div class="qr-code-item">
                <img :src="wechatQR" alt="微信打赏" />
                <p>微信</p>
            </div>
            <div class="qr-code-item">
                <img :src="alipayQR" alt="支付宝打赏" />
                <p>支付宝</p>
            </div>
        </div>

        <button @click="goBack" class="back-button">返回文章</button>

    </div>
    <div class="tip-page-footer">   
        需要的话可以联系我部署您的个人博客,获取我部署博客的详细记录文档<br>

        也可以对具体文章的内容进行更深的交流。
    </div>
</template>
  

  <script>
  import { useRouter } from 'vue-router';
  import wechatQR from '../assets/weichat.png';
  import alipayQR from '../assets/alipay.png';
  
  export default {
    name: 'TipPage',
    setup() {
      const router = useRouter();
  
      const goBack = () => {
        router.go(-1);
      };
  
      return {
        goBack,
        wechatQR,
        alipayQR,
      };
    },
  };
  </script>
  

<style scoped>
@import '../css/tipPage.css';
</style> 