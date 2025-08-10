import{o as e,c as o,a as i}from"./index-160739f4.js";const c={class:"markdown-body"},a="2025-06-02T00:00:00.000Z",g="2025-06-02T00:00:00.000Z",u="算法",p="得物机试",_={__name:"算法",setup(r,{expose:n}){return n({frontmatter:{date:"2025-06-02T00:00:00.000Z",updated:"2025-06-02T00:00:00.000Z",category:"算法",summary:"得物机试"}}),(s,t)=>(e(),o("div",c,t[0]||(t[0]=[i(`<h2>1</h2><p>题目描述操作和限制：</p><ol><li><strong>初始状态</strong>：<code>s_str</code> 是一个空字符串。</li><li><strong>操作类型</strong>： <ul><li><strong>操作1</strong>：在 <code>s_str</code> 的左边或右边添加一个字符。每次操作的代价为 <code>a</code>。</li><li><strong>操作2</strong>：以 <code>s_str</code> 的某个子串为基础，将其添加到 <code>s_str</code> 的左边或右边。每次操作的代价为 <code>b</code>。</li></ul></li><li><strong>目标</strong>：从空字符串开始，通过一系列上述操作，使 <code>s_str</code> 等于 <code>target_str</code>，并且总代价最小。</li></ol><p>定义 <code>dp[i][j]</code> 为构建 <code>target_str</code> 从第 <code>i</code> 个字符到第 <code>j</code> 个字符（闭区间）的子串的最小代价。</p><p>初始时，<code>dp[i][i] = a</code></p><p>对于 <code>dp[i][j]</code>，可以考虑以下几种构建方式：</p><ol><li><p>操作1的最小代价为 <code>min(dp[i][j-1] + a, dp[i+1][j] + a)</code>。</p></li><li><p><strong>通过操作2构建</strong>：</p><ul><li>需要找到一个子串 <code>target_str[k..l]</code> 已经是 <code>target_str[i..j]</code> 的一部分，然后通过操作2扩展。</li><li>具体来说，如果 <code>target_str[i..j]</code> 可以表示为 <code>s + t</code> 或 <code>t + s</code>，其中 <code>s</code> 是 <code>t</code> 的子串或反之，那么可以利用操作2。</li><li>更一般地，可以尝试将 <code>target_str[i..j]</code> 分成两部分，其中一部分是另一部分的子串。</li><li>例如，如果 <code>target_str[i..j] = target_str[k..l] + target_str[m..n]</code>，且 <code>target_str[m..n]</code> 是 <code>target_str[k..l]</code> 的子串，那么可以通过操作2添加 <code>target_str[m..n]</code>。</li></ul></li></ol><pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;algorithm&gt;
#include &lt;climits&gt;

using namespace std;

int minCostToConstruct(string target_str, int a, int b) {
    int n = target_str.size();
    if (n == 0) return 0;
    
    vector&lt;vector&lt;int&gt;&gt; dp(n, vector&lt;int&gt;(n, INT_MAX));
    
    for (int i = 0; i &lt; n; ++i) {
        dp[i][i] = a;
    }
    
    // Fill the dp table for substrings of length 2 to n
    for (int len = 2; len &lt;= n; ++len) {
        for (int i = 0; i &lt;= n - len; ++i) {
            int j = i + len - 1;
            
            // Operation 1: add a single character to the left or right
            int cost1 = min(dp[i][j-1] + a, dp[i+1][j] + a);
            
            // Operation 2: add a substring to the left or right
            int cost2 = INT_MAX;
            for (int k = i; k &lt; j; ++k) {
                // Check if target_str[k+1..j] is a substring of target_str[i..k]
                string substring = target_str.substr(k+1, j - k);
                if (target_str.substr(i, k - i + 1).find(substring) != string::npos) {
                    cost2 = min(cost2, dp[i][k] + b);
                }
                // Check if target_str[i..k] is a substring of target_str[k+1..j]
                substring = target_str.substr(i, k - i + 1);
                if (target_str.substr(k+1, j - k).find(substring) != string::npos) {
                    cost2 = min(cost2, dp[k+1][j] + b);
                }
            }
            
            dp[i][j] = min(cost1, cost2);
        }
    }
    
    return dp[0][n-1];
}

#include &lt;iostream&gt;
int main() {
    string target = &quot;abab&quot;;
    int a = 2, b = 3;
    cout &lt;&lt; &quot;Minimum cost: &quot; &lt;&lt; minCostToConstruct(target, a, b) &lt;&lt; endl;
    return 0;
}
</code></pre><h2>2</h2><p><code>std::multiset</code> 允许存储重复的元素，因此可以正确处理相同的 <code>(c, d)</code> 对。</p><pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;set&gt;  

using namespace std;

bool canPair(vector&lt;pair&lt;int, int&gt;&gt;&amp; ab, vector&lt;pair&lt;int, int&gt;&gt;&amp; cd) {
    sort(ab.begin(), ab.end());
    sort(cd.begin(), cd.end());

    multiset&lt;pair&lt;int, int&gt;&gt; cdSet(cd.begin(), cd.end()); 

    for (const auto&amp; pair_ab : ab) {
        auto it = cdSet.lower_bound({pair_ab.first, pair_ab.second});
        if (it == cdSet.end()) {
            return false;
        }
        // 这里
        if (it-&gt;first &gt;= pair_ab.first &amp;&amp; it-&gt;second &gt;= pair_ab.second) {
            cdSet.erase(it);  
        } else {
            return false;
        }
    }
    return true;
}

int main() {
    int n;
    cin &gt;&gt; n;
    vector&lt;pair&lt;int, int&gt;&gt; ab(n), cd(n);
    for (int i = 0; i &lt; n; ++i) {
        cin &gt;&gt; ab[i].first &gt;&gt; ab[i].second;
    }
    for (int i = 0; i &lt; n; ++i) {
        cin &gt;&gt; cd[i].first &gt;&gt; cd[i].second;
    }

    if (canPair(ab, cd)) {
        cout &lt;&lt; &quot;YES&quot; &lt;&lt; endl;
    } else {
        cout &lt;&lt; &quot;NO&quot; &lt;&lt; endl;
    }

    return 0;
}


</code></pre><ul><li><p><strong>贪心匹配</strong>：</p><ul><li>由于 <code>ab</code> 和 <code>cd</code> 都按 <code>(a, c)</code> 升序排序，我们仍然可以保证每次选择最小的可行 <code>(c, d)</code>。</li><li>即使存在多个相同的 <code>(c, d)</code>，<code>lower_bound</code> 会找到第一个满足条件的，而 <code>erase(it)</code> 会精确移除它。</li></ul></li><li><p><strong>时间复杂度</strong>：</p><ul><li>排序 <code>ab</code> 和 <code>cd</code>：<code>O(n log n)</code>。</li><li>每次 <code>lower_bound</code> 和 <code>erase</code>：<code>O(log n)</code>，共 <code>n</code> 次 → <code>O(n log n)</code>。</li><li>总复杂度：<code>O(n log n)</code>，适用于大数据量。</li></ul></li></ul>`,12)])))}};export{u as category,a as date,_ as default,p as summary,g as updated};
