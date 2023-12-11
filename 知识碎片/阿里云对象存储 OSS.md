# 阿里云对象存储 OSS

> 作者：[agency](https://wx.zsxq.com/dweb2/index/footprint/418552142185588)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 17494

## 1 在官网注册账号

官网地址：[https://home.console.aliyun.com/](https://home.console.aliyun.com/)

## 2 在官网产品中开启对象存储 oss
第一次使用会先开启对象存储服务，用量小是免费使用的<br />![](https://pic.yupi.icu/5563/202311271521997.png)


## 3 创建一个对象存储空间 bucket
![](https://pic.yupi.icu/5563/202311271521351.png)<br />定义不可重复的名字，选择本地冗余存储（省流）<br />![](https://pic.yupi.icu/5563/202311271521104.png)<br />查看存储空间列表<br />![](https://pic.yupi.icu/5563/202311271521534.png)
<a name="Oe4AO"></a>

## 4 获取上传密钥
![](https://pic.yupi.icu/5563/202311271522693.png)

<br />自己生成一个即可

## 5 上传文件测试
官网中有详细教程，以表单上传为例<br />[https://help.aliyun.com/zh/oss/developer-reference/form-upload-1?spm=a2c4g.11186623.0.0.46cb6d86hqmZRz](https://help.aliyun.com/zh/oss/developer-reference/form-upload-1?spm=a2c4g.11186623.0.0.46cb6d86hqmZRz)<br />![](https://pic.yupi.icu/5563/202311271523883.png)


#### 5.1 进行 Java 安装及初始化
引入pom 依赖
```java
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.10.2</version>
</dependency>
```
配置密钥参数
```java
oss:
  aliyun:
    endpoint: oss-cn-beijing.aliyuncs.com #Bucket所在地域对应的Endpoint
    accessKeyId:  #填写自己的keyId
    accessKeySecret: #填写自己的KeySecret
    bucket:  huimin-code #存储空间列表名称
    domain: https://huimin-code.oss-cn-beijing.aliyuncs.com/ #以北京为例,返回前端用于组合文件
```
配置并创建 OssClient，也可根据官网教程来
```java
@Configuration
public class OssAC {
    @Value("${oss.aliyun.endpoint}")
    public String ENDPOINT;
    @Value("${oss.aliyun.bucket}")
    public static  String BUCKET;
    @Value("${oss.aliyun.domain}")
    public static  String DOMAIN;
    @Value("${oss.aliyun.accessKeyId}")
    public  String ACCESSKEY_ID;
    @Value("${oss.aliyun.accessKeySecret}")
    public  String ACCESSKEY_SECRET;

    //初始化OSS
    @Bean
    public OSS oss(){
        return new OSSClientBuilder().build(ENDPOINT,ACCESSKEY_ID, ACCESSKEY_SECRET);
    }
}
```

#### 5.2 上传文件测试，表单上传
```java
    //上传证件照
    @ApiOperation("上传证件照")
    @PostMapping("/upload")
    public String upload2(@RequestParam("file") MultipartFile multipartFile){
        try {
            InputStream inputStream = multipartFile.getInputStream();
            //获取上传文件名称
            String fullename =multipartFile.getOriginalFilename();
            //截取文件扩展名
            String ext = fullename.substring(fullename.lastIndexOf("."));
            //自定义文件名称
            String fileName = System.currentTimeMillis()+ext;
            // 组合阿里云OSS上传参数  依次为 存储空间名，文件名（可以包括文件夹）,文件流
            // 注意对象存储没有文件夹概念，如果要区分文件可以再文件名加/  eg:/2021/04/16/202111222555.png
            PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET,fileName,inputStream);
            // 上传
            oss.putObject(putObjectRequest);
            return DOMAIN+fileName;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
```
使用 postman 进行测试，要选择 post 请求，表单形式提交，上传文件，<br />![](https://pic.yupi.icu/5563/202311271523558.png)<br />返回地址，可以复制地址在浏览器输入查看，**如果是报没权限的错误**，进行下面设置，<br />![](https://pic.yupi.icu/5563/202311271523743.png)

