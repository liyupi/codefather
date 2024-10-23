# Java 实现 GitHub 第三方登录详解

> 作者：[为](https://blog.csdn.net/Go_ahead_forever)，[编程导航](https://www.codefather.cn) 编号 14255

## 创建一个 Github 应用

1. 点击 Github 的头像
2. 然后点击设置
3. ![](https://pic.yupi.icu/5563/202402211807239.png)
4. 进入设置后，往下滑，点击开发者设置

![](https://pic.yupi.icu/5563/202402211807024.png)

4.1然后点击 Oauth apps

![](https://pic.yupi.icu/5563/202402211807852.png)

 5. 随后创建一个新的OAuth App

![](https://pic.yupi.icu/5563/202402211807854.png) 6. 可以看到的是期中有几个必填选项，下面我们来一一说明

![](https://pic.yupi.icu/5563/202402211807844.png)

```markdown
1. Application name 这个可以随意填写，就是你的一个应用名字而已
2. Homepage URL 填写你自己的前端页面的首页就好了
3. Application description 这个就是一个描述，随意填写就好了
4. Authorization callback URL 这个就是授权了以后进行身份判断的回调地址，用于自己对第三方信息进行获取，处理，鉴权。比较重要
5. 下面是一个填写示例：
```

![](https://pic.yupi.icu/5563/202402211807857.png) 

7. 全部填写好后我们成功创建了一个 Github 授权应用。

   8.这里需要我们进行几个关键信息的记录，一个是 client_id 这个不会变，一个是 client_secret （注意，这个只能查看一次请妥善保管），这些信息我们后面需要用。

## 定义一个跳转按钮，进行 Github 的授权

首先在前端页面中定义一个跳转到 Github 授权页面的链接，示例如下：

```html
<a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=请填写自己的client_id">Github登录</a>
```

这里可以自己随意快速的开一个前端应用，然后加一个链接标签，把 href 属性的值如上就可以了，只需要注意的是其中的 client_id 需要换成自己的就行，创建好以后，前后端分离的那么前端几乎就没有事情需要做了。这里主要是前后端分离版本。

![](https://pic.yupi.icu/5563/202402211807330.png)

## 通过授权拿到一个随机的 code

点击上面的 Github 登录以后会出现一个这样的页面

![](https://pic.yupi.icu/5563/202402211807353.png)

![](https://pic.yupi.icu/5563/202402211807362.png)

![image.png](https://pic.yupi.icu/5563/202402211807419.png)

通过在创建的应用的时候写的回调 URL 进行后端的处理，用户在点击授权以后，页面会重定向进行一个 Get 请求，后端去接收这个请求，并且进行处理就可以了，重定向的时候，会传递一个参数 code ，这个 code 可以用于获取 access_token , 获取到 token 以后用于获取 用户的信息。

接口示例：

```java
public class ThirdLoginController {
    @GetMapping("/callback")
    public void getCode(String code){
        System.out.println(code);
```

debug 拿值示例

![](https://pic.yupi.icu/5563/202402211807613.png)

这一部分只是为了我能够拿到 code 的值，我们一步一步来，看下面 👇

## 通过 code 进行后端回调处理，拿到access_token

这里我是通过阅读官方文档进行一点一点测试的，官方的文档的语言并不是 Java 这里给出官方文档和我的写法

我的写法(这里发起 Http 请求使用的是 Hutool 工具包)

```java
Map<String, Object > paramMap = new HashMap<>();
paramMap.put("client_id","填写自己的client_id");
paramMap.put("client_secret","填写自己的secret");
paramMap.put("code",code);
paramMap.put("accept","json");
String result = HttpUtil.post("https://github.com/login/oauth/access_token",paramMap);
```

拿到的结果(类似👇)：

```json
access_token=gho_lK2Eop11rUH9U7aDTcxUrdORdTPAIS2vVDbh&scope=user%3Aemail&token_type=bearer
```

官方参考

```ruby
get '/callback' do
  # get temporary GitHub code...
  session_code = request.env['rack.request.query_hash']['code']

  # ... and POST it back to GitHub
  result = RestClient.post('https://github.com/login/oauth/access_token',
                          {:client_id => CLIENT_ID,
                           :client_secret => CLIENT_SECRET,
                           :code => session_code},
                           :accept => :json)

  # extract the token and granted scopes
  access_token = JSON.parse(result)['access_token']
end
```

## 拿到授权信息以后可以进行获取用户的信息

拿到 token 信息以后，我们要对信息进行处理，从中提取出 access_token 的值，然后就是发起请求获取用户信息了，这里获取用户信息，也是参考官方文档的，后面一直授权不能通过，通过问 AI 解决了问题。

我的示例代码：

```java
// 处理拿到的信息
String token = result.split("&")[0].split("=")[1];
        // 获取用户信息，发起get 请求，拿到用户信息
        String finalResult = HttpRequest.get("https://api.github.com/user")
                .header("Authorization","token "+token)
                .header("X-GitHub-Api-Version", "2022-11-28")
                .execute().body();
```

> 代码中我出问题的地方在 header 的设置，也就是不知道我获取的 token 怎么传给 github 官方，好像参考的里面说的也不是很明白，后面看了，github 官方关于 授权的文档是要加上两个请求头才能够正常进行请求`Authorization`(这里需要注意的是，token 值得书写，必须是 token后面空格，写access_token的值) `X-GitHub-Api-Version ` 这个的话就是只需要带上 API 版本的值就好了。

信息结果示例：

```json
{
  "login": "xwhking",
  "id": 97931879,
  "node_id": "U_kgDOBdZSZw",
  "avatar_url": "https://avatars.githubusercontent.com/u/97931879?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/xwhking",
  "html_url": "https://github.com/xwhking",
  "followers_url": "https://api.github.com/users/xwhking/followers",
  "following_url": "https://api.github.com/users/xwhking/following{/other_user}",
  "gists_url": "https://api.github.com/users/xwhking/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/xwhking/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/xwhking/subscriptions",
  "organizations_url": "https://api.github.com/users/xwhking/orgs",
  "repos_url": "https://api.github.com/users/xwhking/repos",
  "events_url": "https://api.github.com/users/xwhking/events{/privacy}",
  "received_events_url": "https://api.github.com/users/xwhking/received_events",
  "type": "User",
  "site_admin": false,
  "name": "xwhking",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 8,
  "public_gists": 0,
  "followers": 1,
  "following": 2,
  "created_at": "2022-01-18T04:06:06Z",
  "updated_at": "2024-02-20T02:27:32Z"
}
```

从中我们可以获取一些最为直观的信息，比如 name（github用户名），avatar_url （头像地址），html_url（用户的 github 主页）等。

还可以以同样的方式获取用户的邮箱，只是请求的url 变化一下而且，就是请求 url 变成 `https://api.github.com/user/emails`

请求邮箱结果如下：

```json
[
    {
        "email": "2837468248@qq.com",
        "primary": true,
        "verified": true,
        "visibility": "private"
    },
    {
        "email": "97931879+xwhking@users.noreply.github.com",
        "primary": false,
        "verified": true,
        "visibility": null
    }
]
```

从中可以获取邮箱信息，通过判断 primary 字段判断是否为私有邮箱。

参考官方文档：

```ruby
# fetch user information
auth_result = JSON.parse(RestClient.get('https://api.github.com/user',
                                        {:params => {:access_token => access_token}}))

# if the user authorized it, fetch private emails
if has_user_email_scope
  auth_result['private_emails'] =
    JSON.parse(RestClient.get('https://api.github.com/user/emails',
                              {:params => {:access_token => access_token}}))
end

erb :basic, :locals => auth_result
```

整体的一个后端代码示例：

```java
@RestController
@RequestMapping("/third_login")
public class ThirdLoginController {
    @GetMapping("/callback")
    public void getCode(String code){
        System.out.println(code);
        Map<String, Object > paramMap = new HashMap<>();
        paramMap.put("client_id","XXX");
        paramMap.put("client_secret","XXX");
        paramMap.put("code",code);
        paramMap.put("accept","json");
        String result = HttpUtil.post("https://github.com/login/oauth/access_token",paramMap);
        String token = result.split("&")[0].split("=")[1];
        // 获取用户信息
        String finalResult = HttpRequest.get("https://api.github.com/user")
                .header("Authorization","token "+token)
                .header("X-GitHub-Api-Version", "2022-11-28")
                .execute().body();
        System.out.println(finalResult);

    }
}
```

## 拿到的用户信息与数据库进行比对进行登录验证（思路）

我们都拿到 Github 上用户的信息了，那么只需要把拿到的信息放入我们自己的数据库，那么是不是就可以让用户进行登录了呀！

比如我们可以记录用户的，id，用户名，邮箱，如果用户是第一次登录，就新创建一条记录，如果不是就进行数据库数据的比对进行登录，如果有错误，不让登录就好。没有错误就把页面重定向到对应的前端页面，并且把用户信息返回给前端。这样应该就算是第三方登录了吧！