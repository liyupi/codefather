## Redis 主从复制的实现原理是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Redis 的主从复制是指一个 Redis 实例（主节点）可以将数据复制到一个或多个从节点（从节点），从节点从主节点获取数据并保持同步。

**复制流程**：
- **开始同步**：从节点通过向主节点发送 `PSYNC` 命令发起同步。
- **全量复制**：如果是第一次连接或之前的连接失效，从节点会请求全量复制，主节点将当前数据快照（RDB文件）发送给从节点。
- **增量复制**：全量复制完毕后，主从之间会保持一个长连接，主节点会通过这个连接将后续的写操作传递给从节点执行，来保证数据的一致。

## 扩展知识

### Redis 主从架构

下图就是一个 Redis 主从架构图：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/Ry6PqUac_image_mianshiya.png" alt="image.png" width="398" /></p>

主从架构可以实现读写分离。写操作可以请求主节点，而读操作只请求从节点，这样就能减轻主节点的压力。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/jJA9JNgt_image_mianshiya.png" alt="image.png" width="398" /></p>

整个主从集群仅主节点可以写入，其它从节点都通过复制来同步数据，这样就能保证数据的一致性。并且对读请求分散到多个节点，提高了 Redis 的吞吐量，从一定程度上也提高了 Redis 的可用性。

### 主从复制原理详解

Redis 之间主从复制主要有两种数据同步方式，分别是**全量同步**和**增量同步**。

1） **全量同步**

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/zQyotf09_image_mianshiya.png" alt="image.png" width="770" /></p>



- runid 指的是主服务器的 run ID，从节点第一次同步不知道主节点 ID，于是传递 "?"。
- offset 为复制进度，第一次同步值为 -1。

文字版本的流程：
   - 从节点发送 `psync ？ -1`，触发同步。
   - 主节点收到从节点的 psync 命令之后，发现 runid 没值，判断是全量同步，返回 fullresync 并带上主服务器的 runid 和当前复制进度，从服务器会存储这两个值。
   - 主节点执行 bgsave 生成 RDB 文件，在 RDB 文件生成过程中，主节点新接收到的写入数据的命令会存储到 `replication buffer` 中。
   - RDB 文件生成完毕后，主节点将其发送给从节点，从节点清空旧数据，加载 RDB 的数据。
   - 等到从节点中 RDB 文件加载完成之后，主节点将 replication buffer 缓存的数据发送给从节点，从节点执行命令，保证数据的一致性。

待同步完毕后，主从之间会保持一个长连接，主节点会通过这个连接将后续的写操作传递给从节点执行，来保证数据的一致。

2） **增量同步**

主从之间的网络可能不稳定，如果连接断开，主节点部分写操作未传递给从节点执行，主从数据就不一致了。

此时有一种选择是再次发起全量同步，但是全量同步数据量比较大，非常耗时。因此 Redis 在 2.8 版本引入了增量同步（psync 其实就是 2.8 引入的命令），仅需把连接断开其间的数据同步给从节点就好了。

此时需要介绍下 `repl_backlog_buffer`。

`repl_backlog_buffer` 是一个环形缓冲区，默认大小为 1m。主节点会将写入命令存到这个缓冲区中，但是大小有限，待写入的命令超过 1m 后，会覆盖之前的数据，因为是环形写入。

增量同步也是 psync 命令，如果主节点判断从节点传递的 runid 和主节点一致，且根据 offset 判断数据还在`repl_backlog_buffer`中，则说明可以进行增量同步。

于是就去 `repl_backlog_buffer` 查找对应 offset 之后的命令数据，写入到 `replication buffer` 中，最终将其发送给 slave 节点。slave 节点收到指令之后执行对应的命令，一次增量同步的过程就完成了。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/9GIJIcHv_image_mianshiya.png" alt="" width="770" />




如果根据 offset 判断数据已经被覆盖了，此时只能触发全量同步！

因此可以调整 `repl_backlog_buffer` 大小，尽量避免出现全量同步。

### replication buffer 和 repl_backlog_buffer 的区别

#### replication buffer
因为不同的从节点同步速度不一样，**主节点会为每个从节点都创建一个** `replication buffer`，**它用于实时传输写命令**，且大小是动态的，因为对于同步速度较慢的从服务器，需要更多的内存来缓存数据。

虽说 `replication buffer` 没有明确的大小限制，但是可以通过 `client-output-buffer-limit` 间接控制，该参数可以设置不同类型客户端（普通、从服务器、发布订阅）的输出缓冲区限制。当缓冲区大小超过限制时，Redis 会断开与客户端（从节点其实就是一个客户端）的连接。

`client-output-buffer-limit slave 256mb 64mb 60`

上述配置表示，如果从服务器的输出缓冲区大小超过 256 MB 或超过 64 MB 的时间达到 60s，Redis 将断开与从服务器的连接。

#### repl_backlog_buffer

`repl_backlog_buffer` 在主节点上只有一个，**存储最近的写命令**，用于从服务器重新连接时进行部分重同步。


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)