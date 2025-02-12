## MySQL 的 Change Buffer 是什么？它有什么作用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Change Buffer 是 MySQL InnoDB 存储引擎中的一个机制，**用于暂存对二级索引的插入和更新操作的变更**，而不立即执行这些操作，随后，当 InnoDB 进行合适的条件时（如页被读取或 Flush 操作），会将这些变更写入到二级索引中。

**作用**：
- **提高写入性能**：通过将对二级索引的变更暂存，可以减少对磁盘的频繁写入，提升插入和更新操作的性能。
- **批量处理**：Change Buffer 可以在后续的操作中批量处理这些变更，减少了随机写入的开销。


## 扩展知识

### 进一步理解 Change Buffer

我们来看一下官网的一张图：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783393747989405698/710_mianshiya.png" alt="710.png" width="100%" />

从上面的图我们可以看到， buffer pool 里面其实有一块内存是留给 change buffer 用的。

**1）那 change buffer 具体是个什么东西呢？**

如果当前表针对 name 有一个**二级索引**。假设我们执行一条 ` update table set name = 'yes' where id = 1`（这条语句需要修改 name 这个二级索引中的数据），此时 buffer pool 并没有对应**二级索引的索引页**数据。

这个时候需要把索引页加载才内存中立即执行修改吗？

不是的，这时候 change buffer 就上场了。

如果当前**二级索引页**不在 buffer pool 中，那么 innodb 会把更新操作缓存到 change buffer 中，当下次访问到这条数据后，会把索引页加载到 buffer pool 中，并且应用上 change buffer 里面的变更，这样就保证了数据的一致性。

> 上述 SQL 中，change buffer 中会存储 `name` 字段的旧索引值删除操作和新索引值插入操作。

**2）所以 change buffer 有什么好处？**

当**二级索引页**不在 buffer pool 中时，change buffer 可以避免立即从磁盘读取对应索引页导致的昂贵的随机I/O ，对应的更改可以在后面当**二级索引页**读入 buffer pool 时候被批量应用。

看到我加粗的字体没，二级索引页，没错 **change buffer 只能用于二级索引的更改，不适用于主键索引，空间索引以及全文索引**。

还有，**唯一索引也不行**，因为唯一索引需要读取数据然后检查数据的一致性。

**3）更改先缓存在 change buffer 中，假如数据库挂了，更改不是丢了吗？**

别怕，change buffer 也是要落盘存储的，从上图我们看到 change buffer 会落盘到系统表空间里面，然后 redo log 也会记录 chang buffer 的修改来保证数据一致性。

至此，想必你对 change buffer 已经有一定了解了吧。**它主要用来避免于二级索引页修改产生的随机I/O**。如果你的内存够大能装下所有数据，或者二级索引很少，或者你的磁盘是固态的对随机访问影响不大，其实可以关闭 change buffer，因为它也增加了复杂度，当然最终还是得看压测结果。


### **Change Buffer 的大小**
   - Change Buffer 的大小可以通过系统变量 `innodb_change_buffer_max_size` 进行配置，默认值为 25% 的 InnoDB 缓冲池大小，最大值可以设置为 50%。合理配置可以提升性能，但过大可能导致内存不足。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)