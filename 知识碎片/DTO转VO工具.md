# DTO转VO工具

> 作者：[一瓶牛奶](https://blog.csdn.net/Dear_SunJunchen?type=blog)，[编程导航](https://www.codefather.cn) 编号 13461

data工具，实现了对象拷贝 DTO -> VO 只需要实现一个类即可

## data-utils

data工具，实现了对象拷贝 DTO -> VO

## 解决的问题

Mapstruct需要安插件!!!!很多云桌面等会很不方便

`org.springframework.beans.BeanUtils`有一个 `copyProperties`的方法

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO  {

    private Long id;
    private String username;
    private String password;
    private String gender;
    private String email;
    private String role;
    private Date registerTime;
    private Integer isDelete;
}
@Data
public class AccountVO {
    private String username;
    private String gender;
    private String role;
    //男 1 女 0
    private String genderNum;

    private Integer isDelete;
}
```

比如我们有两个类 `DTO` 和 `VO` 在给前端`VO`的时候,需要把`DTO` 转换成`VO` 我们需要这样写 遇到`genderNum` `DTO`类里没有的这种情况,我们需要手动`set`的时候，是下面这种写法

```java
import com.example.entity.AccountVO;

@Data
public class DataTest {
    @Test
    void contextLoads1() {
        AccountDTO accountDTO = new AccountDTO(1L, "test", "123456", "男", "112@qq.com", "user", new Date(), 1);
        AccountVO accountVO =  new AccountVO();
        BeanUtils.copyProperties(accountDTO, accountVO);
        accountVO.setGender(Objects.equals(accountDTO.getGender(), "男") ? "1" : "0");
        System.out.println(accountVO);
    }
}
```

有两个缺点:

1. `VO`需要手动new一个出来
2. 如果`VO`里面有很多字段需要手动`set`的时候,会把代码写的很长
3. 如果遇到集合里面想要转换, `sonar`还会报不让在循环中创建对象的问题

## BaseData的作用

BaseData代码(项目里只要有这个就可以)

```java
import com.example.common.Constants;
import com.example.common.ErrorCode;
import com.example.exception.BusinessException;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.*;
import java.util.Arrays;
import java.util.function.Consumer;

public interface BaseData {

    /**
     * 默认方法，根据传入的Class3类型将当前对象转换为目标对象并执行操作
     *
     * @param clazz    目标类
     * @param consumer 可以写lambda表达式比如
     *  accountDTO.asTargetObject(AccountVO.class,v->{
     *      v.setGenderNum(Objects.equals(accountDT0.getGender(),"男")?"1":"0");
     *          });
     *  consumer是这段
     *  v->{
     *      v.setGenderNum(Objects.equals(accountDT0.getGender(),"男")?"1":"0");
     *  }
     */
    default <V> V asTargetObject(Class<V> clazz, Consumer<V> consumer) {
//        调用 asTargetObject 方法将当前对象转换为目标对象
        V v = this.asTargetObject(clazz);
//        执行传入的Consumer操作
        consumer.accept(v);
        return v;
    }

    /**
     * 默认方法 将当前对象转换为目标对象
     *
     * @param clazz 目标类
     * @param <V>   目标类类型 如AccountVO
     * @return 转换完的目标类
     */
    default <V> V asTargetObject(Class<V> clazz) {
        try {
//            获取目标类的所有字段
            Field[] declaredFields = clazz.getDeclaredFields();
//            获取目标类的构造函数
            Constructor<V> constructor = clazz.getConstructor();
//            根据构造函数实例化目标对象
            V v = constructor.newInstance();
//            遍历目标类的每个字段，并进行转换试值
            Arrays.stream(declaredFields).forEach(declaredField -> convert(declaredField, v));
            return v;
        } catch (ReflectiveOperationException e) {
//            //捕获ReflectiveOperationException异常，抛出自定义的BusinessException
            throw new BusinessException(ErrorCode.CAST_OBJECT_ERROR);
        }

    }

    /**
     * 默认方法,将字段转换并赋值给目标对象
     * @param field VO剩余的字段，自定义
     * @param vo    要转换的VO
     */
    default void convert(Field field, Object vo) {

        try {
//            获取当前对象中与目标字段同名的字段
            Field source = this.getClass().getDeclaredField(field.getName());
//            设置字段可访问
            ReflectionUtils.makeAccessible(field);
            ReflectionUtils.makeAccessible(source);
//            获取当前对象中获取字段值的方法和目标对象中设置字段值的方法，并进行转换赋值
            Method sourceGetter = this.getClass().getMethod(Constants.GET + capitalize(field.getName()));
            Method targetSetter = vo.getClass().getMethod(Constants.SET + capitalize(field.getName()), field.getType());
            Object value = sourceGetter.invoke(this);
            targetSetter.invoke(vo, value);
        } catch (NoSuchFieldException | InvocationTargetException | IllegalAccessException |
                 NoSuchMethodException ignored) {
//              这里ignored 原因是
//              两个类的字段数量不一样的时候，会报 java.lang.NoSuchFieldException
//              但是多出来的字段我们是可以处理的
        }
    }

    /**
     * 默认方法,将字符串首字母大写
     * @param str   比如字段名 name
     * @return 返回 Name
     */
    default String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }
}
```

1. 实现对象深拷贝

```java
@Data
public class DataTest {
    @Test
    void contextLoads1() {
        AccountDTO accountDTO = new AccountDTO(1L,"test","123456","男","112@qq.com","user",new Date(),1);
        AccountVO accountVO = accountDTO.asTargetObject(AccountVO.class,v->{
            v.setGenderNum(Objects.equals(accountDTO.getGender(), "男") ? "1" : "0");
        });
        System.out.println(accountVO);
    }
}
```

1. 实现对象Collection 深拷贝(List Set ...)

```java
@Data
public class DataTest {
    @Test
    void contextLoads2() {
        AccountDTO accountDTO = new AccountDTO(1L,"test","123456","男","112@qq.com","user",new Date(),0);
        AccountDTO accountDTO2 = new AccountDTO(2L,"test2","123456","女","112@qq.com","admin",new Date(),1);
        List<AccountDTO> accountDTOList = new ArrayList<>();
        accountDTOList.add(accountDTO);
        accountDTOList.add(accountDTO2);
        List<AccountVO> list = accountDTOList.stream().map(source -> source.asTargetObject(AccountVO.class, v-> {
            v.setGenderNum(Objects.equals(source.getGender(), "男") ? "1" : "0");
        })).collect(Collectors.toList());
        list.forEach(System.out::println);
    }

