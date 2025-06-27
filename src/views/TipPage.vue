// ========================== 打赏页面组件 ==============================
<template>
    <!-- 打赏页面主容器 -->
    <div class="tip-page-container">
        <!-- 感谢文字 -->
        <p class="thank-you-text">感谢您的支持和鼓励</p>

        <!-- 二维码展示区域 -->
        <div class="qr-codes">
            <!-- 微信支付二维码 -->
            <div class="qr-code-item">
                <img :src="wechatQR" alt="微信打赏" />
                <p>微信支付</p>
            </div>
            <!-- 支付宝二维码 -->
            <div class="qr-code-item">
                <img :src="alipayQR" alt="支付宝打赏" />
                <p>支付宝</p>
            </div>
        </div>

        <!-- 返回按钮 -->
        <button @click="goBack" class="back-button">
            <i class="fas fa-arrow-left"></i> 返回文章
        </button>
    </div>
    <!-- 页面底部说明文字 -->
    <div class="tip-page-footer">
        <p>
            需要的话可以联系我部署您的个人博客
            获取我部署博客的详细记录文档<br>
            也可以对具体文章的内容进行更深的交流
        </p>
    </div>
</template>
  
<script>
// ========================== 依赖导入 ==============================
import { useRouter } from 'vue-router';
import wechatQR from '../assets/weichat.png';    // 微信支付二维码图片
import alipayQR from '../assets/alipay.png';      // 支付宝二维码图片

export default {
    name: 'TipPage',

    // ========================== 组件逻辑 ==============================
    setup() {
        const router = useRouter();

        // 返回上一页方法
        const goBack = () => {
            router.go(-1);
        };

        // ========================== 返回数据 ==============================
        return {
            goBack,          // 返回方法
            wechatQR,        // 微信二维码
            alipayQR,        // 支付宝二维码
        };
    },
};
</script>
  
<style scoped>
/* ========================== 样式导入 ============================== */
@import '../css/tipPage.css';

/* ========================== 动画效果 ============================== */
/* 感谢文字淡入动画 */
.thank-you-text {
    animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ========================== 布局调整 ============================== */
/* 返回按钮图标对齐 */
.back-button i {
    margin-right: 8px;
}
</style> 