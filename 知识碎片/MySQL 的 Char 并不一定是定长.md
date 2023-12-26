# MySQL 的 Char 并不一定是定长

> 作者：山山水水，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 17561

MySQL的CHAR和VARCHAR有什么区别？可以把 CHAR 全部用 VARCHAR 替换吗？

## 前言

一个太常见的面试题是：**MySQL的CHAR和VARCHAR有什么区别**？

如果你的答案只是：定/变长，性能不同，再加个尾部空格处理不同

那么，**这篇文章一定会带给你一些收获**。

看似简单的面试题，也许也会牵扯到许多底层知识，没有什么是理所当然的。

#### 正文开始

最近在MySQL官网上看到这样一句话：

> Internally, for nonvariable-length character sets, fixed-length character columns such as CHAR(10) are stored in a fixed-length format.

对于「非变长字符集」，CHAR(10) 以定长格式存储，强调了「非变长字符集」

那么，第一个疑问是，**对于「变长字符集」，CHAR(10) 还是定长存储吗？**

作为佐证，《MySQL实战宝典》中说到：鉴于目前默认字符集推荐设置为 UTF8MB4，所以在表结构设计时，可以把 CHAR 全部用 VARCHAR 替换，底层存储的本质实现一模一样。

所以，第二个疑问是，**CHAR比起VARCHAR真的一无是处吗？**

带着这两个疑问，我们就开始今天的探索了。

> 以下基于MySQL 8.0版本

## CHAR定长，"定"的到底是什么

对于CHAR(N)，N 的范围是 0 ~ 255，**指的是字符的个数，而非字节**。这一点非常重要。

> CHAR，VARCHAR，TEXT都是字节；而BINARY，VARBINARY，BLOB都是字符。

而对于「变长字符集」，一个字符对应的字节数是不确定的，而底层存储自然不会关心字符个数，对于VARCHAR而言，行格式的头部元数据也只会存储VARCHAR的字节长度，而非字符长度。

## 我用的是变长字符集吗

MySQL使用`character set`或`charset`来表达字符集。

你可以采用如下命令查看MySQL提供的字符集， 其中`Default collation`代表默认的排序比较规则，`Maxlen`是一个字符对应的最大字节数。

```asciidoc
mysql> SHOW CHARSET LIKE 'utf8%';
--     SHOW CHARACTER SET LIKE 'utf8%'; 
+---------+---------------+--------------------+--------+
| Charset | Description   | Default collation  | Maxlen |
+---------+---------------+--------------------+--------+
| utf8    | UTF-8 Unicode | utf8_general_ci    |      3 |
| utf8mb4 | UTF-8 Unicode | utf8mb4_0900_ai_ci |      4 |
+---------+---------------+--------------------+--------+
```

MySQL默认的字符集是 `utf8mb4` ，排序规则为 `utf8mb4_0900_ai_ci`，除非你在创建数据库，表，字段时显式指定，否则都采用这个默认值，而`utf8mb4`就是一个变长字符集。

你还可以通过`SHOW CREATE TABLE`命令查看具体某一列的字符集。

```sql
SHOW CREATE TABLE [表名称];
```

为了能够存储某些emoji表情，许多字段都会采取 `utf8mb4`作为字符集，因此大部分情况，字符串字段都会采用变长字符集。

## 当「定长字符」遇上「变长字节」

那现在问题就来了，CHAR是定字符数，但字符集导致了字符对应的字节数是不定的。因此：

在「变长字符集」下，CHAR并非定字节存储，而底层存储只认字节不认字符，这该怎么办呢？

这就取决于「存储引擎」和「行格式」的具体实现了。

> 下面都基于InnoDB存储引擎

### Redundant行格式

一种很好想到的简单的做法是：化变为不变。即我们还是希望CHAR是定字节存储，但又要符合用户最大字符数的预期，那我们就让CHAR(N)的字节数为「字符集的一个字符对应的最大字节数*N」。

#### 没用上的字节如何填充

答案是用空格填充，直至CHAR(N)的实际字节数达到「字符集的一个字符对应的最大字节数*N」。

- 存储 CHAR 值时，会用空格将其填充到指定的长度。
- 查询 CHAR 值时，除非启用 `PAD_CHAR_TO_FULL_LENGTH SQL` 模式，否则会**删除尾部空格**。

> 这与VARCHAR不同，VARCHAR在存储和查询时，会保留尾部空格，除非超过列的最大长度。
>
> 下面用官网的例子来理解一下：
>
> ```sql
> -- SQL:
> CREATE TABLE vc (v VARCHAR(4), c CHAR(4));
> INSERT INTO vc VALUES ('ab  ', 'ab  ');
> -- RESULT:
> SELECT CONCAT('(', v, ')'), CONCAT('(', c, ')') FROM vc;
> +---------------------+---------------------+
> | CONCAT('(', v, ')') | CONCAT('(', c, ')') |
> +---------------------+---------------------+
> | (ab  )              | (ab)                |
> +---------------------+---------------------+
> ```

