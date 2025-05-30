# ner_kge

## 结构框架

```bash

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
```

## 数据集说明

```text
[word][POS tag][chunk tag][NER tag]  # 数据格式
```

CoNLL2003中， 实体被标注为四种类型：

- LOC 		location
- ORG 	       organisation
- PER 	         person
- MISC	       miscellaneous

```python
# 将 train.txt  |-> train.json |->train.spacy（config.cfg 训练模型需要的文件）
```

训练结果

```bash
PS E:\ner_kge> python -m spacy train config.cfg --output ./output --paths.train ./data/train.spacy --paths.dev ./data/valid.spacy
ℹ Saving to output directory: output
ℹ Using CPU

=========================== Initializing pipeline ===========================
✔ Initialized pipeline

============================= Training pipeline =============================
ℹ Pipeline: ['tok2vec', 'ner']
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
output\model-last
```

## 关系抽取

| 关系类型                   | 实体类型组合 | 示例                                                                                                   |
| -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| affiliated\_with | PER - ORG    | John works at Google.                                      ("John", "works\_for", "Google")            |
| located\_in      | ORG - LOC    | UN headquarters is in New York.                   ("UN headquarters", "located\_in", "New York")       |
| travels\_to      | PER - LOC    | Ekeus heads for Baghdad.                               ("Ekeus", "travels\_to", "Baghdad")             |
| born\_in         | PER - LOC    | Obama was born in Hawaii.                            ("Obama", "born\_in", "Hawaii")                   |
| member\_of       | PER - ORG    | Smith is a member of NATO.                          ("Smith", "member\_of", "NATO")                    |
| participation    | PER - MISC   | Spain won the World Cup.                              ("Spain", "participates\_in", "World Cup")       |
| based\_in        | ORG - LOC    | Reuters is based in London.                            ("Reuters", "based\_in", "London")              |
| has\_nationality | PER - MISC   | He is German.                                                     ("He", "has\_nationality", "German") |

## 评估

| 指标名                                    | 含义        | 用途          |
| -------------------------------------- | --------- | ------------- |
| `hits_at_1`                            | Top-1 命中率 | 模型精度指标（可视化首选） |
| `hits_at_3`, `hits_at_5`, `hits_at_10` | Top-k 命中率 | 趋势展示，用于横向比较   |
| `geometric_mean_rank`                  | 几何平均排名    | 替代 MR，排名越小越好  |
| `harmonic_mean_rank`                   | 调和平均排名    | 更强调低 rank     |
| `median_rank`                          | 中位排名      | 稳健性评估（抗极端值）   |
