# BatchNormalization

Batch Normalization 是深度学习中广泛使用的一种技术，是由Sergey Ioffe和Christian Szegedy在论文《Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift》中提出的。

当我们进行神经网络训练时，每层数据的分布都是不同的。这是因为，随着网络的训练，每层的参数在不断调整，进而改变了每层的输出分布，这种现象被称为内部协方差偏移。因为在每层的激活函数输入数据并非同分布，导致了激活函数的输出也是不同的分布，这可能会导致梯度消失或梯度爆炸的问题，进而导致神经网络训练效率低下，拟合效果差等问题。

Batch Normalization 解决了这个问题。Batch Normalization 就是说，我们对每批输入数据做一个标准化。标准化的过程是针对每个元素，减去当前 batch 的均值，再除以当前 batch 的标准差。这样可以统一每个输入变量的分布，并降低网络对于参数的敏感度，有效地防止了神经元静止不动的现象。

它的优点不仅仅在于这点，还可以防止过拟合，减少了对参数初始化的依赖，加速了神经网络的训练，提升了网络的泛化能力。Batch Normalization 层可以插入在神经网络的全连接层之前，并在激活之前计算，也可以插在卷积层之后，并在激活之前计算。

通过使用 Batch Normalization 技术，我们可以更加深入地理解神经网络的训练和应用，进而提升深度学习的效率和准确性。