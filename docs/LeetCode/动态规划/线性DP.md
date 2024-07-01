# 方法论

入参的合法性可以帮助分类讨论。

当 $i$ 表示以 $i$ 为结尾的位置时，考虑 $nums[i]$ 应该接到哪一个的后面。

# 题目

## 53. 最大子数组和

思考：

状态定义：$dp[i]$ 表示以 $i$ 结尾的最大子数组和。

状态转移：
- $dp[i-1] <0$ ，$dp[i] = nums[i]$。
- $dp[i-1]\geq 0$，$dp[i]=dp[i - 1]+nums[i]$。

## LC 97. 交错字符串

描述：
```LaTeX
给定三个字符串 s1、s2、s3，请你帮忙验证 s3 是否是由 s1 和 s2 交错 组成的。

两个字符串 s 和 t 交错 的定义与过程如下，其中每个字符串都会被分割成若干 非空 子字符串：

s = s1 + s2 + ... + sn
t = t1 + t2 + ... + tm
|n - m| <= 1
交错 是 s1 + t1 + s2 + t2 + s3 + t3 + ... 或者 t1 + s1 + t2 + s2 + t3 + s3 + ...
注意：a + b 意味着字符串 a 和 b 连接。
```

思考：
```latex
s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"

  0 d b b c a
0 T F F F F F
a T 
a T T T
b   T T
c     T T T T
c           T
```

类比路径问题，每次只能向下或者向右走。条件 $|n-m|\leq 1$ 相当于交替截取，在路径问题中是一定满足的。

代码：
```Java
class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        //寻找路径的问题
        int m = s1.length();
        int n = s2.length();
        if (s3.length() != m + n) return false;
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;
        for (int i = 1; i <= m && s1.charAt(i - 1) == s3.charAt(i - 1); i++) {
            //不相符直接终止
            dp[i][0] = true;
        }
        for (int j = 1; j <= n && s2.charAt(j - 1) == s3.charAt(j - 1); j++) {
            dp[0][j] = true;
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                dp[i][j] = 
                (dp[i - 1][j] && s3.charAt(i + j - 1) == s1.charAt(i - 1)) ||
                (dp[i][j - 1] && s3.charAt(i + j - 1) == s2.charAt(j - 1));
            }
        }
        return dp[m][n];
    }
}
```

## LC 115. 不同的子序列

描述：
```latex
给你两个字符串 s 和 t ，统计并返回在 s 的 子序列 中 t 出现的个数。

题目数据保证答案符合 32 位带符号整数范围。
```

思考：

状态定义：`t` $[0:j]$ 的子字符串在 `s` $[0:i]$ 的区间中作为序列存在的方案数。

边界条件：`null` 在 `null` 中出现的方案数是 1，`null` 在 `[null, 1,...]` 中出现的方案数都是 1。

代码：
```Java
class Solution {
    public int numDistinct(String s, String t) {
        s = " " + s;
        t = " " + t;
        char[] cs = s.toCharArray();
        char[] ct = t.toCharArray();
        int m = cs.length, n = ct.length;
        int[][] dp = new int[m][n];
        // 边界条件
        for (int i = 0; i < m; i++) {
            dp[i][0] = 1;
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (cs[i] == ct[j]) {
                    dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }
        return dp[m - 1][n - 1];
    }
}
```

## LC 152. 乘积最大子数组

描述：
```LaTeX
给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 32-位 整数。

子数组 是数组的连续子序列。

输入：nums = [2,3,-2,4]
输出：6
```

思考：

因为有负数存在，除了记录以 $i$ 为结尾的子数组乘积的最大值，还要记录以 $i$ 为结尾的子数组乘积的最小值。

状态转移：以 $i$ 为结尾，要么就接到 $i-1$ 的后面，要么就是 $nums[i]$。

代码：
```Java
class Solution {
    public int maxProduct(int[] nums) {
        int n = nums.length;
        int[] maxDp = new int[n];
        int[] minDp = new int[n];
        maxDp[0] = nums[0];
        minDp[0] = nums[0];
        int ans = nums[0];
        for (int i = 1; i < n; i++) {
            maxDp[i] = Math.max(maxDp[i - 1] * nums[i], Math.max(minDp[i - 1] * nums[i], nums[i]));
            minDp[i] = Math.min(maxDp[i - 1] * nums[i], Math.min(minDp[i - 1] * nums[i], nums[i]));
            ans = Math.max(ans, maxDp[i]);
        }
        return ans;
    }
}
```

## 面试题 17.24 最大子矩阵

描述：
```LaTeX
返回和最大的子矩阵的左上角和右下角的行号和列号
```

方法一：按列取前缀和，然后是一维最大子数组和问题
```
例如：
1 3 4
2 5 -6

0 0 0
1 3 4
3 8 -2

[3,8,-2]
```

代码：
```Java
class Solution {
    public int[] getMaxMatrix(int[][] matrix) {
        int n = matrix.length;
        int m = matrix[0].length;
        int[][] preSum = new int[n + 1][m];
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < m; j++) {
                preSum[i][j] =
                preSum[i - 1][j] + matrix[i - 1][j];
            }
        }
        int maxValue = matrix[0][0];
        int[] ans = new int[4];
        for (int top = 0; top < n; top++) {
            for (int bot = top; bot < n; bot++) {
                int[] temp = new int[m];
                for (int i = 0; i < m; i++) {
                    temp[i] = 
                    preSum[bot + 1][i] - preSum[top][i];
                }
                // int max = temp[0];
                int start = 0;
                // int[] dp = new int[m];
                int sum = temp[0];
                // dp[0] = temp[0];
                for (int i = 1; i < m; i++) {
                    //从哪里转移来的要记录一下
                    if (sum > 0) {
                        sum += temp[i];
                    } else {
                        sum = temp[i];
                        start = i;
                    }
                    if (sum > maxValue) {
                        //更新坐标
                        ans[0] = top;
                        ans[1] = start;
                        ans[2] = bot;
                        ans[3] = i;
                        maxValue = sum;
                    }
                }
            }
        }
        return ans;
    }
}
```

方法二：二维前缀和
```LaTeX
前缀和求最大子数组和，[0-right]的最小值实时更新

例如：
1 -2 3
0 1 -1 2
	   |
	   right
```

