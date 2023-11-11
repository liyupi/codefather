# 【设计模式】装饰者模式，及其在JDK源码中的应用

> 作者: [B.B](https://wx.zsxq.com/dweb2/index/group/51122858222824)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 24725

## 一、**什么是**装饰者模式

装饰者模式是一种软件设计模式，它允许在不改变对象结构的情况下，动态地向对象添加额外的功能。该模式通过将对象包装在一个装饰器对象中，来实现对对象的功能扩展。这种模式通常用于需要在运行时动态地为对象添加功能的情况，而不是在编译时静态地定义对象的功能。

比如一个毛坯房，可以使用灰色去装饰厨房，可以使用白色装饰客厅，但是不管使用多少颜料去装饰这个房间，房子的本质是不会发现变化的。

使用装饰者模式除了可以在不改变原类的前提下装饰对象之外，还可以随意组合各个装饰类，比如有三个装饰类，分别是给原类上红、黄、绿三种颜色。在使用时，可以将任意两种或任意三种装饰类搭配。接下来将会用代码演示上面的这个例子。

## 二、**装饰者模式**中的角色

装饰者模式中具备以下四种角色：

**Component**：一个抽象的组件类，在装饰者模式中扮演着最重要的角色。在给房子上色这个例子中，概念上的房子就是一个Component。如果还不理解，继续往下看。

**ConcreteComponent**：Component的具体实现，在本次的例子中就是商品房、公寓房等。

**Decorator**：一个通用的装饰接口或抽象类，内部保存了被装饰的Component对象。

**ConcreteDecorator**：具体的装饰类，在原类的基础上进行装饰。

## 三、**装饰者模式**案例

原类是房子，可装饰红色、黄色、绿色。接下来的代码就是对这个例子的体现：**首先定义Component，也就是房子****抽象类**，有一个展示房子的方法：

```Java
public abstract class House {
    /**
     * 展示房子
     */
    public abstract void show();
}
```

接下来是ConcreteComponent，**抽象房子的实现类，这里定义为商品房，ConcreteComponent可以有很多个**：

```Java
public class CommercialHouse extends House{
    @Override
    public void show() {
        System.out.println("这是一个商品房");
    }
}
```

**Decorator**是一个通用的抽象类，将房子作为入参传入，并实现同样的show方法

```Java
public class HouseDecorator extends House{
    private House house;

    public HouseDecorator(House house){
        this.house = house;
    }

    @Override
    public void show() {
        house.show();
    }
}
```

**ConcreteDecorator**具体装饰类定义了三个，分别是红黄蓝装饰：

```Java
public class RedHouseDecorator extends HouseDecorator{

    public RedHouseDecorator(House house) {
        super(house);
    }
    @Override
    public void show() {
        super.show();
        System.out.println("装饰了红色");
    }
}

public class YellowHouseDecorator extends HouseDecorator{

    public YellowHouseDecorator(House house) {
        super(house);
    }
    @Override
    public void show() {
        super.show();
        System.out.println("装饰了黄色");
    }
}

public class GreenHouseDecorator extends HouseDecorator{

    public GreenHouseDecorator(House house) {
        super(house);
    }
    @Override
    public void show() {
        super.show();
        System.out.println("装饰了绿色");
    }
}
```

接下来就是使用了，前面已经提到了，装饰者模式除了可以在不改动原类的情况下增加功能，也可以随意组装各个装饰类：

```Java
public class Main {
    public static void main(String[] args) {
        House house = new CommercialHouse();
        //只装饰红色
        House redHouse = new RedHouseDecorator(house);
        redHouse.show();
        //装饰绿色和黄色
        House greenAndYellowHouse = new GreenHouseDecorator(new YellowHouseDecorator(house));
        greenAndYellowHouse.show();
        //三种颜色全部装饰
        House allHouse = new RedHouseDecorator(new GreenHouseDecorator(new YellowHouseDecorator(house)));
        allHouse.show();
    }
}
```

在上面的测试代码中，既可以只有一种颜色的装饰，也可以有两种颜色的装饰，或者是三种颜色的装饰，而原本的商品房这个类没有经过任何修改。如果用继承去实现，每种组装方式都需要新建一个类，装饰者模式的优势就体现出来了。

## 四、**装饰者模式**在****源码****中的应用

看了很多装饰者模式在源码中的应用，感觉Java.IO中的流在装饰者模式的使用上最经典。以InputStream为例子，InputStream有很多的实现类：

FileInputStream：实现文件的读取。

DataInputStream：读取各种基本数据类型的数据。

BufferedInputStream：可缓存的文件流。

ObjectInputStream：读取对象的文件流。

其他的实现还有很多很多，这里的实现就使用了装饰者模式，保证InputStream不变的前提下，增加其他功能。想象一下，如果要同时实现文件读取和可缓存，那么就可以这样写：

```Java
new BufferedInputStream(new FileInputStream(""));
```

是不是和第三节的例子一模一样，在代码的实现上，其实也大同小异，InputStream是一个抽象类，定义了read方法，代码作了精简：

```Java
new DataInputStream(new FileInputStream(""));
```

是不是和第三节的例子一模一样，在代码的实现上，其实也大同小异，InputStream是一个抽象类，定义了read方法，代码作了精简

```Java
public abstract class InputStream implements Closeable{
    public abstract int read() throws IOException;
}
```

BufferedInputStream是InputStream子类的子类，在继承关系上，BufferedInputStream继承FilterInputStream，FilterInputStream继承InputStream，这里相当于对装饰类进行了再扩展，看一下FilterInputStream：

```Java
public class FilterInputStream extends InputStream{
    protected volatile InputStream in;
    protected FilterInputStream(InputStream in) {
        this.in = in;
    }
    public int read() throws IOException {
        return in.read();
    }
}
```

而BufferedInputStream以及DataInputStream都是对FilterInputStream再做一些功能上的增强，很巧妙的实现了在不必改变原类文件情况下，允许向一个现有的对象添加新的功能。

## 五、**总结**

装饰者模式很好地体现了设计模式中的开闭原则，即类应该对扩展开放，对修改关闭。值得深深品味。