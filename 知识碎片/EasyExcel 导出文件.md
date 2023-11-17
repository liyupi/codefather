# EasyExcel 导出文件

> 作者：[玄德ь](https://xuande-hk.gitee.io/)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 3107

## EasyExcel导出文件，并解决格式报错

项目中使用EasyExcel导出数据

## EasyExcel导出数据

### 引入pom文件

```xml
<!-- easy-excel -->
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>easyexcel</artifactId>
	<version>3.2.1</version>
</dependency>
```

### 定义导出对象

```java
/**
 * Excel订单信息导出
 *
 * @author 玄德
 */
@Data
public class IndentExcelVO {

    /**
     * 订单编号
     */
    @ColumnWidth(20)
    @NumberFormat("#")
    @ExcelProperty(value = "订单编号", index = 0)
    private String id;

    /**
     * 用户姓名
     */
    @ExcelProperty(value = "用户姓名", index = 1)
    private String realName;

    /**
     * 手机号
     */
    @ColumnWidth(15)
    @ExcelProperty(value = "手机号", index = 2)
    private String information;

    /**
     * 接亲日期
     */
    @ColumnWidth(15)
    @ExcelProperty(value = "接亲日期", index = 3)
    private String date_time;

    /**
     * 开始时间
     */
    @ColumnWidth(15)
    @ExcelProperty(value = "开始时间", index = 4)
    private String start_time;

    /**
     * 结束时间
     */
    @ColumnWidth(15)
    @ExcelProperty(value = "结束时间", index = 5)
    private String end_time;

    /**
     * 接亲地址
     */
    @ColumnWidth(20)
    @ExcelProperty(value = "接亲地址", index = 6)
    private String address;

    /**
     * 订单总金额
     */
    @NumberFormat("#")
    @ExcelProperty(value = "订单总金额", index = 7)
    private Double amount;

    /**
     * 订单状态
     */
    @ExcelProperty(value = "订单状态", index = 8)
    private String indent_state;

    /**
     * 支付状态
     */
    @ExcelProperty(value = "支付状态", index = 9)
    private String payment_state;

    /**
     * 订单创建时间
     */
    @ColumnWidth(15)
    @ExcelProperty(value = "订单创建时间", index = 10)
    private String createTime;

}
```

### 定义工具类

```java
/**
 * Excel工具类
 *
 * @author 玄德
 */
public class ExcelUtils {

    /**
     * 获取路径
     *
     * @return 当前路径
     */
    public static String getPath() {
        return ExcelUtils.class.getResource("/").getPath();
    }

    /**
     * 创建新文件
     *
     * @param pathName 文件名
     * @return 文件
     */
    public static File createNewFile(String pathName) {
        File file = new File(getPath() + pathName);
        if (file.exists()) {
            file.delete();
        } else {
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
        }
        return file;
    }

    /**
     * 设置响应结果
     *
     * @param response    响应结果对象
     * @param rawFileName 文件名
     */
    public static void setExcelResponseProp(HttpServletResponse response, String rawFileName) throws IOException {
        //设置内容类型
        response.setContentType("application/vnd.vnd.ms-excel");
        //设置编码格式
        response.setCharacterEncoding("utf-8");
        //设置导出文件名称（避免乱码）
        String fileName = URLEncoder.encode(rawFileName.concat(".xlsx"), "UTF-8");
        // 设置响应头
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName);
    }

    /**
     * Date转String
     *
     * @param date 日期
     * @return 字符串
     */
    public static String dateToString(Date date) {
        if (date == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // Date转换为String
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }

}
```

### 编写接口

```java
/**
 * 订单信息导出
 */
@GetMapping("/download")
@AuthCheck(mustRole = ADMIN_ROLE)
public void download(HttpServletResponse response) throws IOException {
    // 获取数据，根据自身业务修改
    List<Indent> data = indentService.list();
    List<IndentExcelVO> indentList = data.stream().map(item -> {
        IndentExcelVO indentExcelVO = new IndentExcelVO();
        BeanUtils.copyProperties(item, indentExcelVO);
        // Date转字符串
        indentExcelVO.setDate_time(ExcelUtils.dateToString(item.getDate_time()));
        indentExcelVO.setCreateTime(ExcelUtils.dateToString(item.getCreateTime()));
        return indentExcelVO;
    }).collect(Collectors.toList());
    // 设置导出名称
    ExcelUtils.setExcelResponseProp(response, "订单信息");
    // 获取输出流名称
    OutputStream outputStream = response.getOutputStream();
    // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
    EasyExcel.write(outputStream, IndentExcelVO.class)  // 对应实体类
        .sheet("订单数据")  // sheet页名称
        .doWrite(indentList); // 导出的数据集合
}
```

### 遇到的问题

> 关于Date字段导出问题

启动服务，调用接口，成功导出 Excel文件，但是文件没有数据，且报错：`Can not find ‘Converter‘ support class Date.`

报错原因：导出 Excel 表格时候，默认不支持 DateTime 日期格式，所以需要指定 DateTime 类型的字段的日期格式。

解决方式1：将Date转换为String

```java
List<IndentExcelVO> indentList = data.stream().map(item -> {
    IndentExcelVO indentExcelVO = new IndentExcelVO();
    BeanUtils.copyProperties(item, indentExcelVO);
    // Date转字符串
    indentExcelVO.setDate_time(ExcelUtils.dateToString(item.getDate_time()));
    indentExcelVO.setCreateTime(ExcelUtils.dateToString(item.getCreateTime()));
    return indentExcelVO;
}).collect(Collectors.toList());
```

解决方式2：定义转换器

