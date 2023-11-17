# Seaborn

Seaborn 是一个数据可视化库，它是建立在 Matplotlib 之上的。相比于 Matplotlib，Seaborn 提供了更方便的接口和更多的可视化效果。

Seaborn 的最大优势就是美观易用，通过调用 Seaborn 提供的高级函数，可以很容易地画出各种专业感、规范、美观的图表，比如热力图、小提琴图、箱线图等。

使用 Seaborn 的第一步，是加载它提供的默认数据集。这些数据集都是一些行业标准数据，可以通过简单的调用 Seaborn 提供的函数加载进来，举个例子，我们可以通过 `load_dataset()` 函数加载 Seaborn 自带的 tips 数据集：

```python
import seaborn as sns

tips = sns.load_dataset("tips")
```

Seaborn 中最常用的图表是散点图和线性回归图，它们可以通过 `scatterplot()` 和 `lmplot()` 函数，轻松绘制出来。这两个函数非常灵活，可以针对不同类型的数据进行定制化配置。

另外，Seaborn 还有一个很棒的特性——它提供了大量的主题(theme)，通过设置主题，可以快速地改变整个图表的背景和样式。Seaborn 中提供了 5 种主题，分别为：`white`、`dark`、`whitegrid`、`darkgrid` 和 `ticks`。

想要更好地了解 Seaborn 的使用，可以参考官方文档（https://seaborn.pydata.org/）。