# Java 处理表格，真的很爽！

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

> 一个简单又快速的表格处理库

大家好，我是鱼皮。

处理 Excel 表格是开发中经常遇到的需求，比如表格合并、筛选表格中的某些行列、修改单元格数据等。

今天给大家分享一个 Java 处理表格的工具库，不需要任何专业知识，拿来就能用，快速又轻松~

![](https://pic.yupi.icu/5563/202311081004788.png)

可能有同学说了，用 Python 处理表格不是更方便么？为毛用 Java 啊？

当然是因为企业中大部分后台开发用的都是 Java！如果你要搞一个允许用户自主上传 Excel 进行处理的服务，那显然直接用 Java 来实现最方便~

![](https://pic.yupi.icu/5563/202311081004380.png)

## Easy Excel

要介绍的库是阿里的 Easy Excel，简单、省内存的读写 Excel 的开源项目。

> 文档地址：[https://www.yuque.com/easyexcel/doc/easyexcel](https://www.yuque.com/easyexcel/doc/easyexcel)

直接打开官方文档，就能看到项目的使用说明了：

![](https://pic.yupi.icu/5563/202311081004541.png)官方文档

首先在项目中引入 Easy Excel（版本号以文档中的最新版本号为主）：

```
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.0.5</version>
</dependency>
```

然后进入文档的 **快速开始** 部分，就可以看到读取和写入表格数据的方法了。

下面让我们以一个实际需求为例，试着使用一下这个库。

### 需求

假设我们有这样一个 Excel 表格：

![](https://pic.yupi.icu/5563/202311081004792.png)

如果想要调换 **姓名列** 和 **年龄列** 的顺序，应该怎么做呢？

### 读取表格

首先要读取原始表格中的数据。

Easy Excel 提供了两种读取表格的方式：**创建对象的读** 和 **不创建对象的读** 。

#### 创建对象的读

如果你已知整个表格的表头信息，比如列名（比如 “姓名”）和列的数据类型（比如字符串），那么可以创建一个对应的类，用来在 Java 中表示表格的元信息。

比如为上述表格创建 `YupiData` 类，代码如下：

```
@Data
public class YupiData {
  // 姓名
  private String name;
  // 年龄
  private Integer age;
  // 出生日期
  private Date bornDate;
}
```

默认会根据属性的顺序来关联表格列的顺序，比如 name 对应姓名（第 0 列）、age 对应年龄（第 1 列）。

当然，你也可以使用注解的方式来指定每个属性对应的表格列，支持指定下标和列名，代码如下：

```
@Data
public class YupiData {
  // 强制读取下标为 2 的列（第三列）
  @ExcelProperty(index = 2)
  // 指定接受日期的格式
  @DateTimeFormat("yyyy/MM/dd")
  private Date bornDate;
    
  // 用名字去匹配，不能和其他列重复
  @ExcelProperty("年龄")
  private Integer age;
    
  @ExcelProperty("姓名")
  private String name;
}
```

定义好了表格数据类，就可以开始读取了，该库非常贴心，提供了 **同步** 和 **异步** 两种读取方式。

同步是指一次性读取表格中的所有行，以列表的方式完整返回，再整体去处理。由于这种方式会将数据完整加载到内存中，因此只 **适用于表格行数比较少** 的情况。代码如下：

```
    /**
     * 同步读取
     */
    public void synchronousRead() {
      String fileName = "鱼皮的表格.xlsx";
      // 读取到的数据
      List<YupiData> list = EasyExcel.read(fileName)
       .head(YupiData.class)
        .sheet()
        .doReadSync();
    }
```

异步方式需要定义一个 **监听器** ，每读取一行，就要立即去处理该行数据。这样就不需要将所有数据都加载到内存中，算一行读一行，理论上算完了也可以丢弃。代码如下：

```
/**
 * 定义监听器
 */ 
public class YupiDataListener 
    implements ReadListener<YupiData> {
  /**
   * 每读一行数据，都会调用一次
   *
   * @param data 一行数据
   * @param context 上下文
   */
  @Override
  public void invoke(YupiData data, AnalysisContext context) {
    // 输出姓名
    System.out.println(data.getName());
  }
}

/**
 * 开始读取
 */
void assynchronousRead() {
  String fileName = "鱼皮的表格.xlsx";
  EasyExcel.read(fileName, YupiData.class,
      new YupiDataListener())
      .sheet()
      .doRead();
}
```

#### 不创建对象的读

如果事先不清楚表格会有哪些列、类型如何（比如让用户自主上传表格），那么可以使用 **不创建对象读** 的方式，直接用 `Map<Integer, String>` 泛型类来接收：

```
List<Map<Integer, String>> list = EasyExcel
    .read(fileName)
    .sheet()
    .doReadSync();
// Map 的 key 为列下标，value 为单元格的值
for (Map<Integer, String> data : list) {
 ... 
}
```

当然，这种读取方式也同时支持同步和异步，可以根据需求选择方式，灵活的一批！

### 写入表格

学会读取后，写入表格就更简单了，依然是先定义一个类，用来表示要写入表格的元信息（列名、列数据类型等）。

比如要完成表格列顺序调换的需求，定义表格数据类的时候，把 age 和 name 属性的顺序换一下就好了：

```
@Data
public class YupiWriteData {
  // 年龄 ↑
  private Integer age;
  // 姓名 ↓
  private String name;
  // 出生日期
  private Date bornDate;
}
```

然后执行 Easy Excel 的 write 方法，就完事了，代码如下：

```
void doWrite() {
  // 已读取和处理后的数据列表
  List<YupiWriteData> dataList = xxx;
  String fileName = "result.xlsx";
  EasyExcel.write(fileName, YupiWriteData.class)
      .sheet("工作表1")
      .doWrite(dataList);
}
```

搞定，是不是贼简单！

除了这个库外，Java 处理 Excel 的库还有很多，比如 Apache POI、Hutool 等，大家可以去试试。但我个人感觉还是 Easy Excel 更对我的胃口。



------


好了，是不是很简单了，有兴趣的话自己写个表格处理程序吧~

学到的话，帮鱼皮点个 **赞 + 在看** 呗，感谢！

![](https://pic.yupi.icu/5563/202311081004090.png)