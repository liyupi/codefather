# 如何处理 CompletableFuture 中的两种异常(智能BI项目)

> 作者：[momo](https://wx.zsxq.com/dweb2/index/footprint/88244812285412)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 26376

**当前问题分析：**

在智能BI项目中，使用CompletableFuture进行并发编程，但是这里如果出现异常就会导致图表的状态一直是wait状态，前端渲染的图表数据就会一直显示在等待中。所以就要捕获异常然后更新图表的状态为failed。

**异常情况分析：**

这里的代码会出现两种异常，一种是提交的多线程中线程执行任务时出现异常还有一种是在主线程中使用CompletableFuture方法出现的异常（比如任务队列已满然后继续向队列中添加任务） **原代码**

```java
 CompletableFuture.runAsync(() -> {
    //这里只展示部分相关代码，其他项目中详细的代码未写
    //插入数据库，更新图表为running状态
    Chart updateChart = new Chart();
    updateChart.setId(chart.getId());
    updateChart.setStatus(ChartStatusEnum.RUNNING.getValue());
    chartService.updateById(updateChart);
    //调用AI
    ......
    //对AI结果进行处理，插入数据库，将图表更新为success状态
    updateChartResult.setStatus(ChartStatusEnum.SUCCESS.getValue());
    chartService.updateById(updateChartResult);
}, threadPoolExecutor);
```

**这里针对异常情况有两个问题**

1.当提交的线程中如果出现异常，就会导致图表的状态一直卡在wait或者running状态，解决方式：使用CompletableFuture的exceptionally方法处理异常 代码示例：

```java
CompletableFuture.runAsync(() -> {
    //这里只展示部分相关代码，其他项目中详细的代码未写
    //插入数据库，更新图表为running状态
    Chart updateChart = new Chart();
    updateChart.setId(chart.getId());
    updateChart.setStatus(ChartStatusEnum.RUNNING.getValue());
    chartService.updateById(updateChart);
    //调用AI
    ......
    //对AI结果进行处理，插入数据库，将图表更新为success状态
    updateChartResult.setStatus(ChartStatusEnum.SUCCESS.getValue());
    chartService.updateById(updateChartResult);
}, threadPoolExecutor).exceptionally(new Function<Throwable, Void>() {
    @Override
    public Void apply(Throwable throwable) {
        //该方法中是处理异常情况，所以将图表更新为failed状态
       Chart updateChartResult = new Chart();
       updateChartResult.setId(chart.getId());
       updateChartResult.setStatus(ChartStatusEnum.FAILED.getValue());
       updateChartResult.setExecMessage("系统内部异常"");
        return null;
    }
});
```

2.使用CompletableFuture.runAsync()方法出现的异常，比如队列已满继续添加任务出现的异常，这种情况下出现异常也会导致图表一直卡在wait状态，不能进入最终态falied或者success。这种解决方式就不能使用exceptionally方法了，就要使用try-catch捕获处理。

代码如下：

```java
try {
    CompletableFuture.runAsync(() -> {
        //这里只展示部分相关代码，其他项目中详细的代码未写
        //插入数据库，更新图表为running状态
        Chart updateChart = new Chart();
        updateChart.setId(chart.getId());
        updateChart.setStatus(ChartStatusEnum.RUNNING.getValue());
        chartService.updateById(updateChart);
        //调用AI
        ......
        //对AI结果进行处理，插入数据库，将图表更新为success状态
        updateChartResult.setStatus(ChartStatusEnum.SUCCESS.getValue());
        chartService.updateById(updateChartResult);
    }, threadPoolExecutor);
} catch (Exception e) {
    //该方法中是处理异常情况，所以将图表更新为failed状态
    Chart updateChartResult = new Chart();
    updateChartResult.setId(chart.getId());
    updateChartResult.setStatus(ChartStatusEnum.FAILED.getValue());
    updateChartResult.setExecMessage("队列已满导致失败");
}
```

汇总以上两种异常方式的代码处理如下：

```java
CompletableFuture.runAsync(() -> {
        //这里只展示部分相关代码，其他项目中详细的代码未写
        //插入数据库，更新图表为running状态
        Chart updateChart = new Chart();
        updateChart.setId(chart.getId());
        updateChart.setStatus(ChartStatusEnum.RUNNING.getValue());
        chartService.updateById(updateChart);
        //调用AI
        ......
        //对AI结果进行处理，插入数据库，将图表更新为success状态
        updateChartResult.setStatus(ChartStatusEnum.SUCCESS.getValue());
        chartService.updateById(updateChartResult);
    }, threadPoolExecutor).exceptionally(new Function<Throwable, Void>() {
    @Override
    public Void apply(Throwable throwable) {
        //该方法中是处理异常情况，所以将图表更新为failed状态
       Chart updateChartResult = new Chart();
       updateChartResult.setId(chart.getId());
       updateChartResult.setStatus(ChartStatusEnum.FAILED.getValue());
       updateChartResult.setExecMessage("系统内部异常");
        return null;
    }
});
} catch (Exception e) {
    //该方法中是处理异常情况，所以将图表更新为failed状态
    Chart updateChartResult = new Chart();
    updateChartResult.setId(chart.getId());
    updateChartResult.setStatus(ChartStatusEnum.FAILED.getValue());
    updateChartResult.setExecMessage("队列已满导致失败");
}
```

总结：

1.队列已满继续添加任务出现的异常在外层使用trycatch来捕获处理，不能使用exceptionally方法处理。 2.线程中出现异常可以使用exceptionally方法进行处理。