代码：
```Java
class Solution {
    public int[] getMaxMatrix(int[][] matrix) {
        // 二维前缀和
        int m = matrix.length;
        int n = matrix[0].length;
        int[][] preSum = new int[m + 1][n + 1];
        for (int i = 1; i < m + 1; i++) {
            for (int j = 1; j < n + 1; j++) {
                preSum[i][j] = preSum[i - 1][j] + preSum[i][j - 1] + 
                matrix[i - 1][j - 1] - preSum[i - 1][j - 1];
            }
        }
        int maxVal = Integer.MIN_VALUE;
        int[] ans = new int[4];
        for (int i = 0; i < m; i++) {
            for (int j = i + 1; j < m + 1; j++) {
                // 构造出子数组
                // 思考清楚
                int[] nums = new int[n + 1];
                for (int k = 0; k < n + 1; k++) {
                    nums[k] = preSum[j][k] - preSum[i][k];
                }
                // 计算 nums 的最大子数组和
                // 前缀和，实时维护 [0, k - 1] 的最小值
                int minVal = nums[0];
                int left = 0;
                for (int k = 1; k < n + 1; k++) {
                    if (nums[k] - minVal > maxVal) {
                        maxVal = nums[k] - minVal;
                        ans[0] = i;
                        ans[1] = left;
                        ans[2] = j - 1;
                        ans[3] = k - 1;
                    }
                    if (nums[k] < minVal) {
                        left = k;
                        minVal = nums[k];
                    }
                }
            }
        }
        return ans;
    }
}
```

## LC 198 打家劫舍

## LC 213 打家劫舍 II

思考：

状态定义：$dp[i]$ 遍历到 $i$ 这个位置能拿到的最大金钱数目，$dp[i]$ 是记录最大值的作用。

误区：

```latex
nums = [2,1,1,2]
dp = [2,2,3,4]
```

注意 $dp[1] \neq 1$，$dp[i]$ 记录的是到达这个位置可以拿到的最大的金钱数目。

## LC 338. 比特位计数

描述：
```LaTeX
给你一个整数 n ，对于 0 <= i <= n 中的每个 i ，计算其二进制表示中 1 的个数 ，返回一个长度为 n + 1 的数组 ans 作为答案。
```

思考：

二进制中奇数和偶数包含 1 个数的性质：
- 奇数 1 个数 = 前一个偶数中 1 个数 + 1
- 偶数 1 个数 = 偶数 / 2 的 1 个数，偶数的二进制均以 0 为最低位，右移一位偶数的 1 个数还是不变。

代码：
```Java
class Solution {
    public int[] countBits(int n) {
        if (n == 0) return new int[]{0};
        if (n == 1) return new int[]{0, 1};
        int[] ans = new int[n + 1];
        ans[1] = 1;
        for (int i = 2; i < n + 1; i++) {
            if (i % 2 == 0) {
                ans[i] = ans[i / 2];
            } else {
                ans[i] = ans[i - 1] + 1;
            }
        }
        return ans;
    }
}
```

## LC 467. 环绕字符串中唯一的子字符串（重点）

描述：
```LaTeX
定义字符串 base 为一个 "abcdefghijklmnopqrstuvwxyz" 无限环绕的字符串，所以 base 看起来是这样的：

"...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd....".
给你一个字符串 s ，请你统计并返回 s 中有多少 不同非空子串 也在 base 中出现。
```

思考：
```LaTeX
s = "zab"

以 i 为结尾，遍历的结果是
z
za a
zab ab b

去重的逻辑：记录每个字母为结尾的长度最大值即可。
```


代码：
```Java
class Solution {
    public int findSubstringInWraproundString(String s) {
        char[] cs = s.toCharArray();
        int n = cs.length;
        int[] dp = new int[26];
        dp[cs[0] - 'a'] = 1;
        int len = 1;
        for (int i = 1; i < n; i++) {
            if (cs[i] - 'a' == (cs[i - 1] - 'a' + 1) % 26) {
                len++;
            } else {
                len = 1;
            }
            dp[cs[i] - 'a'] = Math.max(dp[cs[i] - 'a'], len);
        }
        int ans = 0;
        for (int a : dp) {
            ans += a;
        }
        return ans;
    }
}
```

## LC 576. 出界的路径数

描述：
```LaTeX

```

## LC 639 解码方法 II

**描述**

```LaTeX
一条包含字母 A-Z 的消息通过以下的方式进行了 编码 ：

'A' -> "1"
'B' -> "2"
...
'Z' -> "26"
要 解码 一条已编码的消息，所有的数字都必须分组，然后按原来的编码方案反向映射回字母（可能存在多种方式）。例如，"11106" 可以映射为：

"AAJF" 对应分组 (1 1 10 6)
"KJF" 对应分组 (11 10 6)
注意，像 (1 11 06) 这样的分组是无效的，因为 "06" 不可以映射为 'F' ，因为 "6" 与 "06" 不同。

除了 上面描述的数字字母映射方案，编码消息中可能包含 '*' 字符，可以表示从 '1' 到 '9' 的任一数字（不包括 '0'）。例如，编码字符串 "1*" 可以表示 "11"、"12"、"13"、"14"、"15"、"16"、"17"、"18" 或 "19" 中的任意一条消息。对 "1*" 进行解码，相当于解码该字符串可以表示的任何编码消息。

给你一个字符串 s ，由数字和 '*' 字符组成，返回 解码 该字符串的方法 数目 。

由于答案数目可能非常大，返回 1e9 + 7 的 模 。
```

**思考**

子函数的入参合法性可以帮助分类讨论。

**代码**

```Java
class Solution {
	final int MOD = (int) (1e9 + 7);
    public int numDecodings(String s) {
        if (s.length() == 1) {
            if (s.equals("0")) return 0;
            else if (s.equals("*")) return 9;
            return 1;
        }
        s = " " + s;
        char[] cs = s.toCharArray();
        int len = cs.length;
        long[] dp = new long[len];
        dp[0] = 1;
        if (cs[1] == '0') return 0;
        else if (cs[1] == '*') dp[1] = 9;
        else dp[1] = 1;
        for (int i = 2; i < len; i++) {
            if (cs[i] == '0') {
                if (cs[i - 1] == '*') {
                    dp[i] = dp[i - 2] * 2; // 10, 20
                } else {
                    int a = getNum(cs[i - 1], cs[i]);
                    if (a == 10 || a == 20) {
                        dp[i] = dp[i - 2];
                    }
                }
            } else if (cs[i] == '*') {
                dp[i] = dp[i - 1] * 9;
                if (cs[i - 1] == '*') { // * 1 - 9
                    dp[i] += dp[i - 2] * 15;
                } else {
                    for (int num = 1; num <= 9; num++) {
                        int b = getNum(cs[i - 1], (char) ('0' + num));
                        if (b >= 10 && b <= 26) {
                            dp[i] += dp[i - 2];
                        }
                    }
                }
            } else {
                dp[i] = dp[i - 1];
                if (cs[i - 1] == '*') {
                    for (int num = 1; num <= 2; num++) {
                        int a =  getNum((char) ('0' + num), cs[i]);
                        if (a >= 10 && a <= 26) {
                            dp[i] += dp[i - 2];
                        }
                    }
                } else {
                    int a = getNum(cs[i - 1], cs[i]);
                    if (a >= 10 && a <= 26) {
                        dp[i] += dp[i - 2];
                    }
                }
            }
            dp[i] %= MOD;
        }
        return (int) dp[len - 1];
    }

    private int getNum (char a, char b) {
        // 从入参的合法性可以帮助讨论
        // a != 0, a != *, b != *
        if (a == '0') return -1;
        return Integer.parseInt(new StringBuilder().append(a).append(b).toString());
    }
}
```


