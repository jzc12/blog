import{o as n,c as o,a}from"./index-e0a215bc.js";const d={class:"markdown-body"},u="2025-06-04T00:00:00.000Z",p="2025-06-04T00:00:00.000Z",s="NLP",m="nlp 报告",g={__name:"nlp 报告",setup(r,{expose:e}){return e({frontmatter:{date:"2025-06-04T00:00:00.000Z",updated:"2025-06-04T00:00:00.000Z",category:"NLP",summary:"nlp 报告"}}),(i,t)=>(n(),o("div",d,t[0]||(t[0]=[a(`<h1>NLP项目报告</h1><h2>要求</h2><p>1.展示重点：</p><table><thead><tr><th>内容</th><th>建议呈现方式</th></tr></thead><tbody><tr><td>选题意义</td><td>项目的背景动机、研究意义、实用价值、与课程的关联等。</td></tr><tr><td>技术细节</td><td>用图表或代码片段说明核心实现。</td></tr><tr><td>创新点</td><td>突出项目独特之处（如“基于引导的幻觉缓解”对LLM输出的改进）。</td></tr><tr><td>结果对比</td><td>用表格或曲线对比基线模型与本项目的性能差异。</td></tr><tr><td>问题反思</td><td>分析实验中未解决的难点（如“显存换出换入”中的性能瓶颈）。</td></tr></tbody></table><p>2.答辩PPT（建议10页以内），建议包含但不限于以下内容：</p><ul><li><p>项目背景与目标</p><ul><li>说明选题的动机、应用场景及研究意义。</li></ul></li><li><p>技术路线与方法</p><ul><li>使用的模型/算法（PEFT、强化学习、扩散模型等）。</li></ul></li><li><p>模型结构图或系统流程图。</p><ul><li>数据集与实验设计</li><li>数据来源、预处理方法、实验设置（训练参数、评估指标等）。</li></ul></li><li><p>实验结果与分析</p><ul><li>可视化图表（准确率、损失曲线、生成图像效果）。</li><li>对比基线模型或现有方法的改进点。</li></ul></li><li><p>问题与反思</p><ul><li>实验中遇到的挑战及解决方案。</li><li>项目局限性及未来改进方向。</li></ul></li></ul><h2>技术路线与方法</h2><h3>架构图</h3><pre><code class="language-mermaid">flowchart LR
    A[conll2003] --&gt; B[数据预处理]
    B --&gt; C[文本数据]
    B --&gt; E[模型训练 spacy 提供 管道ner、tok2vec]
    E --&gt; F[模型]
    F --&gt; D[调用模型 实体识别]
	C --&gt; D
  
</code></pre><pre><code class="language-mermaid">flowchart TD
    A[实体、文本] 
    B[matchers 匹配规则]
    A --&gt; C[模型调用]
    B --&gt; C
    C --&gt; D[关系抽取]
</code></pre><pre><code class="language-mermaid">flowchart TD
    A[三元关系组] 
    B[pykeen]
    A --&gt; C[模型训练]
    B --&gt; C
    C --&gt; D[知识图谱]
</code></pre><pre><code class="language-mermaid">flowchart TD
    A[新增三元关系组] 
    B[pykeen]
    E[原本的模型]
    A --&gt; C[模型增量训练]
    E --&gt; C
    B --&gt; C
    C --&gt; D[新的知识图谱]
</code></pre><h3>详细设计</h3><ol><li>数据预处理</li></ol><pre><code class="language-text">原始格式train.txt    |-&gt;   中间文件   |-&gt;   train.spacy（config.cfg 训练模型需要的文件）  --&gt; ner模型
								   └──    trian.txt  用于后续训练实际文本          
</code></pre><ol start="2"><li>SpaCy的句法分析与Matcher 正则匹配实现关系抽取</li></ol><pre><code class="language-python">matches = self.matcher(doc)
relations = set()

for match_id, start, end in matches:
    ······
    if entity1 and entity2:
        relations.add((text, entity1, label, entity2))

    return list(relations)
</code></pre><ol start="3"><li>pykeen 实体及关系嵌入式学习</li></ol><pre><code class="language-python">for model_name in [&quot;TransE&quot;, &quot;ComplEx&quot;, &quot;DistMult&quot;]:
metrics = train(
    tsv_path=tsv_path,
    model_name=model_name,
    embedding_dim=100,
    num_epochs=100,
    output_dir=str(path),
    trained_model=trained_model,
)
</code></pre><p>知识图谱评估指标</p><pre><code class="language-python">summary_metrics.append({
    &quot;Model&quot;: model_name,
    &quot;Hits@1&quot;: metric_row.get(&quot;hits_at_1&quot;, float(&quot;nan&quot;)),
    &quot;Hits@10&quot;: metric_row.get(&quot;hits_at_10&quot;, float(&quot;nan&quot;)),
    &quot;Median Rank&quot;: metric_row.get(&quot;median_rank&quot;, float(&quot;nan&quot;)),
    &quot;Mean Rank&quot;: metric_row.get(&quot;geometric_mean_rank&quot;, float(&quot;nan&quot;)),
    &quot;Harmonic Mean Rank&quot;: metric_row.get(&quot;harmonic_mean_rank&quot;, float(&quot;nan&quot;))
})
</code></pre><table><thead><tr><th>指标名称</th><th>含义说明</th><th>指标用途</th></tr></thead><tbody><tr><td>Hits@n</td><td>正确实体预测排名在第n位的比例</td><td>评估模型能否精确预测正确答案</td></tr><tr><td>Mean Rank</td><td>所有测试三元组预测实体的平均排名值</td><td>衡量模型整体排序能力，但可能受异常值影响</td></tr><tr><td>Median Rank</td><td>所有测试三元组中，正确实体预测排名的中位数</td><td>更鲁棒，反映模型在大多数情况的预测排名</td></tr><tr><td>Harmonic Mean Rank</td><td>所有预测排名的调和平均值，对低排名（高准确）更敏感</td><td>更关注模型是否能稳定地将正确答案排在前面</td></tr></tbody></table><table><thead><tr><th>目标</th><th>实现</th></tr></thead><tbody><tr><td>模型参数复用</td><td>使用 <code>torch.load()</code> 加载旧模型完整对象</td></tr><tr><td>新模型初始化一致结构</td><td>使用 <code>make_model()</code> + 指定 模型和 embedding_dim</td></tr><tr><td>旧参数迁移</td><td>手动复制 entity 和 relation 的旧嵌入到新模型中</td></tr><tr><td>增量训练执行</td><td>用 PyKEEN 的 <code>SLCWATrainingLoop</code> 训练合并后的图谱</td></tr></tbody></table><pre><code class="language-python">merged_triples = torch.cat([
    original_factory.mapped_triples,  # 原始三元组
    new_factory.mapped_triples,       # 新增三元组
], dim=0)
</code></pre><pre><code class="language-text">(&quot;爱因斯坦&quot;, &quot;出生地&quot;, ？)
 –&gt; 预测                        排名   实体名称
                                1	 美国
                                2	 奥地利
                                3	 德国 ✅
                                ...	 ...		
</code></pre><pre><code>Hits@1 = 0

Hits@3 = 1
</code></pre>`,26)])))}};export{s as category,u as date,g as default,m as summary,p as updated};
