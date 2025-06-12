import{o as e,c as a,a as d}from"./index-1227c5ed.js";const r={class:"markdown-body"},c="README",l="2025-06-01T00:00:00.000Z",h="2025-06-02T00:00:00.000Z",g="NLP",m="小规模知识图谱构建",u={__name:"ner_kge",setup(o,{expose:n}){return n({frontmatter:{title:"README",date:"2025-06-01T00:00:00.000Z",updated:"2025-06-02T00:00:00.000Z",category:"NLP",summary:"小规模知识图谱构建"}}),(s,t)=>(e(),a("div",r,t[0]||(t[0]=[d(`<h1>ner_kge</h1><h2>结构框架</h2><pre><code class="language-bash">
ner_kge/
├── data/
│  		├── conll2003/       # 原始数据集
│  		├── train/		     # 处理后的.txt, 和其他中间文件
│  		├── valid/
│  		├── test/
│  		└── .csv			 # 包括句子的实体文件、句子关系抽取结果文件
│
├── model/
│  		└── keen.py		 	 # 保存 pykeen 训练的结果和 可视化图表
│
├── ner/
│  		├── graph.py      	 # 根据 relations.csv 绘制图
│  		├── pipeline.py      # 封装 Matcher 匹配对象
│  		├── matchers.py      # 正则匹配机制
│  		└── processor.py     # 实体分析和关系抽取
│
├── output/
│  		├── keen/		 	 # 保存 pykeen 训练的结果和 可视化图表
│  		└── model-best/		 # 微调的NER模型
│
├── ragas/
│  		├── client.py		 # llm 调用实体
│  		└── query.py		 
├── utils/
│
├── config.cfg				 # 训练ner模型的配置文件
├── main.py					 # 运行调用主程序
├── README.md 
</code></pre><h2>数据集说明</h2><pre><code class="language-text">[word][POS tag][chunk tag][NER tag]  # 数据格式
</code></pre><p>CoNLL2003中， 实体被标注为四种类型：</p><ul><li>LOC location</li><li>ORG organisation</li><li>PER person</li><li>MISC miscellaneous</li></ul><pre><code class="language-python"># 将 train.txt  |-&gt; train.json |-&gt;train.spacy（config.cfg 训练模型需要的文件）
</code></pre><p>训练结果</p><pre><code class="language-bash">PS E:\\ner_kge&gt; python -m spacy train config.cfg --output ./output --paths.train ./data/train.spacy --paths.dev ./data/valid.spacy
ℹ Saving to output directory: output
ℹ Using CPU

=========================== Initializing pipeline ===========================
✔ Initialized pipeline

============================= Training pipeline =============================
ℹ Pipeline: [&#39;tok2vec&#39;, &#39;ner&#39;]
ℹ Initial learn rate: 0.001
E    #       LOSS TOK2VEC  LOSS NER  ENTS_F  ENTS_P  ENTS_R  SCORE
---  ------  ------------  --------  ------  ------  ------  ------
  0       0          0.00     44.28    0.00    0.00    0.00    0.00
  0     200         53.51   2262.98   69.75   71.63   67.97    0.70
  0     400         44.03   1604.78   77.72   78.03   77.42    0.78
  0     600         47.70   1364.43   81.40   80.97   81.84    0.81
  0     800         62.73   1692.76   79.85   80.87   78.85    0.80
  0    1000         64.50   1502.39   87.07   86.91   87.24    0.87
  1    1200         78.24   1518.20   88.02   88.27   87.77    0.88
  1    1400        292.83   1380.29   88.45   87.62   89.30    0.88
  1    1600        113.16   1543.65   88.47   88.71   88.22    0.88
  2    1800        124.83   1582.09   89.57   89.15   90.00    0.90
  2    2000        148.23   1479.53   89.71   89.80   89.62    0.90
  3    2200        136.33   1272.89   90.01   89.88   90.14    0.90
  4    2400        189.11   1345.65   90.92   91.15   90.69    0.91
  5    2600        183.35   1177.05   90.90   90.63   91.16    0.91
  6    2800        195.08   1027.79   89.56   89.76   89.36    0.90
  7    3000        219.84    967.49   90.65   90.74   90.56    0.91
  8    3200        162.38    713.43   90.73   91.21   90.26    0.91
  9    3400        209.48    693.15   90.09   90.03   90.15    0.90
  9    3600        220.44    647.24   90.49   90.57   90.41    0.90
 10    3800        180.10    514.69   89.98   89.81   90.15    0.90
 11    4000        205.09    550.09   90.58   90.66   90.51    0.91
✔ Saved pipeline to output directory
output\\model-last
</code></pre><h2>关系抽取</h2><table><thead><tr><th>关系类型</th><th>实体类型组合</th><th>示例</th></tr></thead><tbody><tr><td>affiliated_with</td><td>PER - ORG</td><td>John works at Google. (“John”, “works_for”, “Google”)</td></tr><tr><td>located_in</td><td>ORG - LOC</td><td>UN headquarters is in New York. (“UN headquarters”, “located_in”, “New York”)</td></tr><tr><td>travels_to</td><td>PER - LOC</td><td>Ekeus heads for Baghdad. (“Ekeus”, “travels_to”, “Baghdad”)</td></tr><tr><td>born_in</td><td>PER - LOC</td><td>Obama was born in Hawaii. (“Obama”, “born_in”, “Hawaii”)</td></tr><tr><td>member_of</td><td>PER - ORG</td><td>Smith is a member of NATO. (“Smith”, “member_of”, “NATO”)</td></tr><tr><td>participation</td><td>PER - MISC</td><td>Spain won the World Cup. (“Spain”, “participates_in”, “World Cup”)</td></tr><tr><td>based_in</td><td>ORG - LOC</td><td>Reuters is based in London. (“Reuters”, “based_in”, “London”)</td></tr><tr><td>has_nationality</td><td>PER - MISC</td><td>He is German. (“He”, “has_nationality”, “German”)</td></tr></tbody></table><h2>评估</h2><table><thead><tr><th>指标名</th><th>含义</th><th>用途</th></tr></thead><tbody><tr><td><code>hits_at_1</code></td><td>Top-1 命中率</td><td>模型精度指标（可视化首选）</td></tr><tr><td><code>hits_at_3</code>, <code>hits_at_5</code>, <code>hits_at_10</code></td><td>Top-k 命中率</td><td>趋势展示，用于横向比较</td></tr><tr><td><code>geometric_mean_rank</code></td><td>几何平均排名</td><td>替代 MR，排名越小越好</td></tr><tr><td><code>harmonic_mean_rank</code></td><td>调和平均排名</td><td>更强调低 rank</td></tr><tr><td><code>median_rank</code></td><td>中位排名</td><td>稳健性评估（抗极端值）</td></tr></tbody></table><h2>架构图</h2><pre><code class="language-mermaid">graph TD
    A[原始文本数据\\n data/test/test.txt  ]
    B[数据预处理\\n data_preprocess  ]
    C[NER模型训练\\n SpaCy train  ]
    D{实体识别  NER  \\n ent_process  }
    E[提取的实体数据\\n data/entities.csv  ]
    F{关系抽取  RE  \\n ent_process &amp; ragas/query.py  }
    G[知识图谱三元组\\n data/llm_relations.csv  ]
    H{KGE模型训练\\n train &amp; model/keen.py  }
    I[训练好的KGE模型\\n output/keen/model_name/  ]
    J[KGE评估结果与可视化\\n summary.csv, loss_plot.png, etc.  ]

    %% Data Flow
    A --&gt; B
    B --&gt; C
    A --&gt; D
    C -- 使用 --&gt; D
    D -- 生成 --&gt; E
    E --&gt; F
    F -- 动态更新/追加 --&gt; G

    %% Incremental Learning Path
    G --&gt; H
    H --&gt; I
    I --&gt; H
    H --&gt; J

    %% Highlight key aspects
    subgraph Incremental/Dynamic Features
        F -- &quot;检查重复，只追加新三元组&quot; --&gt; G
        H -- &quot;加载现有模型，在此基础上继续训练&quot; --&gt; I
    end

    style F fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#9cf,stroke:#333,stroke-width:2px

</code></pre><h2>基础功能</h2><h2>进阶功能</h2>`,18)])))}};export{g as category,l as date,u as default,m as summary,c as title,h as updated};