## LC 650. 只有两个键的键盘

描述：
```LaTeX
最初记事本上只有一个字符 'A' 。你每次可以对这个记事本进行两种操作：

Copy All（复制全部）：复制这个记事本中的所有字符（不允许仅复制部分字符）。
Paste（粘贴）：粘贴 上一次 复制的字符。
给你一个数字 n ，你需要使用最少的操作次数，在记事本上输出 恰好 n 个 'A' 。返回能够打印出 n 个 'A' 的最少操作次数。
```

思考：

DFS，入参的字符个数 `cur` 一定是变大的，否则会 StackOverFlow。

递归的子节点两种情况：
- 粘贴。
- 复制了当前的字符串再粘贴。

代码：
```Java
private int dfs(int cur, int prev, int times) {
	String key = cur + "_" + prev + "_" + times;
	if (memo.containsKey(key)) {
		return memo.get(key);
	}
	if (cur > n) {
		memo.put(key, INF);
		return INF; 
	} 
	if (cur == n) {
		memo.put(key, times);
		return times;
	}
	if (times == 0) {
		return dfs(cur, cur, times + 1);
	} else {
		// 一定要保证 cur 的数量是变大的
		// 粘贴
		int a = dfs(cur + prev, prev, times + 1); 
		// 复制之后再粘贴
		int b = dfs(cur * 2, cur, times + 2);
		memo.put(key, Math.min(a, b));
		return Math.min(a, b);
	}
} 
```

**动态规划算法**

状态定义：$dp[i][j]$ 表示当前长度为 $i$，剪贴板的长度为 $j$ 的最小操作次数。

**代码**

```Java
class Solution {
    int n;
    final int INF = 0x3f3f3f3f;
    Map<String, Integer> memo = new HashMap<>();
    public int minSteps(int n) {
        this.n = n;
        // if (n == 1) return 0;
        // int res = dfs(1, 0, 0);
        // return res == INF ? -1 : res;
        return solveWithDP();
    }

    private int solveWithDP() {
        int[][] dp = new int[n + 1][n + 1];
        for (int i = 0; i <= n; i++) {
            Arrays.fill(dp[i], INF);
        }
        dp[1][0] = 0;
        dp[1][1] = 1;
        // 当前长度为 i，剪贴板的长度为 j 的最小操作次数
        for (int i = 2; i <= n; i++) {
            int min = INF;
            for (int j = 1; j <= i; j++) {
                if (i != j) {
                    dp[i][j] = dp[i - j][j] + 1;
                    min = Math.min(min, dp[i][j]);
                } else {
                    dp[i][j] = min + 1; // 只是复制操作
                }
            }
        }
        int ans = INF;
        for (int j = 0; j <= n; j++) {
            ans = Math.min(ans, dp[n][j]);
        }
        return ans;
    }

    private int dfs(int cur, int prev, int times) {
        String key = cur + "_" + prev + "_" + times;
        if (memo.containsKey(key)) {
            return memo.get(key);
        }
        if (cur > n) {
            memo.put(key, INF);
            return INF; 
        } 
        if (cur == n) {
            memo.put(key, times);
            return times;
        }
        if (times == 0) {
            return dfs(cur, cur, times + 1);
        } else {
            // 一定要保证 cur 的数量是变大的
            // 粘贴
            int a = dfs(cur + prev, prev, times + 1); 
            // 复制之后再粘贴
            int b = dfs(cur * 2, cur, times + 2);
            memo.put(key, Math.min(a, b));
            return Math.min(a, b);
        }
    }   
}
```



## 单串问题

### LIS（最长上升子序列）的问题（subsequence）

#### LeetCode 第 300 题 最长递增子序列的长度
#### LeetCode 第 675 题 最长递增子序列的个数。

 方法1：动态规划，时间复杂度 $\mathcal{O}(N^2)$。

定义、决策、状态转移

- $dp[i]$：以 i 为结尾的 LIS 的长度。
- 决策：$arr[i]$ 是否能接到前面任意一个 LIS 的后面（状态转移）。

==初始化==

- dp[i]都是1。

LIS的个数

- $count[i]$: 以 i 为结尾的 LIS 的个数。

==初始化==

- $count[i]$ 同样都是1，这个初始化和长度是一样的。

决策和状态转移

- $count[i]$ 是根据 $dp[i]$ 来转移的

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220707111239887.png" alt="image-20220707111239887" style="zoom:50%;" />

$$
\begin{equation}
dp[i]=max\{dp[i], dp[k] + 1\}
\end{equation}
$$
如果 $arr[i]$ 确定可以接在 $arr[k]$ 的后面，LIS 的长度可能不是最长的，有3种情况：

- 如果 $\mathrm{dp}[k]+1>\mathrm{dp}[i]$，说明 $arr[i]$ 要接到 $arr[k]$ 的后面，$count[i]=count[k]$。

- 如果 $dp[k]+1=dp[i]$，说明 $arr[i]$ 接到之前某个数的后面和 $arr[i]$ 接到 $arr[k]$ 的后面长度相同，$count[i]=count[i]+count[k]$。
- 如果 $dp[k]+1<dp[i]$，$dp[i]$ 不变，$count[i]$ 也不会变。

最后还要遍历一遍$max\big\{dp[i]\big\}$才能得出最后的个数，LIS的结尾可能不止一个。



 方法2：贪心 + 二分查找（时间复杂度 $\mathcal{O}(N\log{N})$)

