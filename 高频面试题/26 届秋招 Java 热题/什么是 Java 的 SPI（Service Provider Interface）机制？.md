## 什么是 Java 的 SPI（Service Provider Interface）机制？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

SPI 是一种**插件机制**，用于在运行时动态加载服务的实现。它通过定义接口（服务接口）并提供一种可扩展的方式来让服务的提供者（实现类）在运行时注入，实现解耦和模块化设计。

**SPI 机制的核心概念**：
- **服务接口**：接口或抽象类，定义某个服务的规范或功能。
- **服务提供者**：实现了服务接口的具体实现类。
- **服务加载器（`ServiceLoader`）**：Java 提供的工具类，负责动态加载服务的实现类。通过 `ServiceLoader` 可以在运行时发现和加载多个服务提供者。
- **配置文件**：服务提供者通过在 `META-INF/services/` 目录下配置服务接口的文件来声明自己。这些文件的内容是实现该接口的类的完全限定名。

**SPI 机制的优势**：
- **解耦**：接口与实现分离，客户端不需要依赖具体实现，能够在运行时灵活加载不同的实现类。
- **可扩展性**：提供了一种易于扩展的机制，允许后期添加或替换实现类，而不需要修改现有代码。

## 扩展知识

### SPI 通俗理解

**SPI** 可以通俗地理解为一种**插件机制**，用于在程序运行时**动态加载某些功能的实现**。

#### 打个比方：
假设你有一个音乐播放器（相当于一个程序），这个播放器可以播放不同格式的音乐，比如 MP3、WAV、AAC 等格式。你作为用户，并不关心播放器内部是如何解码这些格式的，你只需要它能正常播放音乐。

- **SPI 就像是播放器的插槽**：播放器本身并不内置所有的解码器（MP3 解码器、WAV 解码器等），而是有一个标准接口（SPI），允许外部开发者（服务提供者）开发并“插入”解码器（不同格式的处理实现）。
- **插件机制**：当播放器启动时，它通过 SPI 机制去寻找并加载外部提供的解码器，选择合适的解码器来处理不同的音乐格式。这些解码器可以是程序事先知道的，也可以是后期动态加入的，只要遵循 SPI 规定的接口规范。

#### 带入 Java 中理解：
- Java SPI 就是一个类似的机制。你定义一个接口（类似播放器的插槽），然后不同的开发者实现这个接口，提供不同的实现（类似各种解码器）。
- Java 会通过 SPI 自动加载这些实现，在运行时决定用哪个实现，而不用你手动去修改代码。

总结：SPI 机制的好处是**灵活**，能让程序根据需求**动态地加载或更换某些功能实现**，就像给一个音乐播放器**加装不同的解码器插件**，而不需要每次都修改播放器的核心代码。

一个典型的 SPI 应用场景是 JDBC（Java 数据库连接库），不同的数据库（mysql、oracle、sqlserver 等）有不同的实现，它们根据 JDBC 定制自己的数据库驱动程序，我们根据 SPI 机制使用它们的实现，而不需要修改 JDBC 核心代码。


### 如何实现一个 SPI ？

1）创建一个服务接口：`MyService.java`
 ```java
 public interface MyService {
     void execute();
 }
 ```
2）创建一个服务提供者：`MyServiceImpl.java`

实际上就是接口的实现类：
 ```java
 public class MyServiceImpl implements MyService {
     @Override
     public void execute() {
         System.out.println("Executing MyServiceImpl");
     }
 }
 ```
3）创建配置文件（需要在 `META-INF/services` 目录下创建文件，文件名为接口的全限定名）

`META-INF/services/com.example.MyService`

文件的内容就是实现类的全限定名：

 ```
 com.example.MyServiceImpl
 ```

4）通过 `ServiceLoader` load 接口类型即可加载配置文件中的实现类：
 ```java
 ServiceLoader<MyService> serviceLoader = ServiceLoader.load(MyService.class);
 for (MyService service : serviceLoader) {
     service.execute();
 }
 ```
5）如果要替换实现类，仅需新建一个实现类，然后修改配置文件中的全限定名即可替换，**无需修改使用代码**
 
例如，新建了一个实现类 `MyServiceImplA`
 
```java
 public class MyServiceImplA implements MyService {
     @Override
     public void execute() {
         System.out.println("Executing MyServiceImplA");
     }
 }
```

仅需将`META-INF/services/com.example.MyService`文件中的内容改成

```
com.example.MyServiceImplA
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)