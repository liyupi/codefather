## 说说 MyBatis 的缓存机制？ 
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Mybatis 中有两类缓存，分别是**一级缓存**和**二级缓存**。

**一级缓存（SqlSession 级别）**：仅在同一个 `SqlSession` 中生效。基于 **命名空间、SQL 语句和参数** 作为唯一标识。
 - 默认开启，生命周期与 `SqlSession` 一致。
 - 当执行 `commit`、`rollback` 或手动清理缓存时会清空。

**二级缓存（Mapper 级别）**：跨 `SqlSession`共享缓存，基于 Mapper 的缓存。
 - 需要手动配置开启（Mapper XML 文件中需要 `<cache/>`）。
 - 生命周期与 `SqlSessionFactory` 一致。
 - 数据的更新、插入、删除会使相关缓存失效。
 - 支持定制化存储（如整合第三方缓存工具）。

## 扩展知识

### 进一步理解

一级缓存默认是会话级缓存。即创建一个 SqlSession 对象就是一个会话，一次会话可能会执行多次相同的查询，这样缓存了之后就能重复利用查询结果，提高性能，不过 commit、rollback、update、delete 等都会清除缓存。

不过要注意，不同 SqlSession 之间的修改不会影响彼此，比如 SqlSession1 读了数据 A，SqlSession2 将数据改为 B，此时 SqlSession1 再读还是得到 A，这就出现了脏数据的问题。

所以，如果是多 SqlSession 或者分布式环境下，就可能有脏数据的情况发生，建议将一级缓存级别设置为 statement。

二级缓存是跨 SqlSession 级别的共享的，同一个 namespace 下的所有操作语句，都影响着同一个 Cache。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/FvCfm3wH_image_mianshiya.png" alt="image.png" width="676" /></p>

二级缓存也会有脏数据的情况，比如多个命名空间进行多表查询，各命名空间之间数据是不共享的，所以存在脏数据的情况。

例如 A、B 两张表进行联表查询，表 A 缓存了这次联表查询的结果，则结果存储在表 A 的 namespace 中，此时如果表 B 的数据更新了，是不会同步到表 A namespace 的缓存中，因此就会导致脏读的产生。

> 一般而言 namespace 对应一个 mapper，对应一个表。namespace 对应一个唯一的命名空间，从而可以在不同的映射文件中使用相同的 SQL 语句 ID，例如 user 可以定义一个 selectById，order 也可以定义一个 selectById，因为命名空间不同，就不会冲突。 

开启二级缓存之后，**会先从二级缓存查找，找不到再去一级缓存查找**，如果一级缓存没有再去数据库查询。

二级缓存主要是利用 `CachingExecutor` 这个装饰器拦了一道，来看下 `CachingExecutor#query` 方法：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/P4ZXRzwh_image_mianshiya.png" alt="image.png" width="711" /></p>

而 MyBatis 的缓存本质上就是在本地利用 map 来存储数据。

基础实现类是 `PerpetualCache` ，并且使用了装饰器模式，提供了各种各样的 cache 进行功能的扩展，比如：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/CqnXzkf6_image_mianshiya.png" alt="image.png" width="686" /></p>

像 `BlockingCache` 可以提供阻塞，还有 `FifoCache`、`LruCache` 等等。

好了，原理大致就是上面这些，可以看到 mybaits 缓存还是不太安全，上面说的在分布式场景下肯定会出现脏数据。

建议生产上使用 redis 结合 spring cache 进行数据的缓存，或者利用 guava、caffeine 进行本地缓存。


### 配置示例

**一级缓存**无需额外配置，默认开启。

**二级缓存**配置示例（Mapper XML 文件）：

```xml
<mapper namespace="com.example.mapper.UserMapper">
    <!-- 开启二级缓存 -->
    <cache eviction="LRU" flushInterval="60000" size="512" readOnly="true"/>
</mapper>
```

- **`eviction`**：缓存清理策略（`LRU`、`FIFO` 等）。
- **`flushInterval`**：刷新间隔（单位：毫秒）。
- **`size`**：缓存的最大对象个数。
- **`readOnly`**：只读标志，设置为 `true` 时提高性能，但不能修改返回对象。




> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)