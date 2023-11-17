# 网络编程

现在我们的生活中，无论是学习、娱乐还是购物，离不开网络。而通过网络编程，我们可以实现网络传输数据，而 Java 也提供了丰富的类库和API，可以轻松实现各种基于网络的应用。

## 网络编程的概述

网络编程是指使用计算机网络技术，编写程序实现计算机之间进行通信和传输数据。 它是分布式计算的一种重要手段，是实现网络应用程序的关键。

Java 语言支持网络编程，对此提供了丰富的 API 和类库。Java 提供了网络通信的基础类“Socket”和“ServerSocket”，通过Socket，客户端可以发送数据到服务端，服务端也可以发送数据到客户端，而ServerSocket则是保持网络服务的类。

## Socket 类

Socket类是Java语言对TCP/IP 协议的封装，客户端可以使用该类向服务端发起连接请求，服务端通过ServerSocket类接收请求，并可以与客户端双向通信。

使用Socket进行编程时，需要先作为客户端使用Socket类打开套接字，连接到指定的服务器，然后就可以通过输入输出流进行通信。另一方面，服务端通过ServerSocket类接收客户端的连接请求，并创建一个Socket对象，通过它类读取客户端发送的数据并向客户端发送数据。

下面是客户端发送信息的代码：

```Java
Socket socket = new Socket("127.0.0.1",8080);
OutputStream outputStream = socket.getOutputStream();
outputStream.write("Hello Server".getBytes());
outputStream.close();
socket.close();
```

上面代码中，Socket 的第一个参数是指定要连接到的服务器的 IP 地址，第二个参数是指定端口号。通过 getOutputStream 方法获得输出流，将需要发送的字符串转换成 byte 数组，并通过 write 方法发送到指定的服务端。

## ServerSocket 类

和Socket类一样，ServerSocket类也是Java语言对TCP/IP协议的封装。服务端可以使用该类进行监听，等待接收客户端连接，并可以通过服务端套接字传输数据。

服务端需要先使用ServerSocket类打开套接字，然后等待客户端的连接请求，一旦有客户端连接请求到达，就可以通过Socket类建立与客户端之间的通信。

下面是服务端监听端口并被动接收客户端请求的代码：

```Java
ServerSocket serverSocket = new ServerSocket(8080);
System.out.println("server start, wait for client...");
Socket socket = serverSocket.accept();
InputStream inputStream = socket.getInputStream();
byte[] bytes = new byte[1024];
int len;
StringBuilder sb = new StringBuilder();
while ((len = inputStream.read(bytes)) != -1){
    sb.append(new String(bytes,0,len,"UTF-8"));
}
System.out.println("client message:" + sb);
inputStream.close();
socket.close();
```

上面代码中，ServerSocket类的构造函数指定监听的端口号，通过调用 accept 方法，在程序执行到此处时会阻塞，直到有客户端请求连接到该端口上，才会继续执行程序。客户端请求连接之后，会新创建一个Socket对象，并通过这个Socket对象通信。

以上就是Java网络编程的基础知识，希望对大家理解网络编程有一定的帮助。