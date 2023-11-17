# Prim算法

Prim算法是一种解决带权无向图最小生成树的经典算法。

众所周知，一个无向图的生成树是该图中一棵包含所有节点的树，而最小生成树就是所有生成树中边权和最小的一棵。Prim算法就是求出一个带权无向图的最小生成树的算法。

具体步骤如下：

1. 选定一个起点，将其加入到一个已选择结点集合中，然后初始化这个集合的值为起点；
2. 在集合之外的所有点中找到一条到集合内结点距离最短的边，加入集合；
3. 重复第2步，直到所有的点都被加入到集合中。

而我们常用的，是基于堆的优化Prim算法。Java代码实现如下：

```java
public static void prim(int[][] graph) {
    int n = graph.length;
    int[] dist = new int[n];
    int[] parent = new int[n]; 
    boolean[] visited = new boolean[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    Arrays.fill(visited, false);

    dist[0] = 0;
    parent[0] = -1;
    for (int i = 0; i < n - 1; i++) {
        int u = findMin(dist, visited);
        visited[u] = true;

        for (int v = 0; v < n; v++) {
            if (graph[u][v] != 0 && !visited[v] && graph[u][v] < dist[v]) {
                dist[v] = graph[u][v];
                parent[v] = u;
            }
        }
    }

    for (int i = 1; i < n; i++) {
        System.out.println(parent[i] + " - " + i + " : " + graph[i][parent[i]]);
    }
}

private static int findMin(int[] dist, boolean[] visited) {
    int minDist = Integer.MAX_VALUE;
    int minIndex = -1;
    for (int i = 0; i < dist.length; i++) {
        if (!visited[i] && dist[i] < minDist) {
            minDist = dist[i];
            minIndex = i;
        }
    }
    return minIndex;
}
```

一句话概括，Prim算法就是“贪心+堆优化”的选择最小生成树算法。这让我们更清晰的理解这个算法。