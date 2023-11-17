# Objective-C

Objective-C 是一门 OOP（面向对象编程）的编程语言，大家可能会会心地想：“这不挺好，我们都学过 Java，面向对象编程很简单啊！” 然而，Objective-C 与 Java 相比完全是两个世界的东西。与 Java 通过创建类来实现 OOP 不同的是，Objective-C 采用了对现有类进行扩展或增加新类别（Category）的方式实现 OOP。

在 Objective-C 里，Category 是一个非常重要的机制。通过 Category，你可以在不改变原来对象的前提下，为对象添加新的方法，让代码变得更加简洁易读。比如，我们可以给 UIKit UIView 类添加一个新的方法，用于设置 View 边框的圆角：

``` Objective-C
- (void)roundView {
    self.layer.cornerRadius = self.bounds.size.width / 2;
    self.clipsToBounds = YES;
}
```

在方法名前面加上“-”号，就变成了一个实例方法，而这个方法就被添加到了 UIView 类中。

Objective-C 的语法非常灵活，支持的特性也很多。除了 Category，其它的特征也非常值得深入学习，比如 SEL、Block、Protocol、KVC、KVO 等等。