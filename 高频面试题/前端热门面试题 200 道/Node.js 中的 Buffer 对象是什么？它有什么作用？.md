## Node.js 中的 Buffer 对象是什么？它有什么作用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
Buffer 对象是 Node.js 中一个全局类，用来在处理二进制数据时，提供对内存缓冲区的操作能力。它可以有效地处理非字符串类型的数据，例如从文件读取的二进制数据或者网络协议传输的数据。

作用：
1）处理二进制数据：Buffer 对象主要用于处理二进制数据，例如视频、图片和文件读取。
2）与流结合：它常与 Node.js 的流操作结合，用于文件处理、网络传输等场景。
3）转换编码格式：Buffer 可以将不同编码格式的字符串进行相互转换，如 utf8、base64 等。

## 扩展知识
既然我们已经知道了 Buffer 的定义和作用，那么我来进一步深入一下它的具体使用场景和一些相关的概念吧。

1）创建 Buffer：
   - Buffer 可以通过多种方式创建，例如直接分配空间、通过字符串创建或从现有数据创建。
   ```javascript
   // 分配 10 个字节的 Buffer
   const buf1 = Buffer.alloc(10);

   // 通过字符串创建，默认编码为 'utf8'
   const buf2 = Buffer.from('Hello, World!');
   ```

2）读写操作：
   - Buffer 提供了多种方法来读取和写入数据，例如 `buf.write` 和 `buf.toString`。
   ```javascript
   const buf = Buffer.alloc(10);
   buf.write('Hello');

   // 输出部分写入后的结果
   console.log(buf.toString('utf8', 0, 5));  // Hello
   ```

3）与流结合：
   - 在 Node.js 中，流是一种处理流数据的抽象接口，用于读写文件和处理网络请求。Buffer 常与流结合，例如读取文件时，可以将读取的内容存储在 Buffer 中处理。
   ```javascript
   const fs = require('fs');
   const readStream = fs.createReadStream('example.txt');
   readStream.on('data', (chunk) => {
       console.log(`Received ${chunk.length} bytes of data.`);
   });
   ```

4）Buffer 性能优势：
   - 相较于字符串操作，Buffer 处理二进制数据时性能更高，因为字符串在处理过程中可能涉及到字符编码和解码的消耗，而 Buffer 直接在内存中操作二进制数据，速度更快。

5）编码转换：
   - Buffer 对象提供了方便的方法进行编码转换，可以轻松实现各种编码之间的转换。
   ```javascript
   const buf = Buffer.from('Hello, World!');
   console.log(buf.toString('base64'));  // 输出 base64 编码的字符串
   ```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)