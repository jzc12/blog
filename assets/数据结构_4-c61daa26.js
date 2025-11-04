import{o as p,c as o,a as n}from"./index-d1127b8f.js";const a="/blog/assets/排序基本概念-d72521a4.png",r="/blog/assets/内部排序-97280afc.png",c="/blog/assets/插入排序-8ef654de.png",g="/blog/assets/直接插入排序-c0397dd0.png",e="/blog/assets/折半插入排序-c4bc799f.png",i="/blog/assets/希尔排序图示-d7f94f35.png",l="/blog/assets/冒泡排序-ccd8939d.png",m="/blog/assets/快速排序-99d36202.png",_="/blog/assets/快速排序复杂度-af1555d2.png",b="/blog/assets/简单选择排序-f4ad7e46.png",d="/blog/assets/简单选择排序分析-5d472a6a.png",h="/blog/assets/堆排序-7f94a9cf.png",f="/blog/assets/归并排序-591b2815.png",u="/blog/assets/归并排序代码-171baac4.png",k="/blog/assets/基数排序-83552b01.png",j="/blog/assets/基数排序图示-00f776fc.png",q="/blog/assets/外部排序-879fd380.png",y="/blog/assets/外部排序原理-f8c30a31.png",$="/blog/assets/外部排序时间开销-f050220b.png",T="/blog/assets/外部排序优化1-a6d2783f.png",Z="/blog/assets/外部排序优化2-ae7032fe.png",v="/blog/assets/外部排序优化3-aef385fb.png",x="/blog/assets/败者树背景-c095c75a.png",O="/blog/assets/败者树应用-8e374b94.png",S="/blog/assets/败者树-2fa50c32.png",w="/blog/assets/置换选择排序-7bce6d81.png",B="/blog/assets/置换选择排序图示-c135424a.png",E="/blog/assets/最佳归并树图示-16bd1b07.png",N="/blog/assets/多叉最佳归并树-437b8b69.png",V="/blog/assets/含虚段的最佳归并树-4e1127a4.png",z="/blog/assets/最佳归并树虚段数量-74995f95.png",A={class:"markdown-body"},H="2025-10-07T00:00:00.000Z",I="2025-10-07T00:00:00.000Z",J="考研复习",K="数据结构8排序",L={__name:"数据结构_4",setup(C,{expose:t}){return t({frontmatter:{date:"2025-10-07T00:00:00.000Z",updated:"2025-10-07T00:00:00.000Z",category:"考研复习",summary:"数据结构8排序"}}),(F,s)=>(p(),o("div",A,s[0]||(s[0]=[n('<h2>基本概念</h2><p><img src="'+a+'" alt="排序基本概念"></p><p><img src="'+r+'" alt="内部排序"></p><h2>插入排序</h2><p><img src="'+c+`" alt="插入排序"></p><h3>直接插入排序</h3><pre><code class="language-c++">// 不带哨兵形式
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
</code></pre><p><img src="`+g+'" alt="直接插入排序"></p><h3>折半插入排序</h3><p><img src="'+e+'" alt="折半插入排序"></p><h3>希尔排序</h3><p><img src="'+i+`" alt="希尔排序图示"></p><pre><code class="language-c++">void shellSort(int arr[], int n) {
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
</code></pre><h2>交换排序</h2><h3>冒泡排序</h3><p><img src="`+l+'" alt="冒泡排序"></p><blockquote><p>稳定</p><p>空间复杂度 $O(1)$</p><p>时间复杂度最好：$O(1)$、最坏：$O(n^2)$</p><p>适用于链表</p></blockquote><h3>快速排序</h3><p><img src="'+m+'" alt="快速排序"></p><p><img src="'+_+'" alt="快速排序复杂度"></p><blockquote><p>快排并不稳定，例如：2、2、1</p><p>2014年的考题、和2019年考题对一趟的定义：对尚未确定最终位置的所有元素进行一遍处理称为一趟</p><p>这样快排就满足，比如第二趟至少有两个元素确定了位置</p><p>1.两个元素至少有一个位于最左或者最右</p><p>2.若没有元素位于最左或者最右，那么至少有三个元素确定位置，因为第一趟确定一个，第二趟进行了左右的两边操作</p></blockquote><h2>选择排序</h2><h3>简单选择排序</h3><p><img src="'+b+'" alt="简单选择排序"></p><p><img src="'+d+'" alt="简单选择排序分析"></p><h3>堆排序</h3><p><img src="'+h+'" alt="堆排序"></p><blockquote><p>不稳定</p><p>插入到最后一个位置</p><p>删除，与这个节点的最后一个子节点交换，然后上下移动</p></blockquote><h2>归并排序</h2><p><img src="'+f+'" alt="归并排序"></p><p><img src="'+u+'" alt="归并排序代码"></p><h2>基数排序</h2><p><img src="'+k+'" alt="基数排序"></p><p><img src="'+j+'" alt="基数排序图示"></p><h2>外部排序</h2><p><img src="'+q+'" alt="外部排序"></p><h3>外部排序原理</h3><p><img src="'+y+'" alt="外部排序原理"></p><p><img src="'+$+'" alt="外部排序时间开销"></p><p><img src="'+T+'" alt="外部排序优化1"></p><p><img src="'+Z+'" alt="外部排序优化2"></p><p><img src="'+v+'" alt="外部排序优化3"></p><h3>败者树</h3><p><img src="'+x+'" alt="败者树背景"></p><p><img src="'+O+'" alt="败者树应用"></p><p><img src="'+S+'" alt="败者树"></p><h3>置换选择排序</h3><blockquote><p>目的是减少归并段的数量</p><p>对于 n 个数据， m 大小的缓冲区，</p><p>第一个归并段最大的长度是 n, 数据升序</p><p>第一个归并段最小的长度是m, 数据降序</p></blockquote><p><img src="'+w+'" alt="置换选择排序"></p><p><img src="'+B+'" alt="置换选择排序图示"></p><h3>最佳归并树</h3><p><img src="'+E+'" alt="最佳归并树图示"></p><blockquote><p>哈夫曼树实现</p></blockquote><p><img src="'+N+'" alt="多叉最佳归并树"></p><p><img src="'+V+'" alt="含虚段的最佳归并树"></p><p><img src="'+z+'" alt="最佳归并树虚段数量"></p>',56)])))}};export{J as category,H as date,L as default,K as summary,I as updated};
