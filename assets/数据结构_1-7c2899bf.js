import{o,c as n,a as e}from"./index-c06736c4.js";const p="/blog/assets/算法数据结构-13b990ac.png",c="/blog/assets/算法基本概念-d07f80d0.png",a="/blog/assets/空间复杂度-e1d5499d.png",r="/blog/assets/线性表-a8914d0f.png",i="/blog/assets/顺序表-2eb0937b.png",l="/blog/assets/顺序表插入操作-40a67565.png",g="/blog/assets/顺序表查找-08ea13ff.png",h="/blog/assets/链式队列-80f1a6f8.png",m="/blog/assets/链式队列入队-bcd32fed.png",_="/blog/assets/链式队列出队-4f0a342c.png",b="/blog/assets/四则运算-addc7d0b.png",d="/blog/assets/二维数组-c417bef7.png",u="/blog/assets/对称矩阵-539b43cf.png",f="/blog/assets/三对角矩阵-4ed4859d.png",k="/blog/assets/稀疏矩阵-c575f3b2.png",q="/blog/assets/稀疏矩阵十字链表-de90974b.png",R={class:"markdown-body"},y="2025-10-07T00:00:00.000Z",T="2025-10-07T00:00:00.000Z",Z="考研复习",w="数据结构1234",B={__name:"数据结构_1",setup(N,{expose:s}){return s({frontmatter:{date:"2025-10-07T00:00:00.000Z",updated:"2025-10-07T00:00:00.000Z",category:"考研复习",summary:"数据结构1234"}}),(v,t)=>(o(),n("div",R,t[0]||(t[0]=[e('<h2>绪论</h2><h3>算法数据结构</h3><p><img src="'+p+'" alt="算法数据结构"></p><h3>算法基本概念</h3><p><img src="'+c+'" alt="算法基本概念"></p><h3>时间复杂度</h3><h3>空间复杂度</h3><p><img src="'+a+'" alt="空间复杂度"></p><h2>线性表</h2><p><img src="'+r+'" alt="线性表"></p><h3>顺序表</h3><p><img src="'+i+'" alt="顺序表"></p><p><img src="'+l+'" alt="顺序表插入操作"></p><p><img src="'+g+`" alt="顺序表查找"></p><h3>单链表</h3><h3>双链表</h3><h3>循环列表</h3><h3>算法</h3><h4>1、数组左右移动</h4><blockquote><p>2010年</p></blockquote><pre><code class="language-c">// 数组 R 中的元素进行左右移动，如 abcde----(左移两位)---&gt;cdeab
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
</code></pre><h2>栈、队列、数组</h2><h3>队列</h3><blockquote><p>双端队列、顺序队列、链表队列</p></blockquote><p><img src="`+h+'" alt="链式队列"></p><p><img src="'+m+'" alt="链式队列入队"></p><p><img src="'+_+'" alt="链式队列出队"></p><blockquote><p>循环队列</p><p>rear 指向末尾元素、执行末尾元素下一个</p></blockquote><h3>栈表达式中的运用</h3><blockquote><p>！！！</p></blockquote><p><img src="'+b+'" alt="四则运算"></p><h3>特殊矩阵</h3><h4>二维数组</h4><p><img src="'+d+'" alt="二维数组"></p><h4>对称矩阵</h4><p><img src="'+u+'" alt="对称矩阵"></p><h4>三对角矩阵</h4><p><img src="'+f+'" alt="三对角矩阵"></p><h4>稀疏矩阵</h4><blockquote><p>三元组和十字链表</p></blockquote><p><img src="'+k+'" alt="稀疏矩阵"></p><p><img src="'+q+'" alt="稀疏矩阵十字链表"></p><h3>算法</h3><h4>1、四则运算匹配</h4><h4>2、括号匹配</h4><h2>串</h2>',49)])))}};export{Z as category,y as date,B as default,w as summary,T as updated};
