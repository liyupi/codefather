## Spring 如何解决循环依赖？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
关键就是**提前暴露未完全创建完毕的 Bean**。

在 Spring 中主要是使用**三级缓存**来解决了循环依赖：

- 一级缓存（Singleton Objects Map）: 用于存储完全初始化完成的单例Bean。
- 二级缓存（Early Singleton Objects Map）: 用于存储尚未完全初始化，但已实例化的Bean，用于提前暴露对象，避免循环依赖问题。
- 三级缓存（Singleton Factories Map）: 用于存储对象工厂，当需要时，可以通过工厂创建早期Bean（特别是为了支持AOP代理对象的创建）。

**解决步骤**：
- Spring 首先创建 Bean 实例，并将其加入三级缓存中（Factory）。
- 当一个 Bean 依赖另一个未初始化的 Bean 时，Spring 会从三级缓存中获取 Bean 的工厂，并生成该 Bean 的代理对象。
- 代理对象存入二级缓存，解决循环依赖。
- 一旦所有依赖 Bean 被完全初始化，Bean 将转移到一级缓存中。

## 扩展知识

在 Spring 中，只有同时满足以下两点才能解决循环依赖的问题：

1. 依赖的 Bean 必须都是单例
2. 依赖注入的方式，必须**不全是**构造器注入，且 beanName 字母序在前的不能是构造器注入


### 为什么必须都是单例

如果从源码来看的话，循环依赖的 Bean 是原型模式，会直接抛错：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/3iKT1Kq0_image_mianshiya.png" alt="image.png" width="754px" />

所以 Spring 只支持单例的循环依赖，**但是为什么呢**？

按照理解，如果两个 Bean 都是原型模式的话，那么创建 A1 需要创建一个 B1，创建 B1 的时候要创建一个 A2，创建 A2 又要创建一个 B2，创建 B2 又要创建一个 A3，创建 A3 又要创建一个 B3.....

就又卡 BUG 了，是吧，因为原型模式都需要创建新的对象，不能跟用以前的对象。

如果是单例的话，创建 A 需要创建 B，而创建的 B 需要的是之前的个 A， 不然就不叫单例了，对吧？

也是基于这点， Spring 就能操作操作了。

具体做法就是：先创建 A，此时的 A 是不完整的（没有注入 B），用个 map 保存这个不完整的 A，再创建 B ，B 需要 A，所以从那个 map 得到“不完整”的 A，此时的 B 就完整了，然后 A 就可以注入 B，然后 A 就完整了，B 也完整了，且它们是相互依赖的。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/d4jnaHHm_image_mianshiya.png" alt="image.png" width="597px" />


读起来好像有点绕，但是逻辑其实很清晰。

### 为什么不能全是构造器注入
在 Spring 中创建 Bean 分三步:
1. 实例化，createBeanInstance，就是 new 了个对象
2. 属性注入，populateBean， 就是 set 一些属性值
3. 初始化，initializeBean，执行一些 aware 接口中的方法，initMethod，AOP代理等

明确了上面这三点，再结合我上面说的“不完整的”，我们来理一下。

如果全是构造器注入，比如`A(B b)`，那表明在 new 的时候，就需要得到 B，此时需要 new B ，但是 B 也是要在构造的时候注入 A ，即`B(A a)`，这时候 B 需要在一个 map 中找到不完整的 A ，发现找不到。

为什么找不到？因为 A 还没 new 完呢，所以找不到完整的 A，**因此如果全是构造器注入的话，那么 Spring 无法处理循环依赖**。

### 一个set注入，一个构造器注入一定能成功？
假设我们 A 是通过 set 注入 B，B 通过构造函数注入 A，此时是**成功的**。

我们来分析下：实例化 A 之后，此时可以在 map 中存入 A，开始为 A 进行属性注入，发现需要 B，此时 new B，发现构造器需要 A，此时从 map 中得到 A ，B 构造完毕，B 进行属性注入，初始化，然后 A 注入 B 完成属性注入，然后初始化 A。

整个过程很顺利，没毛病。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/CBz478fq_image_mianshiya.png" alt="image.png" width="507px" />



假设 A 是通过构造器注入 B，B 通过 set 注入 A，此时是**失败的**。