    @Test
    void contextLoads3() {
        AccountDTO accountDTO = new AccountDTO(1L,"test","123456","男","112@qq.com","user",new Date(),1);
        AccountDTO accountDTO2 = new AccountDTO(2L,"test2","123456","女","112@qq.com","admin",new Date(),0);
        Set<AccountDTO> accountDTOSet = new HashSet<>();
        accountDTOSet.add(accountDTO);
        accountDTOSet.add(accountDTO2);
        Set<AccountVO> set = accountDTOSet.stream().map(source -> source.asTargetObject(AccountVO.class, v-> {
            v.setGenderNum(Objects.equals(source.getGender(), "男") ? "1" : "0");
        })).collect(Collectors.toSet());
        set.forEach(System.out::println);
    }
}
```

## 实现步骤

```markdown
1. dto 实现 BaseData接口
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO implements BaseData {

    private Long id;
    private String username;
    private String password;
    private String gender;
    private String email;
    private String role;
    private Date registerTime;
    private Integer isDelete;
}
2. dto.asViewObject(Target.class);
3. 如果 Target 还有其他字段 也可以自定义，例如测试用例中的genderNum(只是简单举的例子，按照项目实际来)
4. `isDelete` 这种is开头的也支持
   1. 如果有问题,看下lombok版本是否有问题 此项目用的版本是 1.18.28 没问题
   2. 如果没用lombok 手动加上getIsDelete() 用这个格式就可以了
```

## 注意

两个类 相同的字段名的字段类型 必须完全一样!!!