维护一个和 $arr$ 相同长度的数组 $res$，$res$ 数组是严格递增的。

每一次的贪心就是要==让整个 $res$ 上升得最慢，这样后面的数才越有可能添加到 $res$ 的后面==。

eg. 10太大了，要被9替换；然后9被2替换……

- 如果$arr[i]$比整个$res$都大，$arr[i]$接到$res$后面。
- 否则，让 $arr[i]$ 覆盖第一个比$arr[i]$大的数。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220707103716565.png" alt="image-20220707103716565" style="zoom:50%;" />

#### LeetCode第354题 俄罗斯套娃信封问题

eg. $[5,4]\ [6,8]\ [6,10]\ [2,3] \rightarrow[2,3]\ [5,4]\ [6,10]\ [6,8]$

==第一个维度升序排序，如果相同，第二个维度降序排序，然后对第二个维度求LIS的长度==。

如果第一个维度相同（6），第二个维度不可能接到第一个维度相同的数组后面（8不可能接到10的后面，如果是8，10，那10就有可能接到8的后面）。



排序算法的说明

1. 没有泛型的话，o1，o2默认就是Object类。
2. Comparator接口里要实现compare方法。

```java
Arrays.sort(nums, new Comparator<int[]>() {
	public int compare(int[] o1, int[] o2) {
		if (o1[0] == o2[0]) {
			return o2[1] - o1[1];
		}
		return o1[0] - o2[0];
	}
});
// Lambda写法
// 这里会直接识别泛型
Arrays.sort(nums, (o1, o2) -> {
    if (o1[0] == o2[0]) {
        return o2[1] - o1[1];
    }
    return o1[0] - o2[0];
});

Arrays.sort((o1, o2) -> {
	Integer.compare(o1[0], o2[0]);
})
```

### 最大子数组和(subarray)

注意点：==dp[i]以i为结尾的定义可以直接初始化==

#### LeetCode 第53题 最大子数组和

加上 sentinel 可以统一逻辑，数组里面取最大值要初始化为 `Integer.MIN_VALUE`。

状态定义
- $dp[i]$：以$i$为结尾的连续子数组的最大和，初始化$dp[i]$就是$arr[i]$。
决策和状态转移
- $dp[i-1]>0$，$arr[i]$ 就接到 $arr[i-1]$ 的后面。
- $dp[i-1]\leq0$，$arr[i]$ 就自己成为一个最大自序和。

#### LeetCode第152题 乘积最大子数组

需要两个状态，这里是可以直接初始化的。

- 最大子数组乘积$maxDp[i]$。
- 最小子数组乘积$minDp[i]$。
- $maxDp[i]$和$minDp[i]$初始化都为$arr[i]$。

#### LeetCode 第918题 环形子数组的最大和

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220707152543766.png" alt="image-20220707152543766" style="zoom:50%;" />

同时计算$maxSum$和$minSum$就可以。

但是要注意特殊情况，如果 $arr[i]$ 全部为负数，${\rm{max}}\big\{\underbrace{maxSum}_{<0},\ \underbrace{sum-minSum}_{0}\}=0$，

==这种情况就相当于数组里面没有一个值==，结果是$0$，但是结果是$maxSum$。

#### LeetCode面试题17.24 最大子矩阵和

在纵向维度上求前缀，然后遍历，然后在得到的子数组上求最大子数组和，==在横向维度上不求前缀和==。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220708085326275.png" alt="image-20220708085326275" style="zoom:50%;" />

代码的注意事项：

- 搞清楚遍历矩阵的索引是前缀和矩阵上的还是原始矩阵上的，$[i,\ j]$ 的==区间和==在前缀和矩阵上是 $preSum[j+1]-preSum[i]$。
- 最大子数组和如果从$0$开始遍历的逻辑如下，$sum$ 就是 $dp[i]$，以 i 为结尾的最大子数组的和。此时$ans$要初始化为 Integer_MIN_VALUE;

初始化的重要理解：

- $ans$ 记录的是 $sum$，但是记录的是从 $[0,\ nums.length-1]$ 计算的 $sum$，第一个初始化的 $sum$ 相当于是一个==无效状态==，$ans$ 也要初始化为==无效状态==。
- 如果从1开始遍历，$ans$要记录$dp[0]$，相当于$ans$初始化为$sum$。

```java
public int maxSubArray(int[] nums) {
    int len = nums.length;
    int sum = 0;
    //这里ans要初始化为Integer.MIN_VALUE;
    //不能初始化为sum,
    int ans = Integer.MIN_VALUE;
    for (int i = 0; i < len; i++) {
        if (sum < 0) {
            sum = nums[i];
        } else {
            sum += nums[i];
        }
        ans = Math.max(ans, sum);
    }
    return ans;
}

public int maxSubArray(int[] nums) {
    int len = nums.length;
    int sum = nums[0];
    //这里就是一个有效状态，所以ans要初始化为sum
    int ans = sum;
    for (int i = 1; i < len; i++) {
        if (sum < 0) {
            sum = nums[i];
        } else {
            sum += nums[i];
        }
        ans = Math.max(ans, sum);
    }
    return ans;
}
```



```java
public int[] getMaxMatrix(int[][] matrix) {
    int n = matrix.length;
    int m = matrix[0].length;
    int[][] preSum = new int[n + 1][m];
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < m; j++) {
            preSum[i][j] = 
                preSum[i - 1][j] + matrix[i - 1][j];
        }
    }
    int maxValue = matrix[0][0];
    int[] ans = new int[4];
    for (int top = 0; top < n; top++) {
        for (int bot = top; bot < n; bot++) {
            int[] temp = new int[m];
            for (int i = 0; i < m; i++) {
                temp[i] = 
                    preSum[bot + 1][i] - preSum[top][i];
            }
            int start = 0;
            int sum = temp[0];
            for (int i = 1; i < m; i++) {
                //从哪里转移来的要记录一下
                if (sum > 0) {
                    sum += temp[i];
                } else {
                    sum = temp[i];
                    start = i;
                }
                if (sum > maxValue) {
                    //更新坐标
                    ans[0] = top;
                    ans[1] = start;
                    ans[2] = bot;
                    ans[3] = i;
                    maxValue = sum;
                }
            }
        }
    }
    return ans;
}
```

#### LeetCode第363题 矩形区域不超过K的最大数值和

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220708093442457.png" alt="image-20220708093442457" style="zoom:50%;" />

这里不是求最大子数组和，这里是求$\leq K$的最大子数组和，是求$preSum[i+1]-preSum[j]\leq K$的$preSum[i+1]-preSum[j]$最大值。

