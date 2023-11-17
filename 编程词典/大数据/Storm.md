# Storm

## 简介

Storm 是一个开源的分布式实时计算系统，由 Twitter 公司开发并捐赠给 Apache 软件基金会。它使得开发者可以以很高的频率、低延迟地处理海量实时数据，比如流量数据、日志数据等。

Storm 采用了分布式、可扩展、容错等诸多特性，支持多语言，适合运行在分布式集群的数据处理、分析、计算等场景中。Storm 提供了丰富的 API，方便开发者编写实时数据处理应用。

## 架构

Storm 的架构非常灵活，支持多种不同的部署方式，主要分为 Local Mode、Distributed Mode 和典型的 Master/Worker 模式。

- Local Mode：本地模式，主要用来进行本地测试和调试。
- Distributed Mode：分布式模式，适合在分布式集群中运行。
- Master/Worker 模式：典型的 Storm 集群部署模式，主要由一个主节点和多个工作节点组成。

Storm 包含了三大核心组件：

- Nimbus：Storm 集群的主节点，主要负责协调集群资源、任务调度等。
- Supervisor：Storm 集群上的工作节点，主要负责实际运行 Topology 的 Executor。
- ZooKeeper：Storm 集群的协调服务，主要用来进行元数据的存储和分布式锁管理。

## 术语解释

- Topology：Storm 中的基本计算单元，数据流处理的任务被组织成一个或多个 Topology，其类似于数据处理过程的图形模型，由若干个 Spout 和 Bolt 组合而成。
- Spout：Storm 中的数据源，负责数据的读取和发送处理，可以获得数据并不断地发送到后续的 Bolt 中，常见的 Spout 类型有 Kafka Spout、Kinesis Spout 等。
- Bolt：Storm 中的数据处理器，负责对接收到的数据进行处理，可以进行数据清洗、加工、聚合等操作，常见的 Bolt 类型有 FilterBolt、KafkaBolt、HBaseBolt 等。

Storm 具有高可用、容错、可扩展的优良性质，非常适合处理实时数据流处理、数据分析、数据处理等场景，已经在很多企业中得到广泛应用。