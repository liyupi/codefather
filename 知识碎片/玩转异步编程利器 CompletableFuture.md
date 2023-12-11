# 玩转异步编程利器 CompletableFuture

> 作者：[LYX](https://wx.zsxq.com/dweb2/index/footprint/88244812285412)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 26376

> Java异步编程工具

在星球中做的许多项目我发现会经常用到了CompletableFuture，所以对这个异步编程工具做了一个总结。

# 一、CompletableFuture简介

CompletableFuture是 Java 8 中引入的一个类，它实现了CompletionStage接口，提供了一组丰富的方法来处理异步操作和多个任务的结果。它支持链式操作，可以方便地处理任务的依赖关系和结果转换。相比于传统的Future接口，CompletableFuture更加灵活和强大。

CompletableFuture针对Future的不足之处给出了相应的处理方式：1.在异步线程执行结束后可以自动回调我们新的处理逻辑，无需阻塞。2.可以对多个异步任务进行编排，组合或者排序。3.异常处理

CompletableFuture的核心思想是将每个异步任务都可以看做一个步骤(CompletionStage)，然后其他的异步任务可以根据这个步骤做一些想做的事情。

# 二、CompletableFuture的用法

## 2.1.使用CompletableFuture创建异步任务

使用CompletableFuture创建异步任务非常简单。可以使用CompletableFuture.supplyAsync() 或CompletableFuture.runAsync() 方法来创建一个异步任务。

### 2.1.1使用CompletableFuture.runAsync() 方法

CompletableFuture.runAsync() 方法是提交异步任务的一个最基本的方法，该方法用于执行没有返回值的任务。

```java
CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
    // 执行没有返回值的任务
});
```

### 2.1.2使用CompletableFuture.supplyAsync() 方法

使用CompletableFuture.supplyAsync() 方法来创建异步任务，与runAsync该方法不同的是该方法带有返回值，在任务完成时返回结果。

```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // 执行具有返回值的任务
    return "返回值";
});
```

在上述示例中，任务会在默认的 ForkJoinPool 中异步执行，我们可以自定义线程池。

### 2.1.3指定自定义线程池

我们还可以通过指定自定义线程池来创建异步任务，以满足特定的并发需求。

```java
ExecutorService customExecutor = new ThreadPoolExecutor(10,20,5,TimeUnit.MINUTES,new LinkedBlockingDeque<>());
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // 执行任务的代码
     return "返回值";
}, customExecutor);
```

在上述示例中，我们通过创建自定义线程池，并将其传递给CompletableFuture.supplyAsync() 方法来执行异步任务。

## 2.2 获取任务结果

获取CompletableFuture任务的结果有多种方式。最常用的方式是使用join() 方法阻塞当前线程，直到任务完成并返回结果。

### 2.2.1 使用join() 方法

join() 方法是 CompletableFuture 类提供的一种获取任务结果的方式，它会阻塞当前线程，直到任务完成并返回结果。

```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // 执行任务的代码
    return "返回值";
});

//获取任务结果
String result = future.join();
```

在上述示例中，我们使用join() 方法获取任务的结果，并将结果赋值给result变量。如果任务还未完成，join() 方法会阻塞当前线程，直到任务完成。

join() 方法和get() 方法非常相似，但join() 方法不会抛出InterruptedException和ExecutionException异常，而是将异常包装在CompletionException中抛出。因此，它更适合在 Lambda 表达式或流式操作中使用。

### 2.2.2 使用get() 方法

get() 方法也是 CompletableFuture 类提供的一种获取任务结果的方式，它会阻塞当前线程，直到任务完成并返回结果。与join() 方法不同的是，get() 方法会抛出InterruptedException和ExecutionException异常，需要进行异常处理。

```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // 执行任务的代码
    return "返回值";
});
try {
    String result = future.get();
} catch (InterruptedException | ExecutionException e) {
    // 异常处理逻辑
}
```

在上述示例中，我们使用get() 方法获取任务的结果，并在可能抛出异常的情况下进行异常处理。如果任务还未完成，get() 方法会阻塞当前线程，直到任务完成。 get() 方法的异常处理较为繁琐，需要捕获InterruptedException和ExecutionException异常，并进行相应的处理。因此，在 Lambda 表达式或流式操作中，推荐使用join() 方法。

## 2.3 异步回调方法

CompletableFuture 提供了一系列方法来处理任务的完成事件，实现异步回调。我们将逐一介绍这些方法的区别和用法。

### 2.3.1thenApply()

方法签名：thenApply(Function function)

- 输入参数：上一阶段的任务结果类型 T。
- 返回值：新阶段的任务结果类型 U。
- 功能：对上一阶段的任务结果进行转换操作，并返回一个新的 CompletableFuture 对象。

```java
CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> 42)
    .thenApply(result -> result * 2)
    .thenApply(result -> result + 1);
```

在上述示例中，我们使用 thenApply()方法对上一阶段的结果进行转换，将结果乘以 2，并将转换后的结果加 1。每个 thenApply()方法都返回一个新的 CompletableFuture 对象，可以继续链式调用。

### 2.3.2thenAccept()

方法签名：thenAccept(Consumer consumer)

- 输入参数：上一阶段的任务结果类型 T。
- 返回值：没有返回值。
- 功能：对上一阶段的任务结果进行消费操作，没有返回值。

```java
CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> 42)
    .thenAccept(result -> System.out.println("任务结果：" + result));
```

在上述示例中，我们使用 thenAccept()方法对上一阶段的结果进行消费，将结果打印输出。thenAccept()方法没有返回值，仅用于消费任务结果。

### 2.3.3 thenRun()

方法签名：thenRun(Runnable action)

- 输入参数：无。
- 返回值：]没有返回值。
- 功能：在上一阶段任务完成后执行给定的 Runnable 任务，没有输入参数和返回值。

