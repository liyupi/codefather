# MyBatis框架

在Java Web开发中，MyBatis框架是一款非常常用的数据持久化框架，它能够帮助我们轻松地实现数据的存储和读取。MyBatis的优点在于可以将 SQL 和 Java 代码分离，提高了代码的可读性和可维护性。下面，我们就来深入学习一下MyBatis框架。

## 什么是MyBatis框架

MyBatis框架是一个支持普通 SQL 查询、存储过程和高级映射的持久化框架，通常用于处理大型的Web数据集。MyBatis将数据库操作封装成了一个个的接口，我们只需要编写对应的接口，就可以像调用普通Java方法一样来调用数据操作。MyBatis框架的核心是SqlSessionFactory和SqlSession两个类。

## MyBatis框架的基本使用

在使用MyBatis框架前，我们需要确定好数据库信息，并在配置文件中进行相关的配置：

```
<!-- 数据库配置 -->
<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>

<!-- SQL 映射文件 -->
<mappers>
  <mapper resource="com/xxx/xxx/xxx.xml"/>
</mappers>
```

其中，dataSource标签用于配置数据库连接信息，mappers标签用于指定SQL映射文件的位置。

在配置完成后，我们就可以根据需要编写相应的Java代码，完成数据的存储和读取操作。MyBatis框架提供了两种操作配置文件的方式：

* 基于XML文件的配置
* 基于注解的配置

通常情况下，我们都是使用基于XML文件的配置，因为这样做更好维护，而且更加灵活。对于基于XML文件的配置，我们需要掌握以下几个要点：

* SQL映射文件的基本结构
* 构建SqlSessionFactory对象的代码
* 使用SqlSession执行SQL语句

## SQL映射文件的基本结构

在SQL映射文件中，我们通过定义一些合适的元素来编写SQL语句。其中，最常用的元素有：

* select：查询语句
* insert：插入语句
* update：更新语句
* delete：删除语句
* parameterMap：参数映射
* resultMap：结果映射
* script：动态SQL

以select语句为例，我们来看一下SQL映射文件的基本结构：

```
<select id="selectXXX" parameterType="java.lang.Long" resultMap="BaseResultMap">
  SELECT 
    XXX
  FROM 
    XXX
  WHERE 
    ID = #{id}
</select>
```

其中，id属性是必须的，用于标识这个元素的作用。parameterType属性用于指定参数类型，resultMap属性用于指定结果类型。中间的SQL语句是根据需求编写的，可以根据实际情况来调整。

## 构建SqlSessionFactory对象的代码

SqlSessionFactory是MyBatis框架的核心，它是用来创建 SqlSession 对象的工厂。SqlSession 代表一个与数据库交互的会话，所以我们必须首先创建 SqlSession 对象。创建 SqlSession 对象的代码通常写在单例的工厂类中，以实现应用程序中的多个线程共享 SqlSession 对象。

```
String resource = "com/xxx/xxx/xxx.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
SqlSession sqlSession = sqlSessionFactory.openSession();
```

## 使用SqlSession执行SQL语句

得到 SqlSession 对象后，我们就可以使用它执行 SQL 语句了。MyBatis 框架提供了许多执行 SQL 语句的方法，例如：

* selectOne：查询单条记录
* selectList：查询多条记录
* insert：插入记录
* update：更新记录
* delete：删除记录

以selectList方法为例，我们来看一下具体的使用方式：

```
UserDao mapper = sqlSession.getMapper(UserDao.class);
List<User> userList = mapper.selectList();
```

其中，getMapper方法是用于获取相应的DAO接口的实现类，由MyBatis框架根据接口定义动态生成。当我们调用selectList方法时，框架就会自动根据SQL映射文件中的定义执行相应的SQL语句，最终返回结果给调用方。