这里要得到二维前缀和，==遍历二维前缀和得到的就是原矩阵某几行的一维前缀和==。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220708095151644.png" alt="image-20220708095151644" style="zoom:50%;" />



$preSum[i+1]+K\leq preSum[j]$

这里可以用==TreeSet.ceiling()==的方法

```java
class Solution {
    public int maxSumSubmatrix(int[][] mat, int k) {
        int m = mat.length, n = mat[0].length;

        // 预处理前缀和
        int[][] sum = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                sum[i][j] = sum[i - 1][j] + sum[i][j - 1] - sum[i - 1][j - 1] + mat[i - 1][j - 1];
            }
        }

        int ans = Integer.MIN_VALUE;
        // 遍历子矩阵的上边界
        for (int top = 1; top <= m; top++) {
            // 遍历子矩阵的下边界
            for (int bot = top; bot <= m; bot++) {
                // 使用「有序集合」维护所有遍历到的右边界
                TreeSet<Integer> ts = new TreeSet<>();
                ts.add(0);
                // 遍历子矩阵的右边界
                for (int r = 1; r <= n; r++) {
                    // 通过前缀和计算 right
                    int right = sum[bot][r] - sum[top - 1][r];
                    // 通过二分找 left
                    Integer left = ts.ceiling(right - k);
                    if (left != null) {
                        int cur = right - left;
                        ans = Math.max(ans, cur);
                    }
                    // 将遍历过的 right 加到有序集合
                    ts.add(right);
                }
            }
        }
        return ans;
    }
}
```

### 打家劫舍系列（间隔一个拿一个）

#### LeetCode第198题 打家劫舍1

#### LeetCode第213题 打家劫舍2

环形数组分成2段，因为首尾不能同时选择。

状态定义：

- $dp[i]$：到第$i$间房子能偷到的最大金钱数目

状态转移：这里的状态转移可以体现决策

- $dp[i]=max\bigg\{dp[i-1],\ dp[i-2]+nums[i]\bigg\}$

这里就要求数组的初始数目必须$\ge2$，初始就需要==两个哨兵==。

注意点：

- ==直接给数组索引赋值的就默认了数组最少的长度==
- eg. $dp[1]=1$这里就是默认数组$dp$的长度$\ge2$。

```java
class Solution {
    public int rob(int[] nums) {
        int len = nums.length;
        if (len == 1) {
            return nums[0];
        }
        if (len == 2) {
            return Math.max(nums[0], nums[1]);
        }
        return Math.max(section(nums, 0, len - 2), section(nums, 1, len - 1));

    }

    public int section(int[] nums, int left, int right) {
        //这里其实并不需要重构数组，可以直接根据nums来动态规划
        int[] t = new int[nums.length];
        for (int i = 1; i < t.length; i++) {
            t[i] = nums[left + i - 1];
        }
        int len = t.length;
        int[] dp = new int[len];
        dp[1] = t[1];
        for (int i = 2; i < len; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + t[i]);
        }
        return dp[len - 1];
    }
    
    
    public int section2(int[] nums; int left; int right) {
        //dp的索引直接和left和right对应起来就可以
        int[] dp = new int[nums.length];
        //初始化前面两个sentinel
        //这样写的话默认就传进来的两个数。
        //所以原来的nums长度至少要为3。
        dp[left] = nums[left];
        dp[left + 1] = Math.max(nums[left], nums[left + 1]);
        for (int i = left + 2; i <= right; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        return dp[right];
    }
}
```

#### LeetCode第740题 删除与获得点数（数字当作索引记录下来）

eg. $[2,3,2,4,3,5,8]$，拿到了$3$，数组中的$2$和$4$都要删除。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220709101155704.png" alt="image-20220709101155704" style="zoom:50%;" />

在数组中直接删除数字不方便操作，但是将数字记录为==索引和索引个数==就可以类比为打家劫舍。

#### LeetCode第1388题 3n块披萨

打家劫舍2没有个数限制，但是本题有个数的限制。

环形打家劫舍：打家劫舍2，==首尾不能同时选择，分成两段处理，但是还需要加上选择个数$n$的限制==。

状态定义：在分析的时候要时刻注意状态定义。

- $dp[i][j]$：到达第$i$个位置时，手上有$j$个披萨的最大值。

==这个$i$是到达$i$位置，不是选择第$i$个披萨，选不选择第$i$个披萨是决策，初始化时要注意==。

决策和状态转移：

$$
dp[i][j]=max\{dp[i-1][j],\ dp[i-2][j-1]+slices[i]\}
$$



<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220709102713089.png" alt="image-20220709102713089" style="zoom:50%;" />

==$j=1$的列不是$[4,1,2,5,8,3,1,9]$==，除了$dp[0][1]$和$dp[1][1]$，其余的值都是根据状态转移方程算出来的。

### 单串问题，$dp[i][j]$，$i$是位置，$j$也是位置

#### LeetCode第873题 最长斐波那契子序列的长度

思考过程

$[1,3,7,11,12,14,18]$，$14$能接到$11$的后面，那么这个序列的倒数第$2$个元素一定是$3$。

直接写成2维数组就一目了然了。

状态定义：

- $dp[i][j]$，以$arr[i]$和$arr[j]$为结尾的最长斐波那契子序列的长度。

决策和状态转移：

- $arr[j]$能否接到$arr[i]$的后面，看是否有$arr[k]=arr[j]-arr[i]$，其中$k<i$。用$HashMap$就可以。

<img src="https://img2023.cnblogs.com/blog/3118374/202403/3118374-20240330201234507-1011432066.png" alt="image-20220709143453382" style="zoom:50%;" />

#### LeetCode第1027题 最长等差数列的长度（整数数组nums中关于重复元素的思考）

第一种方法：

eg. $[1,0,1,0,1,1]$。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220709150119751.png" alt="image-20220709150119751" style="zoom:50%;" />

$arr[k]=arr[i]-(arr[j]-arr[i])$。

为什么nums中有重复元素不要紧？

==$map$中记录的是以$i$为结尾的序列，距离$i$最近的，倒数第二个元素的值，$map$中所有的索引值都比$i$小。==

==将$arr[j]$添加到$arr[k,i]$序列的后面。==

eg. $i=4$，$map$中的1是索引值为$2$的$1$，而不是索引值为$0$的$1$。

索引值$=0$的$1$作为倒数第二个元素已经在$i\leq 2$时考虑过了。



