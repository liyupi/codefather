## 前端如何实现基于 WebSocket 的实时聊天功能，支持多用户在线聊天并展示消息通知？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
基于 WebSocket 实现实时聊天功能其实并不难，主要包括以下几个步骤：

1) **建立 WebSocket 连接：** 前端需要和服务器建立 WebSocket 连接。
2) **处理连接事件：** 连接成功、收到消息、出错、关闭连接等事件需要处理。
3) **发送消息：** 用户输入消息后，通过 WebSocket 把消息发送到服务器。
4) **接收消息：** 通过 WebSocket 接收其他用户发送的消息，并展示在聊天窗口中。
5) **显示消息通知：** 当有新消息到达时，需要向用户展示消息通知。

```javascript
// 示例代码
const socket = new WebSocket('ws://yourserver.com');

// 连接成功
socket.addEventListener('open', function (event) {
    console.log('Connected to the WebSocket server');
});

// 收到消息
socket.addEventListener('message', function (event) {
    displayMessage(event.data);
});

// 连接关闭
socket.addEventListener('close', function (event) {
    console.log('Disconnected from the WebSocket server');
});

// 发送消息
function sendMessage(message) {
    socket.send(message);
}

// 显示消息
function displayMessage(message) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
}

// 显示消息通知
function showNotification(message) {
    // 假设我们通过一个简单的 alert 显示通知
    alert('New message: ' + message);
}
```

## 扩展知识
好了，上面介绍了实现实时聊天的基本功能，现在让我们更进一步，把这个项目做得更全面一些，考虑到实际应用可能会遇到的问题和需求。

1) **多用户支持：**
   - **用户身份标识：** 每个用户需要有唯一的ID，确保消息可以正确地归属到某个用户。这通常由服务器生成和管理，可以在前端通过 URL 或者登录机制传递过来。
   - **前端显示用户列表：** 通过一个用户列表展示当前在线的用户。

2) **消息通知优化：**
   - **视觉通知：** 可以在页面上增加一个消息通知区域，未读消息可以高亮显示。并且在有新消息时通过浏览器 notifications API 提示用户。
   - **声音通知：** 可以在收到新消息时播放声音来提醒用户。

3) **消息存储与同步：**
   - **存储机制：** 我们需要把消息存储在后端的数据库中，以便在用户重连或刷新页面时能同步历史消息。
   - **离线消息：** 当用户离线时，服务器应该能缓存消息并在用户上线后再发送。

4) **安全性及稳定性：**
   - **安全连接：** 我们使用 wss://（即 WebSockets Secure）来替代 ws:// 确保数据传输的安全。
   - **心跳检测：** 通过定期的 ping/pong 来保持连接的稳定性和检查网络状态。
   - **错误处理：** 对于连接失败、消息发送失败等情况有完整的错误处理机制。

5) **UI与UX：**
   - 界面设计要美观，消息显示要分清发送者和接收者，精准地展示发言时间。
   - 支持表情、图片等多媒体消息，丰富聊天内容的表现形式。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)