# SpringBoot 整合 ELK 实现日志采集与监控

> 作者：[A达达](https://music.163.com/#/user/home?id=1711732324)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 19158

springboot项目通过logback框架将日志通过logstash管道传输到ElasticSearch,并通过kibbna进行可视化

**一、前言**

```markdown
应用场景：  
1. Web应用日志监控：通过Spring Boot的日志模块将应用的日志信息收集起来，并通过Logstash模块进行解析和过滤，然后将日志信息存储到Elasticsearch中，最后通过Kibana模块展示日志信息和监控指标。  
2. 系统性能监控：通过Spring Boot的监控模块将应用的性能指标收集起来，如CPU使用率、内存使用率、网络流量等，然后通过Logstash模块进行解析和过滤，最后将监控信息存储到Elasticsearch中，通过Kibana模块展示监控信息和生成报表。  
3. 错误信息监控：通过Spring Boot的异常处理模块将应用的错误信息收集起来，如Exception信息、HTTP请求信息等，然后通过Logstash模块进行解析和过滤，最后将错误信息存储到Elasticsearch中，通过Kibana模块展示错误信息和生成报表。  
优点：  
1. 灵活性高：Spring Boot提供了丰富的日志模块和监控模块，可以根据具体需求选择合适的模块进行集成和配置，具有高度的灵活性。  
2. 易于使用：Spring Boot提供了简化配置的方式，可以通过一些注解和属性文件来配置日志和监控模块，降低了配置的复杂度，易于使用。  
3. 功能强大：ELK是一个功能强大的日志管理和监控工具，可以实现日志的采集、存储、搜索和分析等功能，支持生成报表和实时监控，可以满足各种日志和监控需求。  
4. 扩展性强：Spring Boot提供了丰富的扩展点，可以通过自定义中间件和插件来扩展日志和监控功能，满足特定的业务需求。
```

二、环境搭建

```
windows环境:
```

1. 下载elasticSearch logstash kibbna 且必须版本统一 将其解压到英文路径下

   下载官网链接：[下载 Elastic 产品 | Elastic](https://www.elastic.co/cn/downloads/)

2. 配置ELK

```stylus
1.elasticSearch （端口9200）
a.配置elasticsearch.yml
#去除报错
ingest.geoip.downloader.enabled: false
#开启密码
xpack.security.transport.ssl.enabled: true
xpack.security.enabled: true
xpack.license.self_generated.type: basic
b.bin目录下执行为多个用户设置密码
elasticsearch-setup-passwords interactive
c.bin目录下双击elasticsearch.bat文件启动
2.kibbna（端口5601）
a.配置kibbna.yml连接ES
elasticsearch.username: "elastic"
elasticsearch.password: "xxxxx"
b.bin目录下双击kibbna.bat文件启动
3.logstash（端口9600）
a.config目录创建自己的启动配置文件 logstash-meter.conf （名称自定义）
input{
        tcp {
                mode => "server"
                host => "0.0.0.0" 
                port => 9061 #开放这个端口进行采集
                codec => json_lines # 编解码器
    }
}
# 过滤器
filter {
    ruby { 
        code => "event.set('timestamp', event.get('@timestamp').time.localtime + 8*60*60)" 
    }

    ruby {
        code => "event.set('@timestamp',event.get('timestamp'))"
    }
# 忽略字段
        mutate {
    remove_field => ["timestamp","@version","host","port"]
        }
}
output{
        elasticsearch{
                hosts=>["ipaddress:9200"]
                # 在es里产生的index的名称
                index => "logstash-meter-%{+YYYY.MM.dd}"
                user  => "elastic"
                password  => "xxxx"
               template_name => "logstash-meter-template"
                }
        stdout{codec => rubydebug}
}
b.bin目录下执行 logstash -f ../config/logstash-meter.conf
```

`linus环境:`docker部署

```jboss-cli
1.安装docker
#yum 包更新到最新
yum update
#安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的
yum install -y yum-utils device-mapper-persistent-data lvm2
#设置yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
#安装docker，出现输入的界面都按 y
yum install -y docker-ce
#查看docker版本，验证是否验证成功
docker -v
#启动docker
/bin/systemctl start docker.service

2.拉取elasticSearch logstash kibbna
docker pull elasticsearch:7.6.0    
docker pull logstash:7.6.0    
docker pull kibana:7.6.0

3.开放9061端口 用这个端口让日志通过logstash管道保存到es中 并通过kibbna可视化
firewall-cmd --query-port=9061/tcp
firewall-cmd --zone=public --add-port=9061/tcp --permanent 开启
firewall-cmd --zone=public --remove-port=9200/tcp --permanent 关闭
firewall-cmd --reload
---------------------------------------------------------------------------
4.启动elasticSearch logstash kibbna
docker run -id \
-p 9200:9200 \
--name=elasticsearch \
-v /etc/localtime:/etc/localtime \
-e "discovery.type=single-node" \
elasticsearch:7.6.0
---------------------------------------------------------------------------
docker run -id \
-p 5601:5601 \
--name=kibana \
-v /etc/localtime:/etc/localtime \
kibana:7.6.0
---------------------------------------------------------------------------
docker run -id \
-p 9600:9600 \
-p 9061:9061 \
--name=logstash \
-v /etc/localtime:/etc/localtime \
logstash:7.6.0
---------------------------------------------------------------------------
5.配置elasticSearch logstash kibbna
docker exec -it elasticsearch /bin/bash
vi config/elasticsearch.yml
增加
xpack.security.transport.ssl.enabled: true
xpack.security.enabled: true
xpack.license.self_generated.type: basic
重启elasticsearch 开启密码
elasticsearch-setup-passwords interactive
---------------------------------------------------------------------------
docker exec -it kibana /bin/bash
vi config/kibana.yml
elasticsearch.username: "elastic"
elasticsearch.password: "xxxxx"
---------------------------------------------------------------------------
docker exec -it kibana /bin/bash
vi config/logstash.yml
#允许任何主机连接 
http.host: "0.0.0.0"
xpack.monitoring.enabled: true
xpack.monitoring.elasticsearch.username: "elastic"
xpack.monitoring.elasticsearch.password: "xxxxx"
#执行docker inspect elasticSearch 找到ipAddress 
xpack.monitoring.elasticsearch.hosts: [ "http://ipAddress:9200" ]

#编写logstash.conf配置
#配置 数据来源  过滤器 输出配置等信息
input{
        tcp {
                mode => "server"
                host => "0.0.0.0" 
                port => 9061 #开放这个端口进行采集
                codec => json_lines # 编解码器
    }
}
# 过滤器
filter {
    ruby { 
        code => "event.set('timestamp', event.get('@timestamp').time.localtime + 8*60*60)" 
    }

    ruby {
        code => "event.set('@timestamp',event.get('timestamp'))"
    }
# 忽略字段
        mutate {
    remove_field => ["timestamp","@version","host","port"]
        }
}
output{
        elasticsearch{
                hosts=>["ipaddress:9200"]
                # 在es里产生的index的名称
                index => "logstash-meter-%{+YYYY.MM.dd}"
                user  => "elastic"
                password  => "xxxx"
               template_name => "logstash-meter-template"
                }
        stdout{codec => rubydebug}
}
#然后修改pipeline指定conf 或 把conf放到pipeline文件夹下
```

三、**springboot配置（logback.xml配置）**

pom.xml引入maven依赖

```dust
//提供logback的编码器，布局（layouts）和追加器，来输出到json形式的日志。
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>${logstash-logback-encoder.version}</version>
</dependency>
```

配置logback.xml文件 指定日志输出到logstash的端口号

```dust
<!-- 为logstash输出的JSON格式的Appender -->
<appender name="logstash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
    <!--可以访问的logstash日志收集端口-->
    <destination>127.0.0.1:9061</destination>
    <!-- 日志输出Json编码 -->
    <encoder
            class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
        <providers>
            <timestamp>
                <timeZone>UTC</timeZone>
            </timestamp>
            <pattern>
                <pattern>
                    {
                    "ip":"%ip",
                    "serverName":"${serverName}",
                    "thread": "%thread",
                    "level": "%-5level",
                    "logger": "%logger{36}",
                    "message": "%msg"
                    }
                </pattern>
            </pattern>
        </providers>
    </encoder>
</appender>
<root level="INFO">
    <appender-ref ref="logstash" />
</root>
```

四、**kibbna可视化配置**

1. 启动elasticSearch 和 kibbna 打开kibbna网站 localhost:5601 输入设置的账号密码登录认证后进入可视化页面，双击DEV tools 输入下方sql 创建模板(启动logstash之前）

```awk
//新建模板
PUT /_template/logstash-meter-template
{         
  "index_patterns": ["logstash-meter-*"],
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "message": {
        "type": "text"
        , "analyzer": "ik_max_word"
        , "search_analyzer": "ik_smart"
        , "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },

      "ip": {
        "type": "keyword"
      },
      "serverName": {
        "type": "keyword"
      },
      "thread": {
        "type": "keyword"
      },
      "level": {
        "type": "keyword"
      },
      "logger": {
        "type": "keyword"
      }
    }
  }
}
--------------------------------------------------------------------------------
//搜索测试
get /logstash-meter-*/_doc/_search
{
  "query":{
    "match": {
      "message": {
        "query":"xxx"
      }
    }
  }
}
```

2.创建indexpattern，名称设为logstash-meter-*，和上面logstash.conf中index的前缀匹配即可

3.启动springboot项目 和 logstash ，此时发现logstash中会打印springboot项目中的日志，然后在kibbna中找到discovery即可可视化日志信息，还可对其过滤处理，快速定位到我们需要的日志。