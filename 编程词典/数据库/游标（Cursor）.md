# 游标（Cursor）

在关系型数据库中，游标（Cursor）是一种用于遍历和处理 SQL 查询结果集的机制。通过游标，我们可以逐一访问查询结果集中的行，并对每一行做出相应的处理。

游标有两种类型：静态游标和动态游标。静态游标创建时，它的结果集是基于查询时的快照创建的，即使数据发生变化，游标返回的结果也不会改变。动态游标则在查询时逐行生成结果集，如果数据在查询期间发生更改，则返回的游标结果也会随之改变。

下面我们举个栗子来说明游标的使用场景。

我们假定有这样一张表（以MySQL语法为例）：

```sql
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(20),
  age INT,
  gender CHAR(1)
);
```

我们现在需要统计每个班级男女生的人数，那么我们可以这样写SQL：

```sql
SELECT gender, COUNT(*) FROM students GROUP BY gender;
```

这个SQL执行后会返回两行数据，第一行是“男”性别的人数，第二行是“女”性别的人数。但是如果我们需要将这些数据用编程语言进行处理，比如PHP，那么我们怎么办呢？这时就可以使用游标了。

首先，我们需要使用PHP的PDO类创建一个PDO对象：

```php
$pdo = new PDO('mysql:host=localhost;dbname=test', 'username', 'password');
```

然后，我们可以使用PDO::query()方法来执行我们的SQL查询：

```php
$stmt = $pdo->query('SELECT gender, COUNT(*) FROM students GROUP BY gender');
```

现在，`$stmt`就是一个PDOStatement对象，我们可以使用它的fetch()方法来一个一个地获取结果集中的行：

```php
while ($row = $stmt->fetch()) {
  echo "{$row['gender']}: {$row[1]}<br>";
}
```

上面的代码就会输出：

```
男: 10
女: 8
```

这样，我们就通过游标遍历了查询结果，并对每一行进行了处理。

游标虽然强大，但也需要谨慎使用。游标本质上是一个指向结果集某个位置的指针，如果结果集太大，游标可能会占用大量的内存。所以，在使用游标时，我们需要注意结果集的大小，并根据需要使用适当的游标类型。