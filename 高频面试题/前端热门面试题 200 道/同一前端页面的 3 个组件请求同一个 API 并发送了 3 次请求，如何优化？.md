## 同一前端页面的 3 个组件请求同一个 API 并发送了 3 次请求，如何优化？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
当同一前端页面的 3 个组件请求同一个 API 并发送了 3 次请求时，我们可以通过共享数据、使用全局状态管理或请求缓存来优化。具体优化，例如：

1）利用全局状态管理工具（如 Redux、Vuex 等）来管理和共享数据。
2）在父组件中请求数据，然后通过 props 传递给子组件，避免每个组件单独请求。
3）使用请求缓存机制，将 API 请求的结果缓存起来，重复请求时直接使用缓存数据。

## 扩展知识
对于这种情况，我们其实有很多优化思路和技术可以考量：

### 全局状态管理
全局状态管理工具（如 Redux、Vuex 等）可以有效地管理应用中的状态。这类工具允许你将数据存放在全局的 store 中，任何组件都可以从这个 store 中获取数据，避免了重复请求。例如：

```javascript
// 在 Redux 中定义一个 action 和 reducer
const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';

const fetchDataSuccess = (data) => ({
  type: FETCH_DATA_SUCCESS,
  payload: data,
});

const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

// 在 Redux thunk 中请求数据
export const fetchData = () => async (dispatch) => {
  const response = await apiService.getData();
  dispatch(fetchDataSuccess(response.data));
};
```

### 组件通信
父组件请求数据然后通过 props 传递给子组件也能有效避免重复请求。这样可以将 API 请求集中在一个地方，实现数据的统一管理。如下示例：

```javascript
class ParentComponent extends React.Component {
  state = {
    data: null,
  };

  componentDidMount() {
    apiService.getData().then((response) => {
      this.setState({ data: response.data });
    });
  }

  render() {
    const { data } = this.state;
    return (
      <>
        <ChildComponent1 data={data} />
        <ChildComponent2 data={data} />
        <ChildComponent3 data={data} />
      </>
    );
  }
}
```

### 请求缓存
请求缓存是另一种非常有效的优化策略，可以利用浏览器本地存储（localStorage、sessionStorage），或者内存中的缓存机制。一个简单的缓存示例如下：

```javascript
const apiCache = {};

const cachedFetchData = async () => {
  if (apiCache['data']) {
    return apiCache['data'];
  }

  const response = await apiService.getData();
  apiCache['data'] = response.data;
  return response.data;
};

// 使用缓存的组件
useEffect(() => {
  cachedFetchData().then((data) => {
    setData(data);
  });
}, []);
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)