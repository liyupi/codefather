# Oracle 到 MySQL 函数替换方案汇总

> 作者：[゛my my me](https://wx.zsxq.com/dweb2/index/footprint/585151241212124)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 30129

在我最近的项目中，我们面临了一个具有挑战性的任务：将数据库从Oracle迁移到MySQL 5.7版本。这个过程中的主要难点是将Oracle数据库中的函数和语法转换为与MySQL兼容的格式。在此过程中，我们整理出了一份涵盖常用语法转换的指南，希望能对类似项目的迁移工作提供有价值的参考和帮助。

## 常用函数和语法转换

### NVL函数

- **Oracle语法**: `NVL(COUNT(*), 0)`
- **MySQL语法**: `IFNULL(COUNT(*), 0)`

### 转字符串

- **Oracle语法**: `to_char(字段)`
- **MySQL语法**: `CONVERT(字段, CHAR)`

### Rownum递增

- **Oracle语法**: `SELECT rownum num FROM SYS_ENUM`
- **MySQL语法**: `SELECT (@i:=@i+1) num FROM sys_enum, (SELECT @i:=0) AS it`

### Delete增加表别名

- **Oracle语法**: `DELETE from sys_menus s WHERE s.MENU_ID in (86,87,88);`
- **MySQL语法**: `DELETE s from sys_menus s WHERE s.MENU_ID in (86,87,88);`

### 日期和字符转换

- **Oracle语法**: `to_char(), to_date();`
- **MySQL语法**: `DATE_FORMAT(date, '%Y-%m-%d'), STR_TO_DATE(date, '%Y-%m-%d %H:%i:%s')`

### UUID

- **Oracle语法**: `sys_guid()`
- **MySQL语法**: `REPLACE(UUID(), _utf8'-', _utf8'')`

### 特殊字符转换

- **Oracle语法**: `to_char(SALARY_NUM, 'fm99999999999990.00')`
- **MySQL语法**: `CONVERT(FORMAT(SALARY_NUM, 2), CHAR)`

### 按拼音首字母排序

- **Oracle语法**: `nlssort(enterprise_name, 'NLS_SORT=SCHINESE_PINYIN_M')`
- **MySQL语法**: `convert(name using gbk) ASC`

### Trunc函数截取月初

- **Oracle语法**: `trunc(sysdate, 'yyyy-MM-dd'), 'mm')`
- **MySQL语法**: `DATE_ADD(sysdate(), INTERVAL -DAY(sysdate()) +1 DAY)`

### Trunc函数

- **Oracle语法**: `trunc(sysdate)`
- **MySQL语法**: `SELECT STR_TO_DATE(DATE_FORMAT(SYSDATE(), '%Y%m%d'), '%Y%m%d%H')`

### Rownum日期操作

- **Oracle语法**: `sysdate-1`
- **MySQL语法**: `set @dt =SYSDATE(); select date_add(@dt, interval 1 day) from dual;`

### Decode

- **Oracle语法**: `DECODE(t.CARD_STATUS, 1, '01', 6, '06', 2, '02', 4, '04', null) as CWR_CARD_STATUS`
- **MySQL语法**: `(CASE WHEN t.CARD_STATUS = 1 THEN '01' WHEN t.CARD_STATUS = 6 THEN '06' WHEN t.CARD_STATUS = 2 THEN '02' WHEN t.CARD_STATUS = 4 THEN '04' ELSE null END) as CWR_CARD_STATUS`

### Nulls Last

- **Oracle语法**: `nulls last`
- **MySQL语法**: `order by IF(ISNULL(my_field), 1, 0), my_field;`

### Nulls First

- **Oracle语法**: `nulls first`
- **MySQL语法**: `order by IF(ISNULL(my_field), 0, 1), my_field;`

### To_char（数字格式化）

- **Oracle语法**: `to_char（数据, 'FM9999990.00'）`
- **MySQL语法**: `format(数据, 2)`

### Merge Into

- **Oracle语法**: `merge into`
- **MySQL语法**: `-- 修改成UPDATE 和 INSERT

### 文本拼接

- **Oracle语法**: `||`
- **MySQL语法**: `CONCAT('1','2''3')`

### substr

- **注意**: MySQL中不能将0作为起始点，需要改成1。

### 时间的计算

- **Oracle语法**: 可以直接相减（默认单位：天）
- **MySQL语法**: `使用 TIMESTAMPDIFF（需指定默认单位）`

### row number over

- **Oracle语法**:

  ```sql
  SELECT a.*,
  ROW_NUMBER() OVER(partition by a.orderchildId order by a.CheckEndTime desc) as rum_num
  FROM biz_qa_check_first a
  ```

  **MySQL语法**:

  ```sql
  select @rownum:=@rownum+1 rownum,a.*,
  if(@orderchildId=a.orderchildId,@rank:=@rank+1,@rank:=1) as rum_num,
  @orderchildId:=a.orderchildId
  from(SELECT * from biz_qa_check_first order by orderchildId,CheckEndTimedesc)a,
  (select @rownum:=0,@orderchildId:=null,@rank:=0)b
  ```