```java
CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> 42)
    .thenRun(() -> System.out.println("任务执行完毕"));
```

在上述示例中，我们使用 thenRun()方法在上一阶段任务完成后执行一个 Runnable 任务，输出一条任务执行完毕的消息。

### 2.3.4thenRunAsync(),thenApplyAsync(),thenAcceptAsync()

thenRun(),thenApply(),thenAccept()这3个异步回调方法都有对应的thenRunAsync(),thenApplyAsync(),thenAcceptAsync()方法。thenRunAsync()和thenRun()方法的区别是，当执行完一个任务之后调用thenRun()方法，thenRun()方法中执行异步任务使用的线程是和刚刚执行任务的线程是同一个线程。而thenRunAsync()方法会用一个新的线程执行任务，这个线程默认从ForkJoinPool线程池取线程，可以自定义线程池来取线程。

## 2.4 多任务组合回调

CompletableFuture 还提供了一些方法来组合多个任务的结果，实现更复杂的异步处理逻辑。

### 2.4.1使用thenCombine()方法组合多个任务的结果

方法签名：thenCombine(CompletionStage other, BiFunction fn)

- 输入参数：另一个 CompletionStage 对象和一个 BiFunction 函数，函数的输入参数分别为上一阶段的任务结果类型 T 和另一个CompletableFuture 对象的任务结果类型 U，函数的返回值类型为 V（这里看不懂，可以看下面的代码示例）。
- 返回值：新阶段的任务结果，类型为 V。
- 功能：当两个CompletableFuture 对象都完成时，将它们的任务结果传递给给定的 BiFunction 函数进行组合处理，并返回一个新的 CompletableFuture 对象。

```java
CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> 10);
CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> 20);

CompletableFuture<Integer> combinedFuture = future1.thenCombine(future2, (result1, result2) -> result1 + result2);//最后返回的结果是10+20=30
```

在上述示例中，我们使用 thenCombine()方法将两个任务的结果进行组合，将它们的结果相加并返回新的 CompletableFuture 对象，返回值是30。

### 2.4.2使用allOf()方法等待所有任务，等所有任务完成之后再继续操作。

方法签名：allOf(CompletableFuture... cfs)

- 输入参数：多个 CompletableFuture 对象。
- 返回值：没有返回值。
- 功能：等待所有给定的 CompletableFuture 对象都完成，返回一个新的 CompletableFuture 对象。

```java
CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> 10);
CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> 20);
//在allOf这里会阻塞，等future1和future2的任务都执行完之后才会继续往下执行
CompletableFuture<Void> allFutures = CompletableFuture.allOf(future1, future2);
```

在上述示例中，我们使用 allOf()方法等待所有的 CompletableFuture 对象都完成，返回一个新的 CompletableFuture 对象。这样我们就可以在该对象上进行进一步的处理，例如获取各个 CompletableFuture 的结果。

### 2.4.3使用anyOf()方法获取率先完成的任务结果

anyOf()方法中可以添加一批任务，只要有一个任务完成，该方法就会停止阻塞并返回结果。适用于试图通过不同方式计算同一个结果的情况。

