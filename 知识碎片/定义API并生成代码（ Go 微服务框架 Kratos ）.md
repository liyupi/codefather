# 定义API并生成代码（ Go 微服务框架 Kratos ）

> 作者：[戊子仲秋](https://github.com/wuzizhongqiu/wuzi-study-note#%E6%88%8A%E5%AD%90%E4%BB%B2%E7%A7%8B%E7%9A%84%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E5%88%86%E4%BA%AB)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 20000

首先： kratos new study

我通过用 kratos 官方给的模板创建一个叫 study 的项目（名字随意）

## 如何跑通整个流程？

看官方文档：通过定义 proto 即可使用 REST API 和 RPC API

第一步，定义好我们的 proto 文件

我们可以用官方给出的代码模板生成一个模板，比如说，我想实现一个 todo 清单的增删改查：

```shell
kratos proto add api/study/v1/todo.proto
```

他生成了一个 proto 文件，我们根据需要去修改就行：

```protobuf
service Todo {
	rpc CreateTodo (CreateTodoRequest) returns (CreateTodoReply);
	rpc UpdateTodo (UpdateTodoRequest) returns (UpdateTodoReply);
	rpc DeleteTodo (DeleteTodoRequest) returns (DeleteTodoReply);
	rpc GetTodo (GetTodoRequest) returns (GetTodoReply);
	rpc ListTodo (ListTodoRequest) returns (ListTodoReply);
}

message CreateTodoRequest {}
message CreateTodoReply {}

message UpdateTodoRequest {}
message UpdateTodoReply {}

message DeleteTodoRequest {}
message DeleteTodoReply {}

message GetTodoRequest {}
message GetTodoReply {}

message ListTodoRequest {}
message ListTodoReply {}
```

这里我们就实现模板给的 5 个接口：

```protobuf
import "google/api/annotations.proto"; // 需要引入

service Todo {
	rpc CreateTodo (CreateTodoRequest) returns (CreateTodoReply) {
		option (google.api.http) = { // http 方法
			post: "/v1/todo/create",
			body: "*"
		};
	};
	rpc UpdateTodo (UpdateTodoRequest) returns (UpdateTodoReply) {
		option (google.api.http) = {
			post: "/v1/todo/update/{id}",
			body: "*"
		};
	};
	rpc DeleteTodo (DeleteTodoRequest) returns (DeleteTodoReply) {
		option (google.api.http) = {
			post: "/v1/todo/delete/{id}",
			body: "*"
		};
	};
	rpc GetTodo (GetTodoRequest) returns (GetTodoReply) {
		option (google.api.http) = {
			get: "/v1/todo/get/{id}",
		};
	};
	rpc ListTodo (ListTodoRequest) returns (ListTodoReply) {
		option (google.api.http) = {
			get: "/v1/todo/list",
		};
	};
}

message todo {
	int64 id = 1;
	string title = 2;
	bool status = 3;
}

message CreateTodoRequest { // 发送给前端的请求参数
	string title = 1;
}
message CreateTodoReply { // 从前端接收的返回参数
	int64 id = 1;
	string title = 2;
	bool status = 3;
}

message UpdateTodoRequest {
	int64 id = 1;
	string title = 2;
	bool status = 3;
}
message UpdateTodoReply {}

message DeleteTodoRequest {
	int64 id = 1;
}
message DeleteTodoReply {}

message GetTodoRequest {
	int64 id = 1;
}
message GetTodoReply {
	todo todo = 1;
}

message ListTodoRequest {}
message ListTodoReply {
	repeated todo data = 1;
}
```

然后生成 go 代码；

```shell
kratos proto client api/study/v1/todo.proto
```

当看到这里的 go 代码成功生成了，就证明没什么问题：

![](https://pic.yupi.icu/5563/202401011502181.png)

我们继续生成 service 端代码：

```awk
kratos proto server api/study/v1/todo.proto -t internal/service
```

可以看到这里就多了一个 todo.go 的代码了

![](https://pic.yupi.icu/5563/202401011502242.png)

那 service 层的这个 todo.go 应该实现一些什么东西呢？

我们可以看看示例的 greater.go 实现了什么，他这里嵌入了一个实现业务逻辑的结构体，在 biz 里面的

![](https://pic.yupi.icu/5563/202401011502315.png)

然后下面就是具体逻辑的实现：

![](https://pic.yupi.icu/5563/202401011502297.png)

那咱们也照葫芦画瓢，同样整一份：

```go
type TodoService struct {
	pb.UnimplementedTodoServer

	// 嵌入一个实现业务逻辑的结构体（biz）
	uc *biz.TodoUsecase
}

func NewTodoService(uc *biz.TodoUsecase) *TodoService {
	// 在这里需要初始化, 传入 uc
	return &TodoService{
		uc: uc,
	}
}
```

![](https://pic.yupi.icu/5563/202401011502234.png)

biz 这里，咱们 CV 他的 greater.go 代码，自己实现一份我们的 todo.go，

根据我们前面定义的 proto 文件，定义好 Todo 的结构体，然后想一想我们需要 data 层实现什么功能，

最后就是实现我们的 CreateTodo，给 service 提供一个创建的方法

```go
// Todo is a Greeter model.
type Todo struct {
	ID     int64
	Title  string
	Status bool
}

// TodoRepo 封装的是需要数据操作层给我的实现的操作（biz 层对 data 层提出了这些要求）
type TodoRepo interface {
	Save(context.Context, *Todo) (*Todo, error)
	Update(context.Context, *Todo) error
	Delete(context.Context, int64) error
	FindByID(context.Context, int64) (*Todo, error)
	ListAll(context.Context) ([]*Todo, error)
}

// TodoUsecase is a Greeter usecase.
type TodoUsecase struct {
	repo TodoRepo
	log  *log.Helper
}

// NewTodoUsecase new a Greeter usecase.
func NewTodoUsecase(repo TodoRepo, logger log.Logger) *TodoUsecase {
	return &TodoUsecase{repo: repo, log: log.NewHelper(logger)}
}

// CreateTodo 创建一个新的 Todo
// 对外提供的的业务函数, 具体来说就是 service 层调用他
func (uc *TodoUsecase) CreateTodo(ctx context.Context, t *Todo) (*Todo, error) {
	uc.log.WithContext(ctx).Infof("CreateTodo: %v", t)
	return uc.repo.Save(ctx, t) // 调用下一层的 Save
}
```

接着，我们回到 service 层，咱们先实现一个逻辑的 demo，然后让程序快速跑起来：

```go
func (s *TodoService) CreateTodo(ctx context.Context, req *pb.CreateTodoRequest) (*pb.CreateTodoReply, error) {
	// 请求来了
	if len(req.GetTitle()) == 0 {
		return &pb.CreateTodoReply{}, fmt.Errorf("无效的title")
	}
	// 调用业务逻辑
	data, err := s.uc.CreateTodo(ctx, &biz.Todo{
		Title: req.Title,
	})
	if err != nil {
		return nil, err
	}
	// 返回响应
	return &pb.CreateTodoReply{
		Id:     data.ID,
		Title:  data.Title,
		Status: data.Status,
	}, nil
}
```

我们在 biz 层给 data 层提了要求，那我们就需要去实现一下，

同样的操作，CV 一份 greater.go 的代码，然后修改我们的 todo.go

![](https://pic.yupi.icu/5563/202401011502300.png)

把我们之前在 biz 层封装的功能都写好在这里

```go
type todoRepo struct {
	data *Data
	log  *log.Helper
}

// NewtodoRepo .
func NewtodoRepo(data *Data, logger log.Logger) biz.TodoRepo {
	return &todoRepo{
		data: data,
		log:  log.NewHelper(logger),
	}
}

func (r *todoRepo) Save(ctx context.Context, t *biz.Todo) (*biz.Todo, error) {
	fmt.Printf("save: t: %v\n", t)
	// 实现数据库操作
	return t, nil
}

func (r *todoRepo) Update(ctx context.Context, t *biz.Todo) error {
	return nil
}

func (r *todoRepo) Delete(ctx context.Context, id int64) error {
	return nil
}

func (r *todoRepo) FindByID(ctx context.Context, id int64) (*biz.Todo, error) {
	return nil, nil
}

func (r *todoRepo) ListAll(context.Context) ([]*biz.Todo, error) {
	return nil, nil
}
```

这里暂时先不写具体的逻辑，如果需要操作数据库，那就要到 data.go 文件连接我们的数据库，我们先把项目跑起来，暂时先不管

最后，我们逻辑实现完了，别人怎么调用我们的服务呢？这时候就要到 server 层注册服务，grpc.go：

```go
import (
	v1 "study/api/study/v1" // 注意要 import study
	"study/internal/conf"
	"study/internal/service"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/transport/grpc"
)

// NewGRPCServer new a gRPC server.
func NewGRPCServer(c *conf.Server, todo *service.TodoService, logger log.Logger) *grpc.Server {
	var opts = []grpc.ServerOption{
		grpc.Middleware(
			recovery.Recovery(),
		),
	}
	if c.Grpc.Network != "" {
		opts = append(opts, grpc.Network(c.Grpc.Network))
	}
	if c.Grpc.Addr != "" {
		opts = append(opts, grpc.Address(c.Grpc.Addr))
	}
	if c.Grpc.Timeout != nil {
		opts = append(opts, grpc.Timeout(c.Grpc.Timeout.AsDuration()))
	}
	srv := grpc.NewServer(opts...)
	v1.RegisterTodoServer(srv, todo)
	return srv
}
```

http.go 也是类似的，这里就不放代码了

最后到 cmd 目录下的 wire.go 文件：

![](https://pic.yupi.icu/5563/202401011502409.png)

将这里 wire.Build 里面的函数，点进他们的实现，然后修改成我们的逻辑，比如进 data.ProviderSet：

```go
var ProviderSet = wire.NewSet(NewData, NewtodoRepo)
```

改成 NewtodoRepo，其他的也类似，然后进入到 wire.go 在的目录，执行 wire：

```ebnf
wire
```

生成新的 wire_gen.go 代码

最后，一切都准备就绪，我们回到主路径，将项目跑起来：

```routeros
kratos run
```

![](https://pic.yupi.icu/5563/202401011502562.png)

![](https://pic.yupi.icu/5563/202401011502549.png)

项目就成功跑起来了