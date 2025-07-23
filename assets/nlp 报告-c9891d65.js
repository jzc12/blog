const n=`---
date: 2025-06-04
updated: 2025-06-04
category: NLP
summary: nlp 报告
---
# NLP项目报告

## 要求

1.展示重点：

| 内容     | 建议呈现方式                                                  |
| -------- | ------------------------------------------------------------- |
| 选题意义 | 项目的背景动机、研究意义、实用价值、与课程的关联等。          |
| 技术细节 | 用图表或代码片段说明核心实现。                                |
| 创新点   | 突出项目独特之处（如“基于引导的幻觉缓解”对LLM输出的改进）。 |
| 结果对比 | 用表格或曲线对比基线模型与本项目的性能差异。                  |
| 问题反思 | 分析实验中未解决的难点（如“显存换出换入”中的性能瓶颈）。    |

2.答辩PPT（建议10页以内），建议包含但不限于以下内容：

- 项目背景与目标

  - 说明选题的动机、应用场景及研究意义。
- 技术路线与方法

  - 使用的模型/算法（PEFT、强化学习、扩散模型等）。
- 模型结构图或系统流程图。

  - 数据集与实验设计
  - 数据来源、预处理方法、实验设置（训练参数、评估指标等）。
- 实验结果与分析

  - 可视化图表（准确率、损失曲线、生成图像效果）。
  - 对比基线模型或现有方法的改进点。
- 问题与反思

  - 实验中遇到的挑战及解决方案。
  - 项目局限性及未来改进方向。

## 技术路线与方法

### 架构图

\`\`\`mermaid
flowchart LR
    A[conll2003] --> B[数据预处理]
    B --> C[文本数据]
    B --> E[模型训练 spacy 提供 管道ner、tok2vec]
    E --> F[模型]
    F --> D[调用模型 实体识别]
	C --> D
  
\`\`\`

\`\`\`mermaid
flowchart TD
    A[实体、文本] 
    B[matchers 匹配规则]
    A --> C[模型调用]
    B --> C
    C --> D[关系抽取]
\`\`\`

\`\`\`mermaid
flowchart TD
    A[三元关系组] 
    B[pykeen]
    A --> C[模型训练]
    B --> C
    C --> D[知识图谱]
\`\`\`

\`\`\`mermaid
flowchart TD
    A[新增三元关系组] 
    B[pykeen]
    E[原本的模型]
    A --> C[模型增量训练]
    E --> C
    B --> C
    C --> D[新的知识图谱]
\`\`\`

### 详细设计

1. 数据预处理

\`\`\`text
原始格式train.txt    |->   中间文件   |->   train.spacy（config.cfg 训练模型需要的文件）  --> ner模型
								   └──    trian.txt  用于后续训练实际文本          
\`\`\`

2. SpaCy的句法分析与Matcher 正则匹配实现关系抽取

\`\`\`python
matches = self.matcher(doc)
relations = set()

for match_id, start, end in matches:
    ······
    if entity1 and entity2:
        relations.add((text, entity1, label, entity2))

    return list(relations)
\`\`\`

3. pykeen 实体及关系嵌入式学习

\`\`\`python
for model_name in ["TransE", "ComplEx", "DistMult"]:
metrics = train(
    tsv_path=tsv_path,
    model_name=model_name,
    embedding_dim=100,
    num_epochs=100,
    output_dir=str(path),
    trained_model=trained_model,
)
\`\`\`

知识图谱评估指标

\`\`\`python
summary_metrics.append({
    "Model": model_name,
    "Hits@1": metric_row.get("hits_at_1", float("nan")),
    "Hits@10": metric_row.get("hits_at_10", float("nan")),
    "Median Rank": metric_row.get("median_rank", float("nan")),
    "Mean Rank": metric_row.get("geometric_mean_rank", float("nan")),
    "Harmonic Mean Rank": metric_row.get("harmonic_mean_rank", float("nan"))
})
\`\`\`

| 指标名称           | 含义说明                                           | 指标用途                                 |
| ------------------ | -------------------------------------------------- | ---------------------------------------- |
| Hits@n             | 正确实体预测排名在第n位的比例                      | 评估模型能否精确预测正确答案             |
| Mean Rank          | 所有测试三元组预测实体的平均排名值                 | 衡量模型整体排序能力，但可能受异常值影响 |
| Median Rank        | 所有测试三元组中，正确实体预测排名的中位数         | 更鲁棒，反映模型在大多数情况的预测排名   |
| Harmonic Mean Rank | 所有预测排名的调和平均值，对低排名（高准确）更敏感 | 更关注模型是否能稳定地将正确答案排在前面 |

| 目标                 | 实现                                                |
| -------------------- | --------------------------------------------------- |
| 模型参数复用         | 使用 \`torch.load()\` 加载旧模型完整对象            |
| 新模型初始化一致结构 | 使用 \`make_model()\` + 指定 模型和 embedding\\_dim  |
| 旧参数迁移           | 手动复制 entity 和 relation 的旧嵌入到新模型中      |
| 增量训练执行         | 用 PyKEEN 的 \`SLCWATrainingLoop\` 训练合并后的图谱 |

\`\`\`python
merged_triples = torch.cat([
    original_factory.mapped_triples,  # 原始三元组
    new_factory.mapped_triples,       # 新增三元组
], dim=0)
\`\`\`

\`\`\`text
("爱因斯坦", "出生地", ？)
 –> 预测                        排名   实体名称
                                1	 美国
                                2	 奥地利
                                3	 德国 ✅
                                ...	 ...		
\`\`\`

    Hits@1 = 0

    Hits@3 = 1
`;export{n as default};