```java
CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> {
    try {
        Thread.sleep(4000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return "任务1返回值";
});
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> {
    return "任务2返回值";
});
//这里我们把所有的任务添加到集合中去，最后将这个集合传给anyOf方法
List<CompletableFuture> futureList = Arrays.asList(future1,future2);
CompletableFuture<Object> finalFuture = CompletableFuture.anyOf(futureList.toArray(new CompletableFuture[]{}));
Object result = finalFuture.join();
System.out.println(result); //这里输出的是任务2返回值
```

## 2.5异常处理

CompletableFuture 提供了多种方法来处理异步任务执行中可能发生的异常。常用的方法有：exceptionally()和handle()方法

### 2.5.1使用exceptionally()方法处理异常

方法签名：exceptionally(Function function)

- 输入参数：异常对象，类型为T。
- 返回值：有返回值，返回值类型为上一个链式操作的返回值类型。
- 功能：发生异常时进行处理

```java
CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
    throw new RuntimeException("任务执行异常");
});

CompletableFuture<Integer> handledFuture = future.exceptionally(ex -> {
    System.out.println("异常处理：" + ex.getMessage());
    return 0; // 默认值
});
```

### 2.5.2异常链处理

使用CompletableFuture处理异常时支持异常链，不是只有上一个调用异常方法的上一个链式操作出现异常会进行异常捕获，只要在异常方法之前任意有一个异步任务抛出异常，这里都可以进行捕获。

```java
CompletableFuture.runAsync(()->{
    System.out.println("第一个任务处理");
}).thenRun(()->{
    System.out.println("第二个任务处理");
}).thenRun(()->{
    System.out.println("第三个任务处理");
}).thenRun(()->{
    System.out.println("第四个任务处理");
}).thenRun(()->{
    System.out.println("第五个任务处理");
}).exceptionally((e)->{
   e.printStackTrace();
   return null;
});
```

如下图所示，我们在第二个任务时出现异常，也照样会被捕获到

