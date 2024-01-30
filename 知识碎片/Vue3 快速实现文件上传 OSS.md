# Vue3 快速实现文件上传 OSS

> 作者：[吃她喵的花椒](https://efohuajiao.github.io/)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 1112

使用Vue3快速实现文件上传OSS

## 前言

上传文件可以说是经典的需求了，在后台管理项目中随处可见。一般是由前端进行文件上传，然后再由后端去处理。可以选择把文件放到服务器上，但是随着后续文件增多，可能会对服务器的开销比较大，所以一般都采用OSS（Object Storage Service）对象存储服务，将我们的文件上传到第三方服务上，而我们只需要通过url去访问文件就可以了。那么今天就让我们来简单实现一下文件上传的功能吧。

前端采用的是Element plus的upload组件，后端是NodeJS，采用阿里云的OSS服务进行存储。

本文旨在实现上传功能，不考虑额外的功能（如文件尺寸限制）。

## 前端

前端引用一下组件，需要注意的是Element plus的upload组件提供了`action`配置项，填写请求URL就可以上传文件。

![](https://pic.yupi.icu/5563/202401282240663.png)

但为了后期维护，我们一般都不采用`action`配置项,而是将其赋值为`#`,通过`http-request`封装我们自己的请求方法。

通过组件库文档可知，我们的`doUpload`方法会获得一个options参数，我们来看看这个参数里有什么。

![](https://pic.yupi.icu/5563/202401282240869.png)

可以看到通过options可以获取到组件的一些属性和方法，其中的`file`就是我们所需要上传的文件对象。将其解构出来通过`FormData`创建表单对象将文件通过我们封装的`upload`方法传输到后端。

```typescript
const doUpload = async (options: any) => {
  const { file } = options;
  const formData = new FormData();
  formData.append('file', file);
  await upload(fileData);
}
```

这里有个要点，因为是FormData表单对象，所以我们需要在请求头中设置`Content-Type`为`application/form-data`,这样后端才可以识别我们上传的文件，`upload`方法如下。

```typescript
const headers = {
  'Content-type': 'application/form-data'
};
export function upload(params: any) {
  return instance.post('/uploadImg', params, { headers });
}
```

## 后端

后端我们采用express进行编写。

首先简单实现以下接口(注：由于我采用的是TypeScript，所以可以使用ESModule即import和export进行模块引入导出）。

```typescript
import express from 'express';
const app = express();

app.post('/uploadImg',(req, res) => {});

app.listen(1300, () => {})
```

由于我们使用post请求,所以需要通过`body-parser`中间件对请求体的数据进行解析，使解析后的数据可用于后续的请求处理。

通过`pnpm add body-parser `进行安装。

```typescript
import bodyParser from 'body-parser';
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
```

以及还需要`cors`中间件解决跨域问题。

`pnpm add cors`。

```typescript
import cors from 'cors';
app.use(cors());
```

最后，我们还需要`multer`中间件处理我们上传的文件，具体使用如下。

```
pnpm add multer
import multer from 'multer';
const upload = multer({ dest: 'uploads/' }); // 指明文件的地址，即我们后端服务的uploads文件夹下，如果没有会创建。

// 接口中进行文件解析
app.post('/uploadImg', upload.single('file'), async (req: any, res: Response) => {})
```

这里的`upload.single`表明只处理上传数据中的`file`字段对应的数据,也就是我们之前`formData.append('file',file)`里的file文件，如果你设置的是其他字段如`fileData`，那么中间件就要写为`upload.single('fileData')`。

我们可以通过`req.file`来获取处理好的文件，那么我们来看看打印一下这个`req.file`里有什么吧。

![](https://pic.yupi.icu/5563/202401282240154.png)

可以看到里面包含了关于文件的一些信息，比如名称、类型、地址等，其中名称和地址会是我们所需要的参数。

## OSS服务

在阿里云的OSS文档里有提供文件上传的示例代码。

![](https://pic.yupi.icu/5563/202401282241480.png)

进入后我们选择NodeJS的SDK参考，通过下图路径可以看到本文所需的示例代码。

![image-20240127202748283](http://cdn.t-terminal.icu/image-20240127202748283.png)

![](https://pic.yupi.icu/5563/202401282241060.png)

![](https://pic.yupi.icu/5563/202401282241013.png)

可以看到要使用OSS服务需要下载`ali-oss`第三方库。

`pnpm add ali-oss`。

```typescript
import * as OSS from 'ali-oss';

const client = new OSS.default({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Regin填写为oss-cn-hangzhou。
  region: 'oss-cn-hangzhou',
  accessKeyId: '你的阿里云key',
  accessKeySecret: '你的阿里云keyScerect',
  // 填写Bucket名称，例如examplebucket。
  bucket: '你阿里云OSS的桶名'
});

export async function put(filename: string, fileData: File) {
  try {
    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.put(filename, fileData);
    return result;
  } catch (e) {
    console.log(e);
  }
}
```

以上就是完整的上传方法，只需要填写配置就行，其中`accessKeyId`和`accessKeySecret`可以通过个人面板的`AccessKey管理`创建获取。

![](https://pic.yupi.icu/5563/202401282241435.png)

随后我们就可以在接口中进行调用，传入所需的`filename`和`fileData`。

```typescript
router.post('/uploadImg', upload.single('file'), async (req: any, res: Response) => {
  const file = req.file;
  const result = await put(file.originalname, file.path);
  res.send({ code: 200, data: { fileName: result?.name, url: result?.url } });
});
```

到现在为止，我们代码基本实现了，接下来看看成果吧。

![](https://pic.yupi.icu/5563/202401282242794.png)

可以在阿里云的OSS中看到我们上传的文件。

![](https://pic.yupi.icu/5563/202401282242134.png)

而在后端也可获取到接口返回的文件名和外链地址。

![](https://pic.yupi.icu/5563/202401282242791.png)

## 总结

以上就是通过Element Plus的Upload组件、NodeJS和阿里OSS服务实现的文件上传简单实现啦。我是花椒，如果你觉得我的文章还不错就给我点个赞吧~ 如果有什么错误也欢迎评论指正哦~