我们来分析下：实例化 A，发现构造函数需要 B， 此时去实例化 B，然后进行 B 的属性注入，从 map 里面找不到 A，因为 A 还没 new 成功，所以 B 也卡住了，然后就 gg。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/VaS07mhy_image_mianshiya.png" alt="image.png" width="490px" />


看到这里，仔细思考的小伙伴可能会说，可以先实例化 B 啊，往 map 里面塞入不完整的 B，这样就能成功实例化 A 了啊。

确实，思路没错**但是 Spring 容器是按照字母序创建 Bean 的，A 的创建永远排在 B 前面**。

现在我们总结一下：

- 如果循环依赖都是构造器注入，则失败
- 如果循环依赖不完全是构造器注入，则可能成功，可能失败，具体跟BeanName的字母序有关系。

### Spring 解决循环依赖全流程

经过上面的铺垫，我想你对 Spring 如何解决循环依赖应该已经有点感觉了，接下来我们就来看看它到底是如何实现的。

明确了 Spring 创建 Bean 的三步骤之后，我们再来看看它为单例搞的三个 map：

1. 一级缓存，singletonObjects，存储所有已创建完毕的单例 Bean （完整的 Bean）
2. 二级缓存，earlySingletonObjects，存储所有仅完成实例化，但还未进行属性注入和初始化的 Bean
3. 三级缓存，singletonFactories，存储能建立这个 Bean 的一个工厂，通过工厂能获取这个 Bean，延迟化 Bean 的生成，工厂生成的 Bean 会塞入二级缓存

这三个 map 是如何配合的呢？

1. 首先，获取单例 Bean 的时候会通过 BeanName 先去 singletonObjects（一级缓存） 查找完整的 Bean，如果找到则直接返回，否则进行步骤 2。
2. 看对应的 Bean 是否在创建中，如果不在直接返回找不到（返回null），如果是，则会去 earlySingletonObjects （二级缓存）查找 Bean，如果找到则返回，否则进行步骤 3
3. 去 singletonFactories （三级缓存）通过 BeanName 查找到对应的工厂，如果存着工厂则通过工厂创建 Bean ，并且放置到 earlySingletonObjects 中。
4. 如果三个缓存都没找到，则返回 null。

从上面的步骤我们可以得知，如果查询发现 Bean 还未创建，到第二步就直接返回 null，不会继续查二级和三级缓存。

返回 null 之后，说明这个 Bean 还未创建，这个时候会标记这个 Bean 正在创建中，然后再调用 createBean 来创建 Bean，而实际创建是调用方法 doCreateBean。

doCreateBean 这个方法就会执行上面我们说的三步骤：

1. 实例化
2. 属性注入
3. 初始化

在实例化 Bean 之后，**会往 singletonFactories 塞入一个工厂，而调用这个工厂的 getObject 方法，就能得到这个 Bean**。

```java
addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
```

要注意，此时 Spring 是不知道会不会有循环依赖发生的，**但是它不管**，反正往 singletonFactories 塞这个工厂，这里就是**提前暴露**。

然后就开始执行属性注入，这个时候 A 发现需要注入 B，所以去 getBean(B)，此时又会走一遍上面描述的逻辑，到了 B 的属性注入这一步。

此时 B 调用 getBean(A)，这时候一级缓存里面找不到，但是发现 A 正在创建中的，于是去二级缓存找，发现没找到，于是去三级缓存找，然后找到了。

并且通过上面提前在三级缓存里暴露的工厂得到 A，然后将这个工厂从三级缓存里删除，并将 A 加入到二级缓存中。

然后结果就是 B 属性注入成功。

紧接着 B 调用 initializeBean 初始化，最终返回，此时 B 已经被加到了一级缓存里 。

这时候就回到了 A 的属性注入，此时注入了 B，接着执行初始化，最后 A 也会被加到一级缓存里​，且从二级缓存中删除 A。

Spring 解决依赖循环就是按照上面所述的逻辑来实现的。

重点就是在对象实例化之后，都会在三级缓存里加入一个工厂，提前对外暴露还未完整的 Bean，这样如果被循环依赖了，对方就可以利用这个工厂得到一个不完整的 Bean，破坏了循环的条件。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)