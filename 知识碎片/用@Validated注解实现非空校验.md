# 用@Validated注解实现非空校验

> 作者：[平安](https://github.com/lizhe-0423)，[编程导航](https://www.codefather.cn) 编号 15592

## 文章背景



首先我们在看鱼皮🐟的项目时 经常发现 关于一些校验我们都是采用手写的方式



像这样：



![](https://pic.yupi.icu/5563/202311030940342.gif)



或者这样：



![](https://pic.yupi.icu/5563/202311030940363.gif)



（大家能够看的出来上面代码片段出自哪个项目嘛？）



### 先说结论



关于上述写法的优点就是灵活，当然也有缺点：



我们需要在每一个Controller都要进行一次这样的校验，甚至每一个Service层同样的要进行如下的校验（非常繁琐、甚至容易遗忘）



**那么有没有一种什么更好的方式呢？@Validated 注解 ！**



## @Validated 注解使用



![](https://pic.yupi.icu/5563/202311030940369.gif)



1）首先从控制层上接收参数那里添加上这段@Validated 注解



2）然后相对应的实体类 去加上注解就可以生效了！



![](https://pic.yupi.icu/5563/202311030940373.gif) 



然后当我们在使用的时候就会发现：



![](https://pic.yupi.icu/5563/202311030940372.gif)



![](https://pic.yupi.icu/5563/202311030940373.gif)



**直接就会报错 然后返回给前端错误信息（以上统一封装了错误信息）**



**除此之外关于@Validated 还有如下注解可以一起使用！**



**各位🐟油们,大家也快去试一试吧！**



```java
空检查
 @Null  验证对象是否为null
 @NotNull 验证对象是否不为null, 无法查检长度为0的字符串
 @NotBlank 检查约束字符串是不是Null还有被Trim的长度是否大于0,只对字符串,且会去掉前后空格.
 @NotEmpty    检查约束元素是否为NULL或者是EMPTY. 

 Booelan检查
 @AssertTrue   验证 Boolean 对象是否为 true 
 @AssertFalse 验证 Boolean 对象是否为 false 

 长度检查
 @Size(min=, max=)    验证对象（Array,Collection,Map,String）长度是否在给定的范围之内 
 @Length(min=, max=) 验证注解的元素值长度在min和max区间内

 日期检查
 @Past    验证 Date 和 Calendar 对象是否在当前时间之前 
 @Future   验证 Date 和 Calendar 对象是否在当前时间之后 
 @Pattern 验证 String 对象是否符合正则表达式的规则

 数值检查，建议使用在Stirng,Integer类型，不建议使用在int类型上，因为表单值为“”时无法转换为int，但可以转换为Stirng为"",Integer为null
 @Min    验证 Number 和 String 对象是否大等于指定的值 
 @Max    验证 Number 和 String 对象是否小等于指定的值 
 @DecimalMax 被标注的值必须不大于约束中指定的最大值. 这个约束的参数是一个通过BigDecimal定义的最大值的字符串表示.小数存在精度
 @DecimalMin 被标注的值必须不小于约束中指定的最小值. 这个约束的参数是一个通过BigDecimal定义的最小值的字符串表示.小数存在精度
 @Digits     验证 Number 和 String 的构成是否合法 
 @Digits(integer=,fraction=) 验证字符串是否是符合指定格式的数字，interger指定整数精度，fraction指定小数精度。

 @Range(min=, max=) 验证注解的元素值在最小值和最大值之间
 @Range(min=10000,max=50000,message="range.bean.wage")
 private BigDecimal wage;

 @Valid 递归的对关联对象进行校验, 如果关联对象是个集合或者数组,那么对其中的元素进行递归校验,如果是一个map,则对其中的值部分进行校验.(是否进行递归验证)
 @CreditCardNumber信用卡验证
 @Email 验证是否是邮件地址，如果为null,不进行验证，算通过验证。
 @ScriptAssert(lang= ,script=, alias=)
 @URL(protocol=,host=, port=,regexp=, flags=)

 
```