```java
public int longestArithSeqLength(int[] nums) {
    int len = nums.length;
    int[][] dp = new int[len][len];
    HashMap<Integer, Integer> map = new HashMap();
    for (int i = 0; i < len; i++) {
        dp[i][i] = 1;
        for (int j = i + 1; j < len; j++) {
            dp[i][j] = 2;
        }
    }
    map.put(nums[0], 0);
    int ans = 2;
    for (int i = 1; i < len; i++) {
        for (int j = i + 1; j < len; j++) {
            int target = nums[i] - (nums[j] - nums[i]);
            //map里的索引全部都是< i的
            if (map.containsKey(target)) {
                int idx = map.get(target);
                dp[i][j] = dp[idx][i] + 1;
                if (dp[i][j] > ans) {
                    ans = dp[i][j];
                }
            }
        }
        map.put(nums[i], i);
    }
    return ans;
}
```

第二种方法：

状态定义：

- $dp[i][j]$以$i$为结尾的，公差为$j(j+500)$的最长等差数列的长度。

==最重要的初始化阶段，为什么定义为以$i$为结尾的……就可以直接初始化？==

eg. $[9,4,7,2,10]$。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220709154050740.png" alt="image-20220709154050740" style="zoom:50%;" />

$7$可以接到$9$的后面，$7$也也可以接到$[9,4]$的后面，==$7$也可以接到$4$的后面==。

$7$接到$4$的后面，长度：$1(\text{初始化的})+1=2$，而不是$0+1=1$。

==$[9,4,7,2,10]$任意一个数都是一个子序列，后面的数都可以接到前面任意一个数的后面，任意一个数的$dp[i]$都要初始化为$1$。==

```java
public int longestArithSeqLength(int[] nums) {
    int len = nums.length;
    int[][] dp = new int[len][1001];
    //这里全部都要填为1
    //全部为0，最后ans + 1也可以
    //以i为结尾
    for (int i = 0; i < len; i++) {
        Arrays.fill(dp[i], 1);
    }
    int ans = 1;
    for (int i = 1; i < len; i++) {
        //i是结尾
        for (int j = 0; j < i; j++) {
            int diff = nums[i] - nums[j] + 500;
            dp[i][diff] = Math.max(dp[i][diff], dp[j][diff] + 1);
            if (dp[i][diff] > ans) {
                ans = dp[i][diff];
            }
        }
    }
    return ans;
}
```

#### LeetCode第1055题 形成字符串的最短路径

这里的二维$dp$数组是字符串的查询跳表。

定义：

- 以$i$为起点（包括$i$）各个字母第一次出现的位置。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220710104547856.png" alt="image-20220710104547856" style="zoom:50%;" />

为什么跳表要空最后一行？因为这一次退出的索引为$2$，下一次的查找起点是$3$。

跳表建立完成后的代码逻辑

- 遍历每个target数组的元素，找到==以当前索引为起点的该字母第一次出现的索引位置，如果越界的话那就拿到从$0$开始的第一次出现的位置==$p$，同时$ans + 1$，下一次的起点就是$p+1$。

```java
//index是source的索引位置，就是每一次查找的起点。
int index = 0;
int ans = 1;
for (int i = 0; i < target.length(), i++) {
	int j = target.charAt(i) - 'a';
	//从0开始source中没有这个字母
	if (dp[0][j] == len) return -1;
	int p = dp[index][j];
	if (p == len) {
		//从头开始找
		p = dp[0][j];
		ans++;
	}
	//下一次的查找起点都是p+1
	index = p + 1;
}
```

#### LeetCode第368题 最大整除子集

问题的本质也是子序列的拼接问题

首先数组先从小到达排列，比如说$8\%4=0$，那么$[1,2,4]$中的元素$8$都可以整除。那么$8$可以直接拼接到$[1,2,4]$的后面。本题还要记录状态是从哪里转移过来的。



### 单串问题：其它$dp[i]$问题

#### LeetCode第32题 最长有效括号

状态定义：

- $dp[i]$：以$i$为结尾的最长有效括号的长度。

思考过程：

