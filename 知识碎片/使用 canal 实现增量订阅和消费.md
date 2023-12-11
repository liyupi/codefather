# 使用 canal 实现增量订阅和消费

> 作者：[想飞天的猪头](https://www.code-nav.cn/)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 9414

是不是还有为数据同步找不到合适的方案发愁？本文将介绍一款阿里开源的数据同步框架

## 背景

在工作中我们我们可能需要实时的统计或者处理一些业务表中的数据时候，我们都会进行数据同步或者叫数据迁移的步骤，是为了不影响主业务表的稳定性，当然如果对数据的实时性没有很高的要求的话、我们可以使用定时任务去定时抓取数据，但是这种情况下需要考虑时间间隔，以及每次抓取的数据量，如果业务层面每分钟有300条数据进来，但是我的定时任务却是每分钟抓200条这是不是就出现问题了？或者说某一天业务做大了数据量增加的情况下，先不说查询量大，占用资源，在程序方面就可能造成很多问题，严重的话可能会影响到其他的业务。那么这里就有必要给大家介绍一款数据同步框架了。

## 介绍

![](https://pic.yupi.icu/5563/202311281215501.png)

早期阿里巴巴因为杭州和美国双机房部署，存在跨机房同步的业务需求，实现方式主要是基于业务 trigger 获取增量变更。从 2010 年开始，业务逐步尝试数据库日志解析获取增量变更进行同步，由此衍生出了大量的数据库增量订阅和消费业务。

**canal [kə'næl]**，译意为水道/管道/沟渠，主要用途是基于 MySQL 数据库增量日志解析，提供增量数据订阅和消费

基于日志增量订阅和消费的业务包括

- 数据库镜像
- 数据库实时备份
- 索引构建和实时维护(拆分异构索引、倒排索引等)
- 业务 cache 刷新
- 带业务逻辑的增量数据处理

当前的 canal 支持源端 MySQL 版本包括 5.1.x , 5.5.x , 5.6.x , 5.7.x , 8.0.x

### 原理

![](https://pic.yupi.icu/5563/202311281215510.png)

### MySQL主备复制原理

- MySQL master 将数据变更写入二进制日志( binary log, 其中记录叫做二进制日志事件binary log events，可以通过 show binlog events 进行查看)
- MySQL slave 将 master 的 binary log events 拷贝到它的中继日志(relay log)
- MySQL slave 重放 relay log 中事件，将数据变更反映它自己的数据

### canal 工作原理

- canal 模拟 MySQL slave 的交互协议，伪装自己为 MySQL slave ，向 MySQL master 发送dump 协议
- MySQL master 收到 dump 请求，开始推送 binary log 给 slave (即 canal )
- canal 解析 binary log 对象(原始为 byte 流)

## canal的环境搭建

### 开启binlog日志

上面介绍了canal的实现是基于mysql的binlog日志，那就是说我们首先要把mysql的binlog日志功能开启了。

先进入mysql：

```bash
mysql -uroot -p
```

执行这个：

```bash
show variables like 'log_%';
```

看到这个log_bin打开即可

![](https://pic.yupi.icu/5563/202311281215518.png)

如果显示为OFF状态说明没有打开，需要修改mysql的配置文件`my.cnf`

```bash
vi /etc/my.cnf
### 追加内容
log-bin=mysql-bin   #binlog 文件名
binlog_format=ROW   #选择row模式
server_id=1         #mysql的实例id，不能和canal的slaveId重复
### 重启mysql
service mysql restart 
### 登录查看、
show variables like 'log_%';
```

### 创建canal用户

root用户进入mysql环境，输入以下命令

```bash
# 修改密码校验规则
set global validate_password_length=0;
set global validate_password_policy=LOW;
# 创建用户canal，密码为canal
CREATE USER canal IDENTIFIED BY 'canal';  
# canal用户授权
GRANT SELECT,UPDATE,INSERT,DELETE,REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'canal'@'%';
# 刷新权限
FLUSH PRIVILEGES;
```

### 配置文件

```properties
### vi conf/example/instance.properties
#需要改成自己的数据库信息
canal.instance.master.address=192.168.44.132:3306
#需要改成自己的数据库用户名与密码
canal.instance.dbUsername=root
canal.instance.dbpassword=root
#需要改成同步的数据库表规则，例如只是同步一下表
canal.instance.filter.regex=.*\canal.instance.filter.regex=guli ucenter.ucenter member
```

正则规则：

1. 多个正则之间以逗号(,)分隔，转义符需要双斜杠
2. 所有表: `.*` or `.*\\**`
3. 库下的所有表 ： `canal\\..*`
4. 库下的以canal打头的表：`canal\.canal.*`
5. 库下的一张表：`canal.test1`
6. 多个规则组合使用 `，` 隔开

> **注意:此过滤条件只针对row模式的数据有效(ps mixed/statement因为不解析sql**

### 启动

**进入bin目录下启动**

```bash
sh bin/startup.sh
```

## 整合Spring

### maven依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!--mysql-->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>commons-dbutils</groupId>
        <artifactId>commons-dbutils</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.otter</groupId>
        <artifactId>canal.client</artifactId>
    </dependency>
</dependencies>
```

### 配置文件

```properties
# 服务端口
server.port=10001
# 服务名
spring.application.name=canal-client
# 环境设置：dev、test、prod
spring.profiles.active=dev
# mysql数据库连接
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/guli?serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=root
```

### 编写代码

```java
 @Component
    public class CanalClient {

        //sql队列
        private Queue<String> SQL_QUEUE = new ConcurrentLinkedQueue<>();

        @Resource
        private DataSource dataSource;

        /**
         * canal入库方法
         */
        public void run() {

            CanalConnector connector = CanalConnectors.newSingleConnector(new InetSocketAddress("192.168.61.111",
                    11111), "example", "", "");
            int batchSize = 1000;
            try {
                connector.connect();
                connector.subscribe(".*\\..*");
                connector.rollback();
                try {
                    while (true) {
                        //尝试从master那边拉去数据batchSize条记录，有多少取多少
                        Message message = connector.getWithoutAck(batchSize);
                        long batchId = message.getId();
                        int size = message.getEntries().size();
                        if (batchId == -1 || size == 0) {   //数据没有变化(size>=1,有变化)
                            Thread.sleep(1000);
                        } else {
                            dataHandle(message.getEntries());
                        }
                        connector.ack(batchId);

                        //当队列里面堆积的sql大于一定数值的时候就模拟执行
                        if (SQL_QUEUE.size() >= 1) {
                            executeQueueSql();
                        }
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (InvalidProtocolBufferException e) {
                    e.printStackTrace();
                }
            } finally {
                connector.disconnect();
            }
        }

        /**
         * 模拟执行队列里面的sql语句
         */
        public void executeQueueSql() {
            int size = SQL_QUEUE.size();
            for (int i = 0; i < size; i++) {
                String sql = SQL_QUEUE.poll();
                System.out.println("[sql]----> " + sql);

                this.execute(sql.toString());
            }
        }

        /**
         * 数据处理
         *
         * @param entrys
         */
        private void dataHandle(List<CanalEntry.Entry> entrys) throws InvalidProtocolBufferException {
            for (CanalEntry.Entry entry : entrys) {
                if (EntryType.ROWDATA == entry.getEntryType()) {
                    RowChange rowChange = RowChange.parseFrom(entry.getStoreValue());
                    CanalEntry.EventType eventType = rowChange.getEventType();
                    if (eventType == EventType.DELETE) {
                        saveDeleteSql(entry);
                    } else if (eventType == EventType.UPDATE) {
                        saveUpdateSql(entry);
                    } else if (eventType == CanalEntry.EventType.INSERT) {
                        saveInsertSql(entry);
                    }
                }
            }
        }

        /**
         * 保存更新语句
         *
         * @param entry
         */
        private void saveUpdateSql(CanalEntry.Entry entry) {
            try {
                RowChange rowChange = RowChange.parseFrom(entry.getStoreValue());
                List<RowData> rowDatasList = rowChange.getRowDatasList();
                for (RowData rowData : rowDatasList) {
                    List<CanalEntry.Column> newColumnList = rowData.getAfterColumnsList();
                    StringBuffer sql = new StringBuffer("update " + entry.getHeader().getTableName() + " set ");
                    for (int i = 0; i < newColumnList.size(); i++) {
                        sql.append(" " + newColumnList.get(i).getName()
                                + " = '" + newColumnList.get(i).getValue() + "'");
                        if (i != newColumnList.size() - 1) {
                            sql.append(",");
                        }
                    }
                    sql.append(" where ");
                    List<CanalEntry.Column> oldColumnList = rowData.getBeforeColumnsList();
                    for (CanalEntry.Column column : oldColumnList) {
                        if (column.getIsKey()) {
                            //暂时只支持单一主键
                            sql.append(column.getName() + "=" + column.getValue());
                            break;
                        }
                    }
                    SQL_QUEUE.add(sql.toString());
                }
            } catch (InvalidProtocolBufferException e) {
                e.printStackTrace();
            }
        }

        /**
         * 保存删除语句
         *
         * @param entry
         */
        private void saveDeleteSql(CanalEntry.Entry entry) {
            try {
                RowChange rowChange = RowChange.parseFrom(entry.getStoreValue());
                List<RowData> rowDatasList = rowChange.getRowDatasList();
                for (RowData rowData : rowDatasList) {
                    List<CanalEntry.Column> columnList = rowData.getBeforeColumnsList();
                    StringBuffer sql = new StringBuffer("delete from " + entry.getHeader().getTableName() + " where ");
                    for (CanalEntry.Column column : columnList) {
                        if (column.getIsKey()) {
                            //暂时只支持单一主键
                            sql.append(column.getName() + "=" + column.getValue());
                            break;
                        }
                    }
                    SQL_QUEUE.add(sql.toString());
                }
            } catch (InvalidProtocolBufferException e) {
                e.printStackTrace();
            }
        }

        /**
         * 保存插入语句
         *
         * @param entry
         */
        private void saveInsertSql(CanalEntry.Entry entry) {
            try {
                RowChange rowChange = CanalEntry.RowChange.parseFrom(entry.getStoreValue());
                List<CanalEntry.RowData> rowDatasList = rowChange.getRowDatasList();
                for (RowData rowData : rowDatasList) {
                    List<CanalEntry.Column> columnList = rowData.getAfterColumnsList();
                    StringBuffer sql = new StringBuffer("insert into " + entry.getHeader().getTableName() + " (");
                    for (int i = 0; i < columnList.size(); i++) {
                        sql.append(columnList.get(i).getName());
                        if (i != columnList.size() - 1) {
                            sql.append(",");
                        }
                    }
                    sql.append(") VALUES (");
                    for (int i = 0; i < columnList.size(); i++) {
                        sql.append("'" + columnList.get(i).getValue() + "'");
                        if (i != columnList.size() - 1) {
                            sql.append(",");
                        }
                    }
                    sql.append(")");
                    SQL_QUEUE.add(sql.toString());
                }
            } catch (InvalidProtocolBufferException e) {
                e.printStackTrace();
            }
        }

        /**
         * 入库
         * @param sql
         */
        public void execute(String sql) {
            Connection con = null;
            try {
                if(null == sql) return;
                con = dataSource.getConnection();
                QueryRunner qr = new QueryRunner();
                int row = qr.execute(con, sql);
                System.out.println("update: "+ row);
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                DbUtils.closeQuietly(con);
            }
        }
}
```

## 总结

目前大多数企业都在选择canal作为数据同步的技术方案，在分布式系统中有着广泛的应用，其实其中的内容还有很多，企业中大多是结合kafka和zookpeer去进行多节点注册处理数据，本文只是简单了解，提供一种解决日常开发设计的经验。我们可以更好的解决数据同步的问题。