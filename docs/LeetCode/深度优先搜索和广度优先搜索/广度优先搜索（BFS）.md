# 方法论

::: tip BFS 队列中记录的参数和 vis 数组：
- BFS 的队列里记录的就是 DFS 的**可变参数**。
- BFS 搜索时需要 vis 数组来记录节点的访问状态（vis 数组可能是二维，注意 vis 数组的定义）。
:::

# 题目
## LeetCode 407. 接雨水 II

思考：问题的本质是求点 $(x,y)$ 到边界所 有**路径高度**最小值是多少，差值就是接到雨水的数量。

代码：
```Java
class Solution {
    // 注意这道题并不是比你小就可以流入的
    int[][] dirs = new int[][] {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
    public int trapRainWater(int[][] heightMap) {
        // 类比最短路的 Dijkstra 算法
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[2], b[2]));
        int m = heightMap.length;
        int n = heightMap[0].length;
        boolean[][] vis = new boolean[m][n];
        for (int i = 0; i < m; i++) {
            // 直接标记已经访问过了
            vis[i][0] = true;
            heap.offer(new int[]{i, 0, heightMap[i][0]});
            vis[i][n - 1] = true;
            heap.offer(new int[]{i, n - 1, heightMap[i][n - 1]});
        }
        for (int j = 1; j < n - 1; j++) {
            vis[0][j] = true;
            heap.offer(new int[]{0, j, heightMap[0][j]});
            vis[m - 1][j] = true;
            heap.offer(new int[]{m - 1, j, heightMap[m - 1][j]});
        }
        int ans = 0;
        while (!heap.isEmpty()) {
            int[] poll = heap.poll();
            int x = poll[0], y = poll[1], h = poll[2];
            for (int[] dir: dirs) {
                int nx = x + dir[0];
                int ny = y + dir[1];
                if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
                if (vis[nx][ny]) continue;
                // 一个节点比当前节点大的话，肯定装不了水，但是这个节点要入堆
                // 比当前节点小的都已经访问过了，
                if (heightMap[nx][ny] <= h) {
                    ans += h - heightMap[nx][ny];
                }
                vis[nx][ny] = true;
                heap.offer(new int[]{nx, ny, Math.max(heightMap[nx][ny], h)});
            }
        }
        return ans;
    }
}
```

通信的信道可以表示为通信的信道可以表示为通信的信道可以表示为通信的信道可以表示为通信的信道可以表示为 i 通信的信道可以表示为：$\mathbf{G}=\Sigma$