- $i$是‘)’才能发生状态转移。
- $i-1$是‘(’，$i$是‘)’，$dp[i]=dp[i-2]+2$。
- $i-1$是‘)’，$i$是‘)’，==如果$dp[i-1]=0$，拼接的$dp[i]$一定也为$0$==。
- $dp[i-1]$不为$0$，要看$arr[i-dp[i-1]-1]$（索引不能越界）的位置是否为’(‘，否则$dp[i]$为无效状态$0$。
- 如果满足条件，$dp[i]=dp[i-dp[i-1]-2]+dp[i-1]+2$（索引不能越界）。

#### LeetCode第413题 等差数列的划分（等差数列的子串，第1027题是等差数列的子序列）

状态定义：

- $dp[i]$以$i$为结尾的等差数列的个数，（长度至少要为3）。

初始化：

- $dp[i]$都是$0$，可能出现$dp[i]$为$0$的情况。

决策和状态转移：

- 如果$nums[i]-nums[i-1]=nums[i-1]-nums[i-2]$，状态就有效了
- $dp[i]=dp[i-1]+1$（个数和长度是一样的关系，eg. $[0,2,4]\rightarrow[2,4,6],\ [0,2,4,6]$）。
- 然后将$dp[i]$相加就可以得到结果。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220710144415827.png" alt="image-20220710144415827" style="zoom:50%;" />

$dp[i-1]=0$其实并不影响状态转移。

#### 子串subarray的动态规划的总结：

- 在数组中是连续的，问题的规模是一个一个添加的。
- ==$i$能够拼接到$i-1$的后面并发生状态转移，$i$的状态和$i-1$的状态关系非常非常大==。



#### LeetCode第91题 解码方法

状态定义：

- $dp[i]$：以$i$为结尾的数字解码方法的==种类==

思考过程：

- $arr[i]$作为==单独一个数字==拼接到$arr[i-1]$的后面，种类就是$dp[i]=dp[i-1]$。
- $arr[i]$和$arr[i-1]$作为一个$10\leq num\leq26$的数字拼接到$arr[i-2]$的后面，种类就是$dp[i]=dp[i]+dp[i-2]$。

初始化：

- 要考虑$arr[0]=0$和==$arr[1]=0$==的特殊情况。

总结：关于$dp$定义为种类的思考

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220711130343224.png" alt="image-20220711130343224" style="zoom:50%;" />

这里$[1,1,1]$有$3$种，$2$拼接过来以$i$为结尾的种类不是相加，而是$dp[i]=dp[i-1]$。

#### LeetCode第132题 分割回文串II

思考过程：

- 首先二位数组记录任意==区间==是否是回文串。
- 记录完成后，如何思考这个问题呢？

重要！！！

- 分割的逻辑和拼接的逻辑是一样的，所谓==拼接就是子问题规模的扩大==。

将原字符串分割成$[0-j]$和$[j+1,i]$的两段和将$[j+1,i]$拼接到$[0-j]$的后面是一样的。

状态定义：

- $dp[i]$：以$i$为结尾的$[0-i]$的字符串分割成回文串的最小分割次数。

状态转移：

- 如果$[j+1,i]$是回文串，$dp[i]=dp[j]+1$，这里就是子问题的拼接。

#### LeetCode第583题 两个字符串的删除操作

其实将二维$dp$数组写出来就可以想出来。

状态定义：

- $dp[i][j]$：使以$i$为结尾的子字符串$nums1[i]$和以$j$为结尾的子字符串$nums2[j]$相同的最小删除次数。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220711153911033.png" alt="image-20220711153911033" style="zoom:50%;" />

#### LeetCode第801题 使序列递增的最小交换次数

状态定义：

- 以$i$为结尾的$[0-i]$的子串递增的最小交换次数，其中$0$代表不换，$1$代表换。

这里状态转移难以通过决策来体现，那就把==各个决策后的状态记录一下，也就是说决策成为一个数组的维度==（股票买卖系列）。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220711155147073.png" alt="image-20220711155147073" style="zoom:50%;" />

状态转移：

- $nums1[i]>nums1[i-1]$且$nums1[i]>nums2[i-1]$且$nums2[i]>nums2[i-1]$且$nums2[i]>nums1[i-1]$，$i-1$换不换，$i$都可换可不换。
- $nums1[i]\leq nums1[i-1]$或$nums2[i]\leq nums1[i-1]$，$i-1$换，$i$不能换；$i-1$不换，$i$必须换。
- 第三种情况就是$i-1$换，$i$换；$i-1$不换，$i$不换。

#### LeetCode第871题 最低加油次数

状态定义的思考过程：

- $i$这个维度就是$stations$（就是拼接，子问题的规模逐渐扩大），j这个维度，反映决策，到达$i$后加不加油，将每一个决策后的状态都记录下来。
- $dp[i][j]$：到达第$i$个加油站时加第$j$次油的能跑的最大距离。

==这里的状态可能无法转移，$dp[i-1][j-1]$和$dp[i-1][j]$无法到达$stations[i]$==。

这里犯了错误，如果$dp[i-1][j-1]$和$dp[i-1][j]$都无法到达$stations[i]$，==不是直接返回到不了终点==，

$dp[i][j]=dp[i-1][j]$，也可以记录为无效状态$0$。如果是$dp[i][j]=dp[i-1][j]$，那就和第一列是一样的逻辑，只是记录一个理论值。

#### 关于如何确定状态定义

$dp[i]$：以$i$为结尾的$[0-i]$的字符串分割成回文串的最小分割次数，这里的$dp[i]$可以从前面的$dp[j]$得到。

拼接，就是问题规模的扩大，$dp[i]$也定义为以$i$为结尾的……

这里分割和拼接是一样的。

==有的问题$i$就是拼接到$i-1$的后面，有的问题$i$拼接到$k(0\leq k < i)$的后面==。

### 单串问题：带维度的单串问题$dp[i][j][k]$之类的

#### 分组问题：在填表的时候$i$和$k$大小要注意，2个数分成3组是无效状态。

#### LeetCode第871题 最大平均值和的分组

状态定义：

- $dp[i][j]$：以$i$为结尾的$[0-i]$的数组分成$j$组的最大平均值和。

注意的要点：

- $preSum[i][j]$和$dp[i][j]$都是double型的数组，否则会出现精度的缺失。
- eg. $5/2=2$，int型的数组求平均值会有精度的缺失。

#### LeetCode第1478题 安排邮筒

这里的分组求的并不是最大平均值和，而是分组安排邮筒的最短路径。

#### LeetCode第410题 分割数组的最大值和

重难点：如何理解$m$个子数组各自和的最大值最小。

看图：这里反映的是整个$k$的搜索过程。

- 如果添加的数$\leq14$，最后的结果还是$14$。
- 如果添加的数$14<num\leq17$，相当于在$[17,num,num]$中选择最小值，是$num$。
- 如果添加的数$num>17$，最大的区间和取最小，结果是$num$。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220713153750144.png" alt="image-20220713153750144" style="zoom:50%;" />

```java
public int splitArray(int[] nums, int m) {
    int len = nums.length;
    int[] preSum = new int[len + 1];
    int[][] dp = new int[len + 1][m + 1];
    for (int i = 1; i <= len; i++) {
        preSum[i] = preSum[i - 1] + nums[i - 1];
    }
    for (int i = 1; i <= len; i++) {
        Arrays.fill(dp[i], preSum[i]);
        dp[i][0] = 0;
    }
    for (int i = 2; i <= len; i++) {
        for (int j = 2; j <= m; j++) {
            for (int k = 0; k < i; k++) {
                dp[i][j] = Math.min(dp[i][j], Math.max(dp[k][j - 1], preSum[i] - preSum[k]));
            }
        }
    }
    return dp[len][m];
}
```

#### LeetCode第1230题 投掷硬币

就是一个“完全背包”问题。

#### LeetCode第256题 粉刷房子I

#### LeetCode第265题 粉刷房子II

注意点就是：在更新最小值和倒数第二小值时，==如果最小值要更新，首先将最小值赋给倒数第二小的值，然后再更新最小值==，如果反过来倒数第二小值就等于最小值了。

#### LeetCode1473题 粉刷房子III

状态定义：

- $dp[i][j][k]$：以$i$为结尾的房子粉刷成$j$颜色，同时$[0,i]$的房子分成$k$组的==最小成本==。

状态转移：

- 如果位置$i$的房子有$color$颜色了，那么$dp[i][j][k]$直接从前面的$i-1$处继承，==同时$j\neq color$的位置状态都是无效的$INF=0x3f3f3f3f$，不是初始化的$0$==。
- 如果位置$i$的房子没有颜色，那么$dp[i][j][k]$直接从前面的$i-1$处计算，然后加上位置$i$粉刷$j$颜色的成本。
- 这里我们要求的时最小值，无效状态不能是$0$。
- 还有分组的时候组数$>$数组个数的无效状态也要考虑。
- 在题目中，哨兵的状态是初始状态是$0$而不是无效的状态。

#### 初始化的无效状态和初始值

#### LeetCode第887题 鸡蛋掉落

状态定义：

- $dp[i][j]$：在$i$层楼有$j$个鸡蛋在最坏情况下确定$f$的最小操作次数。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220713163612494.png" alt="image-20220713163612494" style="zoom:50%;" />

 状态转移：

- 记住条件：$>f$鸡蛋会碎，$\leq f$鸡蛋不会碎。

- 假如$i$指向$6$，$k$指向$3$，如果鸡蛋碎了，$f\leq 2$；如果鸡蛋没碎，就在$[4-6]$楼去找，$3$就相当于地下室$0$。

```java
for (int k = 1; k <= i; k++) {
    dp[i][j] = Math.min(dp[i][j], Math.max(dp[k - 1][j - 1], dp[i - k][j]) + 1);
}
```

$S(k)=dp[k-1][j-1]-dp[i-k][j]$，上述问题相当于这个单增函数在$[1,i]$这个区间里面找到$0$或者是最接近$0$的位置。方法就是==二分查找==。

#### LeetCode第403题 青蛙过河

eg. $stones=[0,1,3,5,6,8,12,17]$。

状态定义：

- $i$代表位置，$j$代表跳到$i$的步长，把所有的状态都记录下来。

状态转移：

- 这里位置$j$每一步都是有==最长步长==的。
- 位置$i$的所有步长不一定都是有效状态，这里的横向步长是不需要遍历的。
- 比如到达$12$的步长可能为$4$，也可能为$6$等等，并不会得到$[0-7]$的所有步长的状态，有一部分是==无效状态==。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220713171959193.png" alt="image-20220713171959193" style="zoom:50%;" />

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220713171500858.png" alt="image-20220713171500858" style="zoom:50%;" />

```java
public boolean canCross(int[] stones) {
    int len = stones.length;
    boolean[][] dp = new boolean[len][len];
    dp[0][0] = true;
    for (int i = 1; i < len; i++) {
        for (int j = i - 1; j >= 0; j--) {
            int step = stones[i] - stones[j];
            //最大以i到达位置i
            //这里step > i可能越界，改成j + 1
            //其实这里的索引可能越界，还是要加上条件
            if (step > i) {
                break;
            }
            if (dp[j][step - 1] || dp[j][step] ||
                ((step + 1 <= len - 1) && dp[j][step + 1])) {
                dp[i][step] = true;
            }
            if (i == len - 1 && dp[i][step]) {
                return true;
            }
        }
    }
    return false;
}
```

## 双串问题

#### LeetCode第1143题 最长公共子序列

#### LeetCode第718题 最长公共子数组

问题要想清楚以$i$为结尾的子序列和以$i$为结尾的子数组有什么不一样

LCS问题中$dp[i][j]$表示为$[0, i]$的子问题，这里的$i$并不是真正的结尾。

最长公共子数组中$dp[i][j]$表示以$i$为结尾。

### 字符串匹配的问题

#### LeetCode第712题 两个字符串的最小ASCII删除和

#### LeetCode第72题 编辑距离

把二维数组写出来就很明确了。但是要注意，添加了sentinel，==遍历$dp$数组的时候注意原来的字符串的索引==。

<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/image-20220729143933774.png" alt="image-20220729143933774" style="zoom:50%;" />

第一个问题只有删除操作，第二题可以删除、插入和替换。

在结尾的删除和插入是一次操作，替换的操作将$dp[i-1][j-1]+2$变成了$dp[i-1][j-1]+1$。

$dp[i][j]$：以$i$和$j$为结尾的子数组，使它们相同的最小操作次数。

==这里$i$表示$[0, i]$的子问题，同时$i$也是子问题的结尾。==

#### LeetCode第44题 通配符匹配

‘?’可以匹配任意单个字符，没有空字符

‘*’可以匹配任意字符串，包括空字符串

==‘?’和‘*’和前面的字符都是没有关联的==。

首先是初始化的思路，在第一行，‘*’可以表示0个字符串，相当于可以把自己去掉。

```java
dp[0][0] = true;
for (int j = 1; j <= len2; j++) {
    if (s2[j - 1] == '*') {
        dp[0][j] = dp[0][j - 1];
    }
}
```

开始遍历的逻辑：

如果$s2[j]==s1[i]||s2[j]=='?'$，$dp[i][j] = dp[i-1][j-1]$。

如果 $s2[j]=='*'$，如果是空，$dp[i][j] = dp[i][j - 1]$；如果表示匹配任意字符串，$dp[i][j]=dp[i-1][j]$，相当把 $s1[i]$ 删除掉，也可以匹配上。

#### LeetCode第10题 正则表达式匹配

‘.’可以匹配任意单个字符，没有空字符

‘*’可以匹配==0个或多个==前面那一个字符

在这里‘*’要和前一个字符一起考虑。

初始化时，第一行要考虑前一个字符，‘*’带上前一个字符才是空。

```java
dp[0][0] = true;
for (int j = 1; j <= len2; j++) {
    if (p1[j - 1] == '*') {
        if (j == 1) {
            dp[0][j] = true;
        } else {
            dp[0][j] = dp[0][j - 2];
        }
    }
}
```

遍历的逻辑：

如果$s2[j]==s1[i]||s2[j]=='.'$，$dp[i][j] = dp[i-1][j-1]$。

如果$s2[j]=='*'$，要考虑‘*’前面带的是字母还是‘.’。

如果匹配上了，$a*$和$.*$是一样的逻辑。

$.*$表示的是0或者任意字符串。

$dp[i][j]$从$dp[i-1][j]$、$dp[i-1][j-2]$和$dp[i][j-2]$这3个状态转移而来。

$dp[i-1][j]$的状态最难思考

如果$dp[i-1][j]=true$，说明$s1[i-1]==s2[j-2]||s1[i-1]==s2[j-1]$。

$s1[i-1]==s2[j-2]$就是$dp[i-1][j-2]$。

如果$s1[i-1]==s2[j-1]$，这里的‘*’代表了重复$s1[i-1]$并且$s1[i]==s1[i-1]$。

如果匹配不上，$dp[i][j]=dp[i][j-2]$。这里$.*$代表的是任意字符串，关键就是要考虑$dp[i][j-1]$。

$dp[i][j-1]$可以划分为$dp[i-2][j-1]$或者$s1[i-1]==s2[j-1]$。
