# Flux

Flux 是一种基于 React 构建的前端应用架构，它主要的目的是用来解决组件间通信和数据管理的问题。在传统的 MVC 架构中，数据流动的方向通常是单向的，但是在复杂的应用中，数据的流向就变得复杂起来。这时候，Flux 就能够提供一种清晰的思路来处理问题。 

Flux 数据流的核心是一个单向数据流向，数据从“Action”的派发器开始，然后经过“Store”被“View”读取显示。在这个过程中，其中一个非常重要的角色是“Dispatcher”， 它主要用来作为数据的分配中心，将 Action 分发到 Store 和 View 中。

我们可以将 Flux 看作是一个单向管道，Action 是管道的输入，Store 是管道的中转站，而 View 则是输出。当用户和应用交互时，View 将 Action 发送到 Dispatcher ，然后 Dispatcher 将 Action 分发给对应的 Store， Store 将修改后的 State 数据发送给 View。

总之，Flux 的核心思想是单向数据流动，通过“Action”、“Dispatcher”、“Store”、“View”这四个角色的协同工作可以实现应用中状态的变化，从而实现清晰、可维护的应用开发。