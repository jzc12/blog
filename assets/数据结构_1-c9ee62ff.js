import{o as e,c as s,a as o}from"./index-a420aa95.js";const i="/blog/assets/算法数据结构-13b990ac.png",p="/blog/assets/算法基本概念-d07f80d0.png",l="/blog/assets/空间复杂度-e1d5499d.png",a="/blog/assets/线性表-a8914d0f.png",c="/blog/assets/顺序表-2eb0937b.png",r="/blog/assets/顺序表插入操作-40a67565.png",g="/blog/assets/顺序表查找-08ea13ff.png",h="/blog/assets/链式队列-80f1a6f8.png",m="/blog/assets/链式队列入队-bcd32fed.png",b="/blog/assets/链式队列出队-4f0a342c.png",_="/blog/assets/四则运算-addc7d0b.png",d="/blog/assets/二维数组-c417bef7.png",u="/blog/assets/对称矩阵-539b43cf.png",x="/blog/assets/三对角矩阵-4ed4859d.png",f="/blog/assets/稀疏矩阵-c575f3b2.png",j="/blog/assets/稀疏矩阵十字链表-de90974b.png",k="/blog/assets/KMP算法-32957998.png",v={class:"markdown-body"},y="2025-10-07T00:00:00.000Z",K="2025-10-07T00:00:00.000Z",w="考研复习",M="数据结构1234",P={__name:"数据结构_1",setup(q,{expose:n}){return n({frontmatter:{date:"2025-10-07T00:00:00.000Z",updated:"2025-10-07T00:00:00.000Z",category:"考研复习",summary:"数据结构1234"}}),(N,t)=>(e(),s("div",v,t[0]||(t[0]=[o('<h2>绪论</h2><h3>算法数据结构</h3><p><img src="'+i+'" alt="算法数据结构"></p><h3>算法基本概念</h3><p><img src="'+p+'" alt="算法基本概念"></p><h3>时间复杂度</h3><h3>空间复杂度</h3><p><img src="'+l+'" alt="空间复杂度"></p><h2>线性表</h2><p><img src="'+a+'" alt="线性表"></p><h3>顺序表</h3><p><img src="'+c+'" alt="顺序表"></p><p><img src="'+r+'" alt="顺序表插入操作"></p><p><img src="'+g+`" alt="顺序表查找"></p><h3>单链表</h3><h3>双链表</h3><h3>循环列表</h3><h3>算法</h3><h4>1、数组左右移动</h4><blockquote><p>2010年</p></blockquote><pre><code class="language-c">// 数组 R 中的元素进行左右移动，如 abcde----(左移两位)---&gt;cdeab
void Reverse(int R[], int from, int to){
    int i, temp;
    for ( i = 0; i &lt; (to - from + 1) / 2; i++ ){
        temp = R[from + i];
        R[from + i] = R[to - i];
        R[to - i] = temp;
    }
}
// 数组长度 n, 左移动 p 位 
void Converse(int R[], int n, int p){
    Reverse(R, 0, p-1);
    Reverse(R, p-1, n-1);
    Reverse(R, 0, n - 1);
}
</code></pre><h4>2、单链表的倒数第K个</h4><blockquote><p>2009年</p></blockquote><pre><code class="language-c">typedef struct LNode{
    int data;
    LNode * Next;
}LNode, *LinkList;

int Search_K(LinkList list, int k){
    LNode* p = list-&gt;Next;
    LNode* q = list-&gt;Next;
    int count = 0;
    while(p != null){
        if(count &lt; k)count++;
        else{
            q = q-&gt;Next;
	}
        p = p-&gt;Next;
    }
    if(count == k){
        // 存在
    }else{
        // 不存在
    }
}
</code></pre><h2>栈、队列、数组</h2><h3>队列</h3><blockquote><p>双端队列、顺序队列、链表队列</p></blockquote><p><img src="`+h+'" alt="链式队列"></p><p><img src="'+m+'" alt="链式队列入队"></p><p><img src="'+b+'" alt="链式队列出队"></p><blockquote><p>循环队列</p><p>rear 指向末尾元素、执行末尾元素下一个</p></blockquote><h3>栈表达式中的运用</h3><blockquote><p>！！！</p></blockquote><p><img src="'+_+'" alt="四则运算"></p><h3>特殊矩阵</h3><h4>二维数组</h4><p><img src="'+d+'" alt="二维数组"></p><h4>对称矩阵</h4><p><img src="'+u+'" alt="对称矩阵"></p><h4>三对角矩阵</h4><p><img src="'+x+'" alt="三对角矩阵"></p><h4>稀疏矩阵</h4><blockquote><p>三元组和十字链表</p></blockquote><p><img src="'+f+'" alt="稀疏矩阵"></p><p><img src="'+j+'" alt="稀疏矩阵十字链表"></p><h3>算法</h3><h4>1、四则运算匹配</h4><h4>2、括号匹配</h4><h2>串</h2><blockquote><p>模式匹配</p></blockquote><h3>KMP匹配算法</h3><p><img src="'+k+`" alt="KMP算法"></p><blockquote><ol><li>PM指的是最长前后缀，不包括本身的 1， 例如 ： “a” = 0、 “ab” = 0、“aba” = 1、“abab” = 2，方向是一样的，前面k个，和末尾的k个字符一样</li><li>next 的 -1 和 0 两种起始表达方式都代表着 ，i、j 都需要往下移动了</li><li>nextval 由 next 获得</li></ol></blockquote><pre><code class="language-c++">
/**
 * @brief 计算模式串 t 的部分匹配表（next 数组）
 * next[i] 表示：t[0..i-1] 的最长相等前后缀长度
 */
void get_next(string t, int next[]) {
    int i = 0;     // i 指向当前后缀末尾
    int j = -1;    // j 指向当前前缀末尾
    next[0] = -1;  // 初始化，表示没有相同前后缀
    while (i &lt; t.length() - 1) {
        if (j == -1 || t[i] == t[j]) {
            i++，j++;
            next[i] = j;  // 记录当前匹配到的最长前后缀长度
        } else {
            j = next[j];  // 回溯到上一个匹配位置
        }
    }
}

/**
 * @brief 改进版 next 数组（nextval），用于减少不必要的比较
 * 若 t[i] == t[next[i]]，则 nextval[i] = nextval[next[i]]，避免重复比较
 */
void get_nextval(string t, int nextval[]) {
    int i = 0;
    int j = -1;
    nextval[0] = -1;
    while (i &lt; t.length() - 1) {
        if (j == -1 || t[i] == t[j]) {
            i++， j++；
            // 当两个字符相等时，避免下次无效匹配
            if (t[i] != t[j])
                nextval[i] = j;
            else
                nextval[i] = nextval[j];
        } else {
            j = nextval[j];
        }
    }
}

/**
 * @brief KMP 字符串匹配算法
 * @param s 主串
 * @param t 模式串
 * @param next 模式串对应的 next 数组
 * @return 若匹配成功，返回匹配的起始下标（从 0 开始）；否则返回 -1
 */
int index_kmp(string s, string t, int next[]) {
    int i = 0;  // 主串指针
    int j = 0;  // 模式串指针
    while (i &lt; s.length() &amp;&amp; j &lt; t.length()) {
        if (j == -1 || s[i] == t[j]) {
            i++， j++;
        } else {
            j = next[j];  // 模式串回溯
        }
    }
    if (j == t.length()) {
        return i - j;  // 匹配成功，返回起始下标
    }
    return -1;  // 匹配失败
}


</code></pre>`,54)])))}};export{w as category,y as date,P as default,M as summary,K as updated};
