## 为什么 Spring 循环依赖需要三级缓存，二级不够吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Spring 之所以需要**三级缓存**而不是简单的二级缓存，主要原因在于**AOP代理**和**Bean的早期引用问题**。

二级缓存虽然可以解决循环依赖的问题，但在涉及到**动态代理（AOP）** 时，直接使用二级缓存不做任何处理会导致我们**拿到的 Bean 是未代理的原始对象**。如果二级缓存内存放的都是代理对象，则违反了 Bean 的生命周期。

## 扩展知识

### 进一步理解分析为什么需要三级缓存
很明显，如果仅仅只是为了破解循环依赖，二级缓存够了，压根就不必要三级。

你思考一下，在实例化 Bean A 之后，我在二级 map 里面塞入这个 A，然后继续属性注入，发现 A 依赖 B 所以要创建 Bean B，这时候 B 就能从二级 map 得到 A ，完成 B 的建立之后， A 自然而然能完成。

所以**为什么要搞个三级缓存，且里面存的是创建 Bean 的工厂呢**？

我们来看下调用工厂的 getObject 到底会做什么，实际会调用下面这个方法：

```java
protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {
    Object exposedObject = bean;
    if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
        for (SmartInstantiationAwareBeanPostProcessor bp : getBeanPostProcessorCache().smartInstantiationAware) {
            exposedObject = bp.getEarlyBeanReference(exposedObject, beanName);
        }
    }
    return exposedObject;
}Copy to clipboardErrorCopied
```

重点就在中间的判断，如果 false，返回就是参数传进来的 bean，没任何变化。

如果是 true 说明有 InstantiationAwareBeanPostProcessors ，且循环的 smartInstantiationAware 类型，**如有这个 BeanPostProcessor 说明 Bean 需要被 aop 代理**。

我们都知道如果有代理的话，那么我们想要直接拿到的是代理对象，也就是说如果 A 需要被代理，那么 B 依赖的 A 是已经被代理的 A，所以我们不能返回 A 给 B，而是返回代理的 A 给 B。

这个工厂的作用就是判断这个对象是否需要代理，如果否则直接返回，如果是则返回代理对象。

看到这明白的小伙伴肯定会问，那跟三级缓存有什么关系，**我可以在要放到二级缓存的时候判断这个 Bean 是否需要代理，如果要直接放代理的对象不就完事儿了**。

是的，这个思路看起来没任何问题，**问题就出在时机**，这跟 Bean 的生命周期有关系。

正常代理对象的生成是基于后置处理器，是**在被代理的对象初始化后期调用生成的**，**所以如果你提早代理了其实是违背了 Bean 定义的生命周期**。

所以 Spring 先在一个三级缓存放置一个工厂，如果产生循环依赖，那么就调用这个工厂提早得到代理对象，如果没产生依赖，这个工厂根本不会被调用，所以 Bean 的生命周期就是对的。

至此，我想你应该明白为什么会有三级缓存了。

也明白，其实破坏循环依赖，其实只有二级缓存就够了，但是碍于生命周期的问题，提前暴露工厂延迟代理对象的生成。

对了，不用担心三级缓存因为没有循环依赖，数据堆积的问题，最终单例 Bean 创建完毕都会加入一级缓存，此时会清理下面的二、三级缓存。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/oCgImo9n_e567e70b-2376-47f4-b3fd-27cb77fec82f_mianshiya.png" alt="" width="100%" />

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)