![Fs-KqJi5JTgeU1vwnE5u6t80GluB.png](https://pic.yupi.icu/5563/202311251833428.png)

### 2.5.3 使用handle()方法对异常进行处理

方法签名：handle(BiFunction fn)

- 输入参数：异常对象，类型为T,上一个任务的返回值，类型为U
- 返回值：有返回值，返回值类型为上一个链式操作的返回值类型。
- 功能：发生异常时进行处理

```java
CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> 42);

CompletableFuture<String> handledFuture = future.handle((result, ex) -> {
    if (ex != null) {
        System.out.println("异常处理：" + ex.getMessage());
        return "默认值";
    } else {
        return "结果：" + result;
    }
});
```

使用handle()方法处理异常和使用exceptionally()方法的区别是，handle方法中会接收上一个任务的返回值，如果没有出现异常就可以将上一个任务的返回值进行返回。

## 2.6 资源管理与关闭线程池

在使用自定义线程池时，需要注意及时关闭线程池以释放资源。可以使用ExecutorService的shutdown() 或shutdownNow() 方法来关闭线程池。

```java
ExecutorService customExecutor = new ThreadPoolExecutor(10,20,5,TimeUnit.MINUTES,new LinkedBlockingDeque<>());
// 异步任务代码
//....
customExecutor.shutdown();
```

在上述代码中，我们在任务完成后调用了shutdown() 方法来关闭线程池。

## 2.7 中断与取消任务

在某些情况下，我们可能需要中断或取消正在执行的任务。CompletableFuture 提供了cancel() 方法来取消任务的执行。

```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // 异步任务的代码
});

boolean canceled = future.cancel(true);
```

在上述代码中，我们调用cancel() 方法来取消任务的执行，并传递一个布尔值表示是否中断正在执行的任务。

## 2.8 CompletableFuture的一些使用场景

### 2.8.1 CompletableFuture与IO操作

CompletableFuture在处理IO操作时非常有用。可以将IO操作封装为CompletableFuture任务，利用CompletableFuture的异步特性提高IO操作的效率。

```java
CompletableFuture<String> readData = CompletableFuture.supplyAsync(() -> {
// 执行读取数据的IO操作
    return "读取的数据";
});

CompletableFuture<Void> processData = readData.thenAccept(data -> {
// 处理读取到的数据
    System.out.println("读取到的数据：" + data);
// 执行处理数据的操作
});

CompletableFuture<Void> writeData = processData.thenRun(() -> {
// 执行写入数据的IO操作
    System.out.println("数据写入完成");
});

writeData.join();
```

在上述代码中，我们使用CompletableFuture处理了一个包含读取数据、处理数据和写入数据的IO操作流程。通过异步执行和链式操作，可以有效地利用CPU和IO资源，提高程序的响应性和吞吐量。

### 2.8.2 CompletableFuture与网络请求

CompletableFuture也可以很好地与网络请求结合使用。我们可以使用CompletableFuture发起多个网络请求，并在所有请求完成后处理结果。

```java
CompletableFuture<String> request1 = CompletableFuture.supplyAsync(() -> {
// 发起网络请求1
    return "请求1结果";
});

CompletableFuture<String> request2 = CompletableFuture.supplyAsync(() -> {
// 发起网络请求2
    return "请求2结果";
});

CompletableFuture<String> request3 = CompletableFuture.supplyAsync(() -> {
// 发起网络请求3
    return "请求3结果";
});

CompletableFuture<Void> allRequests = CompletableFuture.allOf(request1, request2, request3);

allRequests.thenRun(() -> {
// 所有请求完成后的处理逻辑
    String result1 = request1.join();
    String result2 = request2.join();
    String result3 = request3.join();
// 对请求结果进行处理
});
```

在上述代码中，我们使用CompletableFuture发起了三个网络请求，并通过allOf()方法等待所有请求完成。在所有请求完成后，我们可以使用join()方法获取各个请求的结果，并进行后续处理。

### 2.8.3实战案例

业务背景： 在电商项目的售后业务中，当客服接收到用户的售后申请时，需要进行一系列操作，包括查询订单信息、查询 ERP 中的商品信息、查询用户信息，以及创建售后工单。 代码实现：

```java
public CompletableFuture<Void> processAfterSalesRequest(String orderId, String customerId) {
    CompletableFuture<Order> orderFuture = CompletableFuture.supplyAsync(() -> getOrderInfo(orderId));
    CompletableFuture<Inventory> inventoryFuture = CompletableFuture.supplyAsync(() -> getInventoryInfo(orderId));
    CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(() -> getUserInfo(customerId));

    return CompletableFuture.allOf(orderFuture, inventoryFuture, userFuture)
        .thenApplyAsync(ignored -> {
            Order order = orderFuture.join();
            Inventory inventory = inventoryFuture.join();
            User user = userFuture.join();

            // 创建售后工单
            createAfterSalesTicket(order, inventory, user);

            return null;
        });
}

private Order getOrderInfo(String orderId) {
    // 查询订单信息的逻辑
    // ...
    return order;
}

private Inventory getInventoryInfo(String orderId) {
    // 查询ERP中商品信息的逻辑
    // ...
    return inventory;
}

private User getUserInfo(String customerId) {
    // 查询用户信息的逻辑
    // ...
    return user;
}

private void createAfterSalesTicket(Order order, Inventory inventory, User user) {
    // 创建售后工单的逻辑
    // ...
}
```

在上述代码中，我们使用CompletableFuture.supplyAsync() 方法分别查询订单信息、ERP 中的商品信息和用户信息，然后使用CompletableFuture.allOf() 方法等待所有查询任务完成。完成后，我们可以通过join() 方法获取各个查询任务的结果，并将结果传递给createAfterSalesTicket() 方法来创建售后工单。

# 三、CompletableFuture的方法总结

**创建一个异步任务的方法**

runAsync() //该方法中没有返回值，适用于没有返回结果的任务

supplyAsync() //该方法有返回值，适用于有返回结果的任务

**获取方法的返回值**

get()

join()

get()方法需要处理异常，join()方法不需要处理异常

**回调方法**

thenApply() //对方法进行回调，可以访问到上个任务运行的结果，方法结束有返回值

thenAccept() //对方法进行回调，可以访问到上个任务运行的结果，方法结束没有返回值

thenRun() //对方法进行回调，不能访问到上个任务运行的结果，方法结束没有返回值

**同样是回调方法，但与上述三个方法区别是会启用一个新的线程处理回调方法中的任务**

thenApplyAsync()

thenAcceptAsync()

thenRunAsync()

**处理异常方法**

exceptionally()

handle()

使用handle()方法处理异常和使用exceptionally()方法的区别是，handle方法中会接收上一个任务的返回值，如果没有出现异常就可以将上一个任务的返回值进行返回。

**同时处理多个任务**

thenCombine() //组合多个任务的结果

allOf() //方法会等待所有任务，等所有任务完成之后再继续操作

anyOf() //方法会等待所有任务，只要有一个任务完成就会停止阻塞；会返回率先完成的任务结果

**中断和取消任务**

cancel() //cancel() 方法来取消任务的执行，并可以传递一个布尔值表示是否中断正在执行的任务