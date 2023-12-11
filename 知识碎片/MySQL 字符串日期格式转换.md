# MySQL 字符串日期格式转换

> 作者：[卍不忘☆初心](https://wx.zsxq.com/dweb2/index/footprint/812552151115422)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 18875

关于MySQL字符串转日期格式的那些事

### 起因

需要将Oracle中的数据导到MySQL中

### 阻碍

在Oracle导出数据时，发现导出的SQL脚本中的日期转换是`to_date('28-11-2023 14:15:17', 'dd-mm-yyyy hh24:mi:ss')`的形式，但MySQL并不认识这个格式转换函数，此时需要将Oracle中这个日期转换函数替换成MySQL中的日期格式转换函数才能在MySQL中执行导出的脚本，那么在MySQL中日期如何转换呢？

### 分析

在`to_date('28-11-2023 14:15:17', 'dd-mm-yyyy hh24:mi:ss')`中，是要将给定的字符串`28-11-2023 14:15:17`按照`dd-mm-yyyy hh24:mi:ss`的格式转换成日期，那么我们也需要在MySQL找到一个函数能够将指定的字符串按照一定的格式转换成日期。

### 解决

在MySQL中可以使用`str_to_date(str,format)`这个函数来实现将字符串按照时间格式转换成日期。那么对于Oracle中的`to_date('28-11-2023 14:15:17', 'dd-mm-yyyy hh24:mi:ss')`可以修改成`str_to_date('28-11-2023 14:15:17', '%d-%m-%Y %H:%i:%s')`，替换后就可以在MySQL执行进行日期转换了。

验证，结果如下：

![](https://pic.yupi.icu/5563/202311300823866.png)

### 总结

1. Oracle中字符串转日期：`to_date('28-11-2023 14:15:17', 'dd-mm-yyyy hh24:mi:ss')`
2. MySQL中字符串转日期：`str_to_date('28-11-2023 14:15:17', '%d-%m-%Y %H:%i:%s')`
3. MySQL常见时间格式化：（与字符串中的对应使用）
   1. %Y： 年份，四位数字
   2. %m：月份，两位数字
   3. %d： 日期，两位数字
   4. %H：小时（24小时制），两位数字
   5. %i： 分钟，两位数字
   6. %s： 秒，两位数字
4. 扩展：MySQL中如果想将日期转换成字符串可以使用`date_format(date,format)`