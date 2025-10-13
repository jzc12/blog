import{o as r,c as s,a}from"./index-da788299.js";const o="/blog/assets/排序基本概念-d72521a4.png",e="/blog/assets/插入排序-8ef654de.png",i="/blog/assets/直接插入排序-c0397dd0.png",p="/blog/assets/折半插入排序-c4bc799f.png",c="/blog/assets/希尔排序图示-d7f94f35.png",d={class:"markdown-body"},_="2025-10-07T00:00:00.000Z",j="2025-10-07T00:00:00.000Z",f="考研复习",u="数据结构8排序",y={__name:"数据结构_4",setup(h,{expose:n}){return n({frontmatter:{date:"2025-10-07T00:00:00.000Z",updated:"2025-10-07T00:00:00.000Z",category:"考研复习",summary:"数据结构8排序"}}),(g,t)=>(r(),s("div",d,t[0]||(t[0]=[a('<h2>基本概念</h2><p><img src="'+o+'" alt="排序基本概念"></p><h2>插入排序</h2><p><img src="'+e+`" alt="插入排序"></p><h3>直接插入排序</h3><pre><code class="language-c++">// 不带哨兵形式
void insertionSort(int arr[], int n) {
    for (int i = 1; i &lt; n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j &gt;= 0 &amp;&amp; arr[j] &gt; key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
</code></pre><p><img src="`+i+'" alt="直接插入排序"></p><h3>折半插入排序</h3><p><img src="'+p+'" alt="折半插入排序"></p><h3>希尔排序</h3><p><img src="'+c+`" alt="希尔排序图示"></p><pre><code class="language-c++">void shellSort(int arr[], int n) {
    for (int d = n / 2; d &gt; 0; d = d / 2) {  // 增量序列
        for (int i = d; i &lt; n; i++) {        // 从第d个元素开始
            int temp = arr[i];               // 待插入元素
            int j;
            // 对子序列进行插入排序
            for (j = i; j &gt;= d &amp;&amp; arr[j - d] &gt; temp; j -= d) {
                arr[j] = arr[j - d];         // 元素后移
            }
            arr[j] = temp;                   // 插入正确位置
        }
    }
}
</code></pre><h2>交换排序</h2><h3>冒泡排序</h3><h3>快速排序</h3><h2>选择排序</h2><h3>简单选择排序</h3><h3>堆排序</h3><h2>归并排序</h2><h2>基数排序</h2><h2>外部排序</h2>`,21)])))}};export{f as category,_ as date,y as default,u as summary,j as updated};
