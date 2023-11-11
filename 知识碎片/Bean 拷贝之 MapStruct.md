# Bean 拷贝之 MapStruct

> 作者：[顾恙ツ](https://juejin.cn/user/128017175944557)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824)  编号 2784

> 大家好，今天我给大家带来一个 Bean 拷贝的高效工具，MapSrtuct 。有人会问 MapSturct 是什么？简单来说，MapStruct 就是一个 Java Bean 的映射器，我们只需要在一个 XXXStructMapper 的接口中定义好方法，MapStruct 就会在编译的时候生成相应的实现类，这个实现类中包含了具体的映射代码，极大地提高了我们编码的效率，省去了大量的模板代码。

## 传统写法带来的困扰

假如没有使用 MapStruct 的话，当我们需要把 DO 对象转成一个 DTO 对象时，我们需要这样做。

```java
public static ArticleDTO toDto(ArticleDO articleDO) {
    if (articleDO == null) {
        return null;
    }
    ArticleDTO articleDTO = new ArticleDTO();
    articleDTO.setAuthor(articleDO.getUserId());
    articleDTO.setArticleId(articleDO.getId());
    articleDTO.setArticleType(articleDO.getArticleType());
    articleDTO.setTitle(articleDO.getTitle());
    articleDTO.setShortTitle(articleDO.getShortTitle());
    articleDTO.setSummary(articleDO.getSummary());
    articleDTO.setCover(articleDO.getPicture());
    articleDTO.setSourceType(SourceTypeEnum.formCode(articleDO.getSource()).getDesc());
    articleDTO.setSourceUrl(articleDO.getSourceUrl());
    articleDTO.setStatus(articleDO.getStatus());
    articleDTO.setCreateTime(articleDO.getCreateTime().getTime());
    articleDTO.setLastUpdateTime(articleDO.getUpdateTime().getTime());
    articleDTO.setOfficalStat(articleDO.getOfficalStat());
    articleDTO.setToppingStat(articleDO.getToppingStat());
    articleDTO.setCreamStat(articleDO.getCreamStat());

    // 设置类目id
    articleDTO.setCategory(new CategoryDTO(articleDO.getCategoryId(), null));
    return articleDTO;
}
```

如果是需要批量进行转化的话，这个时候还需要遍历进行批量转化。

```java
public static List<ArticleDTO> toArticleDtoList(List<ArticleDO> articleDOS) {
    return articleDOS.stream().map(ArticleConverter::toDto).collect(Collectors.toList());
}
```

这样的代码如果只是一个方法可能还好，但是如果写多了，你就会发现代码不是很优雅，而且每次写代码量还巨大，虽然有插件可以帮你写，但是感觉还是不好，这个时候，肯定有人会说用 BeanUtils，这个时候我会给你大大的一巴掌，主要是 BeeanUtils 其可能会踩一些坑，你可能把握不是很好，这里我找了一些关于 BeanUtils 的一些文章，感兴趣的同学可以一起看看：<br />Spring的BeanUtils.copyProperties()避坑指南：[https://juejin.cn/post/7012279747526787080](https://juejin.cn/post/7012279747526787080)<br />几个 BeanUtils 中的坑，千万别踩！[https://cloud.tencent.com/developer/article/1522266](https://cloud.tencent.com/developer/article/1522266)<br />SpringBoot 整合mapstruct|赶紧丢掉BeanUtils吧：[https://juejin.cn/post/7035161765948162078](https://juejin.cn/post/7035161765948162078)<br />![](https://pic.yupi.icu/5563/202311081045996.jpeg)

那有什么简单的解决方法，那就是我们今天的主角， MapStruct 了，接下来我们简单使用一下 MapStruct演示一下。

```java
@Mapper
public interface ArticleStructMapper {
    ArticleStructMapper INSTANCE = Mappers.getMapper(ArticleStructMapper.class );

    ArticleDTO toDTO(ArticleDO do);
}
```

定义了一个接口 ArticleStructMapper，该接口的主要作用是将 ArticleDO 对象转换为 ArticleDTO 对象。

让我们一步步地分析代码：

> 1. [**@Mapper**](https://www.yuque.com/Mapper)**：**

这是 MapStruct 的核心注解之一。它标记了这个接口为一个映射器，并告诉 MapStruct 的注解处理器在编译时为此接口生成实现。

> 2. **INSTANCE 常量**

```java
ArticleStructMapper INSTANCE = Mappers.getMapper( ArticleStructMapper.class );
```

Mappers.getMapper 是 MapStruct 提供的一个工具方法，用于在不使用 Spring 或其他依赖注入框架的情况下获取映射器的实例。

> 3. **toDTO 方法**：

这个方法定义了一个转换。这个大家都懂，我就不做过多的赘述了。

## MapStruct 的用法

### 引入依赖

在 pom.xml 文件中引入 MapStruct 的 Maven 坐标,这里需要注意，引入 guava 的时候需要注意版本冲突问题，尽量引入大于 19.0 以上的版本，不然可能会报错。

```java
<!-- 引入 mapstruct -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
 	<version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
	 <version>1.5.5.Final</version>
</dependency>
```

它们的作用如下：

1. **org.mapstruct:mapstruct**： 

- MapStruct 的核心库。它提供了 MapStruct 所需的主要注解和工具方法，例如 @Mapper, @Mapping 等注解以及 Mappers.getMapper() 方法。
- 在运行时，这个库是必需的，生成的映射代码会依赖它。

2. **org.mapstruct:mapstruct-processor**： 

- MapStruct 的注解处理器。它在编译时生成具体的映射实现代码。
- compile 作用域，意味着它只在编译时被使用。
- 当你编译一个使用了 MapStruct 注解的项目时，注解处理器会检测你的代码，然后为你的 @Mapper 注解的接口或抽象类生成实现。

### 定义映射器接口

像前面大家看到的 ArticleStructMapper 接口，我们稍微来一个复杂的。这里需要注意导入的 Mapper，是 MapStruct 的 Mapper ，而不是 MyBatis 下的 Mapper。

```java
@Mapper
public interface ColumnStructMapper {
    ColumnStructMapper INSTANCE = Mappers.getMapper( ColumnStructMapper.class );

    /**
     * ColumnInfoDO to ColumnDTO
     * @param columnInfoDO
     * @return
     */
    // sources 是参数，target 是目标
    @Mapping(source = "id", target = "columnId")
    @Mapping(source = "columnName", target = "column")
    @Mapping(source = "userId", target = "author")
    // Date 转 Long
    @Mapping(target = "publishTime", expression = "java(columnInfoDO.getPublishTime().getTime())")
    @Mapping(target = "freeStartTime", expression = "java(columnInfoDO.getFreeStartTime().getTime())")
    @Mapping(target = "freeEndTime", expression = "java(columnInfoDO.getFreeEndTime().getTime())")
    ColumnDTO infotoDto(ColumnInfoDO columnInfoDO);

    List<ColumnDTO> infoToDtos(List<ColumnInfoDO> columnInfoDOs);

    @Mapping(source = "column", target = "columnName")
    @Mapping(source = "author", target = "userId")
    // Long 转 Date
    @Mapping(target = "freeStartTime", expression = "java(new java.util.Date(req.getFreeStartTime()))")
    @Mapping(target = "freeEndTime", expression = "java(new java.util.Date(req.getFreeEndTime()))")
    ColumnInfoDO toDo(ColumnReq req);
}
```

这段代码定义了如何在 ColumnInfoDO 和 ColumnDTO 之间转换，以及如何从 ColumnReq 转换到 ColumnInfoDO。我将为你分析其每一部分：

1. **infotoDto 方法**

- 使用 @Mapping 注解来指定属性映射规则。例如，将 ColumnInfoDO 的 id 属性映射到 ColumnDTO 的 columnId 属性。
- 使用 expression 属性来定义更复杂的属性转换，例如从 Date 对象获取时间戳。

2. **infoToDtos 方法**

显示了 MapStruct 如何轻松地转换对象列表。此方法将 List\<ColumnInfoDO\> 转换为 List\<ColumnDTO\>。因为单个对象的映射已经在 infotoDto 方法中定义，所以这里不需要额外的注解。

3. **toDo 方法**

对于 freeStartTime 和 freeEndTime，因为它们在 ColumnReq 中是 Long 类型的时间戳，而在ColumnInfoDO 中是 Date 类型，所以使用了 expression 属性进行转换。

### [@Mapping](https://www.yuque.com/Mapping) 注解 

这里重点说一下 @Mapping 注解，当两个对象中的字段名或者字段类型不一致的时候，就需要该注解来进行转换。

换句话说，如果对象的字段名/类型完全一样，就完全不需要该注解，Mapstruct 会自动拷贝。

比如说 SimpleSource 和 SimpleDestination 的字段名和类型完全一样：

```java
public class SimpleSource {
    private String name;
    private String description;
    // getters and setters
}
 
public class SimpleDestination {
    private String name;
    private String description;
    // getters and setters
}
```

就只需要定义映射器 SimpleSourceDestinationMapper 就行了。

```java
@Mapper
public interface SimpleSourceDestinationMapper {
    SimpleSourceDestinationMapper INSTANCE = Mappers.getMapper(SimpleSourceDestinationMapper.class);
    SimpleDestination sourceToDestination(SimpleSource source);
    SimpleSource destinationToSource(SimpleDestination destination);
}
```

用的时候，可以这样 SimpleSourceDestinationMapper.INSTANCE 进行转换。

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = QuickForumApplication.class)
public class SimpleSourceDestinationMapperIntegrationTest {

    @Test
    public void givenSourceToDestination_whenMaps_thenCorrect() {
        SimpleSource simpleSource = new SimpleSource();
        simpleSource.setName("沉默王二");
        simpleSource.setDescription("是条狗");
        SimpleDestination destination = SimpleSourceDestinationMapper.INSTANCE.sourceToDestination(simpleSource);
        assertEquals(simpleSource.getName(), destination.getName());
        assertEquals(simpleSource.getDescription(), destination.getDescription());
    }
}
```

OK，回到 [@Mapping](https://www.yuque.com/Mapping) 注解。 

@Mapping 是 MapStruct 中用于定义字段之间映射规则的注解。它非常灵活，能够处理各种复杂的映射情况。以下是 @Mapping 的一些常见用法：

1. **基本映射**：

通过指定 source 和 target 来映射源对象的属性到目标对象的属性。

```java
@Mapping(source = "name", target = "fullName")
```

这将源对象的 name 属性映射到目标对象的 fullName 属性。

2. **常量映射**

可以将目标字段设置为固定的常量值。

```java
@Mapping(target = "status", constant = "ACTIVE")
```

这会将目标对象的 status 属性设置为 "ACTIVE"。

3. **默认值**

当源属性为 null 时，可以为目标属性设置默认值。

```java
@Mapping(source = "count", target = "total", defaultValue = "0")
```

如果 count 为 null，则 total 将被设置为 "0"。

4. **表达式**

对于需要更复杂的转换逻辑，可以使用 Java 表达式。

```java
@Mapping(target = "timestamp", expression = "java(source.getDate().getTime())")
```

5. **日期格式**

对于日期和字符串之间的映射，可以指定日期格式。

```java
@Mapping(source = "date", target = "formattedDate", dateFormat = "yyyy-MM-dd")
```

这会将 Date 对象转换为 "yyyy-MM-dd" 格式的字符串。

6. **条件映射**

使用 qualifiedByName 或 qualifiedBy 来指定一个条件方法或注解，这些方法/注解决定是否应该进行映射。

```java
@Mapping(source = "value", target = "data", qualifiedByName = "specialConverter")
```

这里，映射会使用名为 specialConverter 的方法进行。

7. **嵌套映射**

当处理嵌套对象时，可以使用点表示法。

```java
@Mapping(source = "address.street", target = "streetName")
```

这会将源对象中的 address 对象的 street 属性映射到目标对象的 streetName 属性。

8. **忽略映射**

在某些情况下，可能不希望特定的属性被映射，可以使用 ignore。

```java
@Mapping(target = "internalId", ignore = true)
```

这会确保目标对象的 internalId 属性不被设置。

9. **使用自定义映射方法**

可以指定自定义方法来进行映射。

```java
@Mapping(target = "data", source = "value", qualifiedByName = "customMethod")
```

### Spring 依赖注入

截止到目前为止，我们一直在使用 Mappers.getMapper 来获取映射器 INSTANCE。

```java
ColumnStructMapper INSTANCE = Mappers.getMapper( ColumnStructMapper.class);
```


如果是在 Spring 环境下，还可以在 [@Mapper](https://www.yuque.com/Mapper) 注解中添加 componentModel = "spring" 参数来告诉 MapStruct 在生成映射实现类的时候，提供 Spring 依赖注入。

```java
@Mapper(componentModel = "spring")
public interface ColumnStructMapper {}
```


这样我们在使用映射器的时候，可以直接通过 @Autowired 注解来注入 ColumnStructMapper 对象，然后就可以直接这样使用。

```java
@Autowired
private ColumnStructMapper columnStructMapper;
ColumnInfoDO columnInfoDO = columnStructMapper.toDo(req);
```

这样就不需要在映射器接口中添加 INSTANCE 了。

## MapStruct 插件

如果你在 Intellij IDEA 中安装 MapStruct 插件的话，直接在插件市场搜 MapStruct 关键字就可以了。

![](https://pic.yupi.icu/5563/202311081048480.png)

安装完成后，可以直接在 [@Mapper](https://www.yuque.com/Mapper) 接口和它的实现类之间快速导航。 

![](https://pic.yupi.icu/5563/202311081048118.png)

比如说点击上图中的跳转小图标，就可以直接到实现类。

![](https://pic.yupi.icu/5563/202311081048973.png)

## **MapStruct 的背后原理**

Java 程序执行的过程，是由编译器先把 java 文件编译成 class 字节码文件，然后由 JVM 去解释执行 class 文件。

Mapstruct 正是在 java 文件到 class 这一步帮我们实现了转换方法，即做了预处理，提前编译好文件，用过 lombok 的小伙伴一定能理解其好处。

首先我们来看最简单的 SimpleSourceDestinationMapper，它是这样定义的。

```java
@Mapper
public interface SimpleSourceDestinationMapper {
    SimpleSourceDestinationMapper INSTANCE = Mappers.getMapper(SimpleSourceDestinationMapper.class);
    
    SimpleDestination sourceToDestination(SimpleSource source);
    
    SimpleSource destinationToSource(SimpleDestination destination);
}
```

<br />其在编译后会生成两个文件 SimpleSourceDestinationMapper 和 SimpleSourceDestinationMapperImpl。

![](https://pic.yupi.icu/5563/202311081049390.png)

通过终端可以看到 class 文件的后缀。

![](https://pic.yupi.icu/5563/202311081049134.png)

OK，我们直接来看 class 文件的内容，当然是反编译后的，Intellij IDEA 可以直接打开，先是 SimpleSourceDestinationMapper。

![](https://pic.yupi.icu/5563/202311081049183.png)

再来看实现类 SimpleSourceDestinationMapperImpl，我们直接贴反编译后的代码。

```java
public class SimpleSourceDestinationMapperImpl implements SimpleSourceDestinationMapper {
    public SimpleSourceDestinationMapperImpl() {
    }

    public SimpleDestination sourceToDestination(SimpleSource source) {
        if (source == null) {
            return null;
        } else {
            SimpleDestination simpleDestination = new SimpleDestination();
            simpleDestination.setName(source.getName());
            simpleDestination.setDescription(source.getDescription());
            return simpleDestination;
        }
    }

    public SimpleSource destinationToSource(SimpleDestination destination) {
        if (destination == null) {
            return null;
        } else {
            SimpleSource simpleSource = new SimpleSource();
            simpleSource.setName(destination.getName());
            simpleSource.setDescription(destination.getDescription());
            return simpleSource;
        }
    }
}
```

其实内容和我们直接去写 Converter 是一样的，通过 new 创建一个对象，然后通过 set 方法进行赋值。

如果是 @Mapper(componentModel = "spring") 的话，在生成的时候，会带上 [@Component](https://www.yuque.com/Component) 注解。 <br />![](https://pic.yupi.icu/5563/202311081050327.png)

> 使用 [**@Component**](https://www.yuque.com/Component) 注解的类将会在 Spring 的组件扫描期间被检测并注册到 ApplicationContext 中，从而使其成为一个 Spring Bean。


这也是为什么我们可以直接通过 [@Autowired](https://www.yuque.com/Autowired) 注解获得映射器对象的原因。 

由于 MapStruct 并不是在运行时使用 Java 反射来实现对象之间的映射，而是在编译时生成明确、简单、易于跟踪的普通 Java 代码。这意味着它的执行速度更快，因为没有运行时的反射开销，并且可以避免与反射相关的各种问题。
