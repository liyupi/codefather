# 【Ajax】异步通信

> 作者：[观止.](https://blog.csdn.net/m0_66570338)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 6872

【Ajax】异步通信

## 一.概述

- 概念：AJAX(Asynchronous JavaScript And XML)：异步的 JavaScript 和 XML

- 作用：

  1. 与**服务器进行数据交换**：通过AJAX可以给服务器发送请求，并获取服务器响应的数据

     使用了AJAX和服务器进行**通信**，就可以使用 HTML+AJAX来**替换JSP页面**，可以说是终结了JSP的存在，促使了前后端分离开发

![](https://pic.yupi.icu/5563/202312181551899.png) 

2. 实现**异步交互**：可以在**不重新加载整个页面**的情况下，与**服务器交换数据并更新部分网页**的技术，如：搜索时的联想、检查用户名是否可用校验，等等

![](https://pic.yupi.icu/5563/202312181551973.png)

**补充说明：异步&同步通信**

![](https://pic.yupi.icu/5563/202312181551909.png)

## 二.使用

![](https://pic.yupi.icu/5563/202312181551277.png)

## (1) GET请求

### (1.1) 流程

1. 创建 XMLHttpRequest 对象：用于和服务器交换数据

```javascript
let xhr = new XMLHttpRequest();
```

1. 向服务器发送请求

```javascript
xhr.open("GET","url");
xhr.send();
```

1. 获取服务器响应数据

```javascript
// 监听请求
xhr.onreadystatechange = function () {
// 表示请求成功并且获取到响应数据
if (xhr.readyState == 4 && xhr.status == 200){
		alert(xhr.responseText);
    	// 拿到数据进行一系列操作....
	}
}
```

**相关属性说明：**

| 属性                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| `onreadystatechange` | 定义当 readyState 属性**发生变化时被调用的函数**             |
| `readyState`         | **保存 XMLHttpRequest 的状态**。`0`：请求未初始化 `1`：服务器连接已建立 `2`：请求已收到 `3`：正在处理请求 `4`：请求已完成且响应已就绪 |
| `responseText`       | 以**字符串**返回**响应数据**                                 |
| responseXML          | 以 XML 数据返回响应数据                                      |
| `status`             | 返回请求的状态号200: "OK"403: "Forbidden"404: "Not Found"如需完整列表请访问 [Http 消息参考手册](https://www.w3school.com.cn/tags/html_ref_httpmessages.asp) |
| statusText           | 返回状态文本（比如 "OK" 或 "Not Found"）                     |

### (1.2) 完整代码示例

如果需要，可以通过`?`在url后面拼接请求参数

```javascript
	// 1.创建 XMLHttpRequest 对象：用于和服务器交换数据
    let xhr = new XMLHttpRequest();

    // 2.向服务器发送请求
    xhr.open("GET", "http://localhost/newsWork_war_exploded/Search?searchText=" + searchText.value);
    xhr.send();
	
	// 3.获取服务器响应数据
	xhr.onreadystatechange = function () {
	// 表示请求成功并且获取到响应数据
	if (xhr.readyState == 4 && xhr.status == 200){
			alert(xhr.responseText);
        	// 拿到数据可以进行一系列操作....
		}
	}
```

**简单使用示例：**

![](https://pic.yupi.icu/5563/202312181551985.png)

## (2) POST请求

post请求发送方式与Get请求类似

### (2.1) 流程

1. 创建 XMLHttpRequest 对象：用于和服务器交换数据

```javascript
let xhr = new XMLHttpRequest();
```

1. 向服务器发送请求

```javascript
// 方式一：简单请求
xhr.open("POST","url");
xhr.send();


// 方式二：
// 如需像 HTML表单那样发送数据，需通过 `setRequestHeader()` 添加一个 HTTP 头部。
// 请在 `send()` 方法中规定您需要发送的数据
// 2.1 发起请求
xhr.open("POST", 'http://localhost/newsWork_war_exploded/login');
// 2.2 设置HTTP头部
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// 2.3 规定需要发送的数据
xhr.send(`username=${username.value}&userPassword=${userPassword.value}`);
```

1. 获取服务器响应数据

```javascript
xhr.onreadystatechange = function () {
// 表示请求成功并且获取到响应数据
if (xhr.readyState == 4 && xhr.status == 200){
		alert(xhr.responseText);
        // 拿到数据可以进行一系列操作....
	}
}
```

相关属性说明：

| 属性                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| `onreadystatechange` | 定义当 readyState 属性**发生变化时被调用的函数**             |
| `readyState`         | **保存 XMLHttpRequest 的状态**。`0`：请求未初始化 `1`：服务器连接已建立 `2`：请求已收到 `3`：正在处理请求 `4`：请求已完成且响应已就绪 |
| `responseText`       | 以**字符串**返回**响应数据**                                 |
| responseXML          | 以 XML 数据返回响应数据                                      |
| `status`             | 返回请求的状态号200: "OK"403: "Forbidden"404: "Not Found"如需完整列表请访问 [Http 消息参考手册](https://www.w3school.com.cn/tags/html_ref_httpmessages.asp) |
| statusText           | 返回状态文本（比如 "OK" 或 "Not Found"）                     |

### (2.2) 完整代码示例

post与get不同之处在于需要自己设置HTTP头部并在send中规定传递参数

```javascript
// 1.创建 XMLHttpRequest 对象：用于和服务器交换数据
let xhr = new XMLHttpRequest();
// 2.向服务器发送请求
xhr.open("POST", 'http://localhost/newsWork_war_exploded/login');
// 2.1设置HTTP头部
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// 2.2规定需要发送的数据
xhr.send(`username=${username.value}&userPassword=${userPassword.value}`);

// 3.获取服务器响应数据
xhr.onreadystatechange = function () {
// 表示请求成功并且获取到响应数据
if (xhr.readyState == 4 && xhr.status == 200){
		alert(xhr.responseText);
        // 3.1 拿到数据可以进行一系列操作....
	}
}
```

**简单使用示例：**

![](https://pic.yupi.icu/5563/202312181551040.png)

## 三.补充

#### (1) 发起同步请求

open方法的完整格式如下：

- `open(method, url, async)`
  - `method`：请求的类型：GET 还是 POST
  - `url`：服务器（文件）位置
  - `async`：true（异步）或 false（同步） |

由于其不写默认是true异步请求，所以我们可以不用设置。当如果我们需要使用**同步请求**时，我们需要手动**将第三个参数设置为false**

```javascript
xhr.open("method", 'url', false);
xhr.send();

// 不用再监听状态（xhr.onready....)
// 可直接使用结果
alert(xhr.responseText);
```

**不推荐使用**，常用于一些快速测试。需要注意的是，当我们发起同步请求时，**此操作可能会导致应用程序挂起或停止（无法再执行其他操作）**。而通过异步发送，JavaScript 不必等待服务器响应,可继续执行其他操作

#### (2) Json格式

在post请求中我们也可以传递和接收Json格式的数据:

- 可以自己将对象转为Json**传递**

```javascript
const requestData = JSON.stringify(formDate)
xhr.send(paramDate)
```

- **接收并解析**Json格式数据

```javascript
// 方式一：手动解析
const responseData = JSON.parse(xhr.responseText)

// 方式二: 设置自动解析
xhr.responseType='json'
```