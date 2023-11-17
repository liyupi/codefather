# NoSQL

在传统的关系型数据库之外，另外还有一种存储结构灵活、数据处理效率高的数据库模型，称为 NoSQL。

Nosql 全称为 Not Only SQL，指的是非关系型数据库。NoSQL DataBase（NoSQL 数据库）是近年来发展起来的一类数据库管理系统，实现了对大规模数据集的可扩展管理和处理。

NoSQL 数据库的优点在于其能够应对 Web2.0 等新型应用对数据处理的挑战，如 Big Data、Cloud Computing，以及一些对 Schema 设计变化不确定的应用，这些优点是传统 RDBMS 无法比较的。

使用 NoSQL 应该慎重考虑，根据业务场景的需求来决策是否需要使用 NoSQL 进行存储，对于关系型数据应使用关系型数据库更为合适。

NoSQL 分为四类，分别是 Key-Value、Document、Column Family、Graph。

1. Key-Value
Key-Value 型数据库是 NoSQL 的起源，它将数据存储为 Key-Value 对的形式。
其中 Key 是数据访问的唯一标识符，Value 是数据结构化的信息。Key-Value 型数据库非常类似于 Hashtable 或 Dictionary 数据结构，其使用方式类似于缓存。其代表数据库：Redis、Memcachedb。

2. Document
Document 型数据库是 NoSQL 数据库中的主流。它将整块数据存储在一个 Documnet 中，它是另一种半结构化的存储模式，可包含许多不同类型的键值对、key-value 数据、文档数组或各种混合形式。
数据可以编码为 XML、JSON、BSON 等格式，旨在强调对整个文档的持久性。
这种格式的数据库可以简化了当今应用程序的工作流程。它们非常适合需要多个不同类型的数据进行分组的应用程序。其代表数据库：MongoDB。

3. Column Family
Column Family 型数据库是针对超大规模的分布式存储而设计的。它是以列簇的方式存储数据，而且一个 column family 可以包含成千上万甚至是百万级的列数。
它的数据都是由量级巨大的行组成的，这些行可以有唯一标识符，以便于进行查询和处理。
这种类型的数据库注重水平扩展，非常适合于海量数据的场景，其代表数据库：Cassandra、HBase。

4. Graph
Graph 型数据库非常适合复杂的网络数据并支持对大量图形数据进行处理。在 Graph 型数据库中，结点之间是通过边连接的，这种结构便于构建复杂的网络结构并支持深度量化的分析。其代表数据库：Neo4j。

总体来说，NoSQL 是一种存储结构灵活、数据处理效率高的数据库模型，每种类型数据库都有着其特定的特征，选择何种类型，应根据具体的需求场景和计算规模进行选择。