### Compact家族行格式

> Dynamic 和 Compressed都是Compact衍生而来，Dynamic是MySQL8.0 InnoDB的默认行格式。因此，此处介绍的特性对如今广泛使用的 Dynamic 同样适用。

在InnoDB的Compact行格式家族中，对变长字符集的CHAR有特殊优化：

- 如果CHAR(N)的实际字节数小于等于N，不会在尾部追加空格直到达到「字符集的一个字符对应的最大字节数*N」（以utf8mb4为例，就是4 * N），而是追加到N，就停止。
- 如果CHAR(N)的实际字节数大于N，不会在尾部追加空格

#### 为什么仍然至少为N

即便在Compact紧凑行格式下，CHAR都至少占N个字节，既然都已经是变长了，为啥还至少要N个字节呢？官方给出的解释是这样的：

> Reserving the minimum space N in many cases enables column updates to be done in place without causing index page fragmentation.

即在大部分情况下，预留N个字节能够避免「索引页分裂」问题。但继续说这个就跑题了，感兴趣的可以去查一下

## 测试：验证结论

以上都是理论，为了证明我不是在胡说八道，接下来搞点实战：

先来建个表，注意这里用了NOT NULL：

```sql
CREATE TABLE `char_test` (
  `name` char(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

插入三条数据：

```sql
 INSERT INTO char_test(name) values ('😊😊😊😊😊');
 INSERT INTO char_test(name) values ('😊😊😊😊😊');
 INSERT INTO char_test(name) values ('😊😊😊😊');
```

> 😊的十六进制表达为：F0 9F 98 8A

接下来找到数据文件：

```sql
-- 通过这个命令拿到数据文件所在的目录
show variables like '%datadir%';
```

搜索F0 9F 98 8A

![](https://pic.yupi.icu/5563/202312221859370.png)

为了方便你观察，我把它第二条数据和第三条数据单独拎出来看以下：

第二条数据：

```yaml
14 0000 1800 2d00 0000 0013 9400 0000 0338 7782 0000 00a4 0110 
// 5个 F0 9F 98 8A
f09f 988a f09f 988a f09f 988a f09f 988a f09f 988a
```

第三条数据：

```yaml
1000 0020 ff98 0000 0000 1395 0000 0003 387c 8100 0000 a701 10 
// 4个 F0 9F 98 8A
f0 9f98 8af0 9f98 8af0 9f98 8af0 9f98 8a
```

看不懂？让我们简单看一下Dynamic行格式的组成（如果了解可以跳过）

#### Dynamic行格式的组成

##### 1、变长字段的长度

如果变长字段允许存储的最大字节数小于等于 255 字节，就会用 1 字节表示「变长字段长度」；

##### 2、NULL

因为是非NULL，所以不存在

##### 3、头信息

固定5字节

##### 4、隐式数据

由于没有指定主键，MySQL隐式生成6个字节的row_id，以及6个字节的trx_id和7个字节的roll_pointer 。

##### 5、实际数据

最后就是列的实际值。

整体上看就是下面这样（网上找来的图，侵删）

![](https://pic.yupi.icu/5563/202312221858319.png)

### 重新审视实验结果

有了上面的基础，相信大家就能看懂了。

我们观察到第一个位置的14和10，十六进制表达，转为十进制，即为20和16。

隐式主键为 0000 0000 1394 和 0000 0000 1395，后跟13字节的trx_id 和 roll_ptr。实验结果符合理论基础。

至此，我们可以确定：

**CHAR也被InnoDB当作变长字段，使用了「行格式中的变长字段长度列表」来表达CHAR的字节长度，即length()函数的返回值。**

因此，现在可以说：**对于变长字符集，Dynamic行格式的InnoDB，CHAR和VARCHAR的底层存储是一样的。**

#### 那性能呢

即便底层存储是一样的，也不代表性能一定相同。

经过笔者的可能不太精确的测试，得到的结论是：VARCHAR与CHAR的速度是差不多的。

当然在字节数不同的情况下，二者的性能会各有起伏，但总的来说，十分接近。

感兴趣的读者可以自己尝试一下，需要注意Buffer Pool的存在，由于Buffer Pool的缓存预热功能，可能即便重启MySQL，仍然会有部分数据页存在在Buffer Pool中，并且MySQL8.0并不提供任何能够清空Buffer Pool的命令

> 包括`innodb_buffer_pool_size`设为0，`SELECT SQL_NO_CACHE ...`，`FLUSH TABLES` 等方案都是不行的

### 小结

在MySQL8.0，使用InnoDB引擎，及Dynamic行格式，并且采取变长字符集时，在存储底层CHAR是变长的。

有时，CHAR占用的实际空间可能不仅会大于VARCHAR，而且在性能上慢于VARCHAR。

因此，在绝大多数情况下，VARCHAR可以替代CHAR。