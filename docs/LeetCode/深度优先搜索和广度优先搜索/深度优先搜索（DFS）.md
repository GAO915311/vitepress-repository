# 方法论

## DFS 的入参变量

**深度优先搜索最重要的就是要考虑好传入的参数，切记**。

一切深度优先搜索（DFS）都可以抽象为树形结构
1. 搜索的是叶子节点，遇到了叶子节点就返回，函数的返回值是 boolean 类型。
2. 收集每一个根节点到叶子节点的路径结果。
3. 搜索整棵树。

用于记录搜索结果的容器一般是 `LinkedList` 和 `StringBuilder` 

常用方法：
- `insert(int offset, ...)`
- `delete(int start, int end)`
- `deleteCharAt(int index)`

可变参数可以直接确定树的递归深度，
本栈帧中枚举的结果，范围是什么？
DFS 时首先判断本栈帧内要干什么，递归的时候有多少条分支，递归下去的条件是什么。

## 可变参数 startIndex

从前到后，树中父节点中已经记录过的元素，子节点不能再访问了，需要可变参数 `startIndex` 控制当前节点遍历的起点。

例如：$\mathrm{C}_{n}^{k}$ 问题（组合，子集问题），切割问题。
组合问题是收集叶子节点，子集问题是收集所有节点，递归的树结构第一层就是 $\mathrm{C}_{n}^{1}$，第二层就是 $\mathrm{C}_{n}^{2}$，等等。

组合、子集问题：本栈帧中拿到一个 `[startIndex, n]` 之间的元素 `i`。下一个栈帧中，由于元素 `i`已经记录过了，需要从 `i + 1` 的下标开始遍历，即 `startIndex = i + 1` 。
切割问题：本栈帧中记录的是 `[startIndex, i]` 的一段元素。
![[../../figures/LeetCode/DFS.svg|500]]

## 树层去重

如果 `nums` 中存在重复元素，例如：`nums = [...,1,1,2,3...]`，`1(2) -> 2, 3` 和 `1(1) -> 2, 3` 的**组合和排列**的分支重复了，需要删除。
树层去重需要 `used[i]` 数组标记，去重的逻辑如下：`if (i > 0 && nums[i] == nums[i - 1] &&  !used[i - 1]) continue;`

## 子集问题的理解

输入的视角：`nums[startIndex]` 选还是不选。二叉树 $2^{n}$ 个节点，也可以类比为位图（bitMap）。

代码：
```java
private void subset(int[] nums, int startIndex, LinkedList<Integer> path) {
    // 二叉树，每个叶子节点就是一个子集的结果
    if (startIndex >= nums.length) {
        res.add(new LinkedList<>(path));
        return;
    }
    subset(nums, startIndex + 1, path);
    path.add(nums[startIndex]);
    subset(nums, startIndex + 1, path);
    path.removeLast();
}
```

答案的视角：选择哪一个数字
```java
private void backtracking(int[] nums, int startIndex) {
    res.add(new LinkedList<>(path));
    for (int i = startIndex; i < nums.length; i++) {
        path.add(nums[i]);
        backtracking(nums, i + 1);
        path.removeLast();
    }
}
```

子集问题中每一个节点可以被记录，也可以不被记录。
例如，[[#LC 301. 删除无效的括号（重点）]]，通过 `startIndex` 枚举出来的括号可以记录，也可以不记录。

## bitMap 的理解

bitMap 记录的是子集（$2^{n}$），但是 DFS 中记录的是排列的过程，例如，[[#LC 488. 祖玛游戏（重点）]]。

## 记忆化搜索

将 DFS 函数中的**可变参数**作为维度，存储的是返回值。只要本栈帧内有返回值就记录下来。
案例：[[#LC 403. 青蛙过河（重点）]]。

# 题目

## LC 17. 电话号码的字母组合

思考：
索引控制树的递归深度，拿到了一个字母后就递归下去。

代码：
```java
class Solution {
    private final String[] recString = {" ", " ", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    
    private LinkedList<String> res = new LinkedList<>();
    
    private StringBuffer path = new StringBuffer();

    public List<String> letterCombinations(String digits) {
        // 这里看条件，digits.length == 0 可以成立
        if (digits == null || digits.length() == 0) {
            return res;
        }
        backtracking(digits, 0);
        return res;
    }

    private void backtracking(String digits, int index) {
        if (path.length() == digits.length()) { // 递归到叶子节点下的空节点就返回
            res.add(path.toString());
            return;
        }
        String str = recString[digits.charAt(index) - '0'];
        for (int i = 0; i < str.length(); i++) {
            path.append(str.charAt(i));
            backtracking(digits, index + 1);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```

## LC 22. 括号生成（重点）

描述：
```latex
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```

思考：
`n` 是括号的对数，`(((...)))` 的**排列**问题。
排列问题，有序可以去重。

代码：
```java
class Solution {
    private StringBuffer path = new StringBuffer();
    private char[] rec;
    private List<String> ans = new LinkedList<>();

    public List<String> generateParenthesis(int n) {
        rec = new char[2 * n];
        for (int i = 0; i < n; i++) {
            rec[i] = '(';
            rec[i + n] = ')';
        }
        boolean[] used = new boolean[2 * n];
        dfs(n, used, 0);
        return ans;
    }

    private void dfs(int n, boolean[] used, int depth) {
        if (depth == 2 * n) { // 条件也可以改为 path.length() == rec.length();
            if (isValid(path)) {
                ans.add(new String(path));
            }
            return;
        }
        for (int i = 0; i < rec.length; i++) {
            if (i > 0 && rec[i] == rec[i - 1] && !used[i - 1]) { // 去重逻辑
                continue;
            }
            if (!used[i]) { // 本栈帧内的逻辑，选择一个字母，然后递归下去
                path.append(rec[i]);
                used[i] = true;
                dfs(n, used, depth + 1);
                path.deleteCharAt(path.length() - 1); // 回溯
                used[i] = false;
            }
        }
    }

    private boolean isValid(StringBuffer path) {
        int n = path.length();
        Deque<Character> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (path.charAt(i) == '(') {
                stack.push('(');
            } else {
                // 栈中可能没有 '('
                if (stack.isEmpty()) {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.isEmpty();
    }
}
```
## LC 37. 解数独

思考：本栈帧中找到第一个 `'.'` 的位置，遍历 1-9，如果合法的话就递归下去，查找的是一个合法的路径，叶子节点返回 true 就一路返回 true。函数的返回值是 `boolean` 类型。

代码：
```java
class Solution {
    public void solveSudoku(char[][] board) {
        dfs(board);
    }

    private boolean dfs(char[][] board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (int num = 1; num <= 9; num++) { // 本栈帧从 1 到 9 选择一个数字，如果合法
                        char k = (char) ('0' + num);
                        if (isValid(board, i, j, k)) {
                            board[i][j] = k;
                            if (dfs(board)) {
                                return true;
                            }
                            board[i][j] = '.';
                        }                        
                    }
                    return false; // 有可能[1 - 9]都不满足条件，本栈帧一个分支也没有
                }
            }
        }
        return true;
    }

    private boolean isValid(char[][] board, int row, int col, char val) {
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == val) {
                return false;
            }
        }
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == val) {
                return false;
            }
        }
        // 分块遍历
        // 找到本点所在小块的左上角的坐标
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;
        for (int i = startRow; i < startRow + 3; i++) {
            for (int j = startCol; j < startCol + 3; j++) {
                if (board[i][j] == val) {
                    return false;
                }
            }
        }
        return true;
    }
}
```
## LC 39. 组合总和

思考：
- 元素非负且无重复，但是元素是可以重复选择的，由 `startIndex` 来控制每一层栈帧的起始位置。
- 每一层栈帧可以选择很多数，选择一个数后，递归的分支只有一个。

代码：
```java
class Solution {
    private LinkedList<List<Integer>> res = new LinkedList<>();
    private LinkedList<Integer> path = new LinkedList<>();
    private int pathSum = 0;
    
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        int n = candidates.length;
        backtracking(candidates, target, 0);
        return res;
    }

    private void backtracking(int[] candidates, int target, int startIndex) {
        if (pathSum > target) { // 元素非负才可以这样写
            return;
        }
        if (pathSum == target) {
            res.add(new LinkedList(path));
            return;
        }
        for (int i = startIndex; i < candidates.length && pathSum + candidates[i] <= target; i++) {
            path.add(candidates[i]);
            pathSum += candidates[i];
            backtracking(candidates, target, i);
            path.removeLast();
            pathSum -= candidates[i];
        }
    }
}
```
## LC 40. 组合总和 II

思考：每个元素只能选择一个，可以去重。

代码：
```java
class Solution {
    private LinkedList<List<Integer>> res = new LinkedList<>();
    private LinkedList<Integer> path = new LinkedList<>();
    private int pathSum = 0;
    
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        backtracking(candidates, target, 0);
        return res;
    }

    private void backtracking(int[] candidates, int target, int startIndex) {
        if (pathSum > target) {
            return;
        }
        if (pathSum == target) {
            res.add(new LinkedList(path));
            return;
        }
        for (int i = startIndex; i < candidates.length && pathSum + candidates[i] <= target; i++) {
            if (i > startIndex && candidates[i] == candidates[i - 1]) {
                continue;
            }
            path.add(candidates[i]);
            pathSum += candidates[i];
            backtracking(candidates, target, i + 1);
            path.removeLast();
            pathSum -= candidates[i];
        }
    }
}
```

## LC 93. 复原 IP 地址（重点）

思考：组合问题，一个栈帧中枚举的是一个数字（字母），本题中枚举的是 `[startIndx, i]` 的一段数字。如果  `[startIndx, i]` 的数字合法，加 `'.'`，然后递归下去。return 的条件是加 `'.'` 的数目 `>= 3`。

代码：
```java
class Solution {
    private int count = 0;
    private StringBuffer s1 = new StringBuffer();
    private LinkedList<String> res = new LinkedList<>();

    public List<String> restoreIpAddresses(String s) {
        backtracking(new StringBuffer(s), 0);
        return res;
    }

    private void backtracking(StringBuffer s, int startIndex) {
        if (count == 3) {
            if (judgeValid(s, startIndex, s.length() - 1)) {
                res.add(s.toString());
            }
            return;
        }
        for (int i = startIndex; i < s.length(); i++) {
            if (judgeValid(s, startIndex, i)) {    
                s.insert(i + 1, ".");
                count++;
                backtracking(s, i + 2);
                count--;
                s.deleteCharAt(i + 1);
            }
        }
    }

    private boolean judgeValid(StringBuffer s, int i, int j) {
        if (i > j) return false;
        String s1 = s.substring(i, j + 1);
        if (s1.equals("0")) return true;
        if (s1.length() >= 2 && s1.charAt(0) == '0') return false;
        if (s1.length() >= 4) return false;
        // Integer 可能越界
        int a = Integer.parseInt(s1);
        return a <= 255;
    }
}
```

## LC 282. 给表达式添加运算符（重点）

描述：
```latex
给定一个仅包含数字 0-9 的字符串 num 和一个目标值整数 target ，在 num 的数字之间添加 二元 运算符（不是一元）+、- 或 * ，
返回 所有 能够得到 target 的表达式。
```

思考：

加法和减法可以统一为加法，比如，`1 - 2 = 1 + (-2)`。

乘法要直接算完然后再记录为 `prev`，比如 `1 - 2 * 2`，`prev = -2`，`x = (-2) * 2`, `cur = 1 - prev + x`，`prev = x`。

所有的计算过程中只保留加法（减法就是加负数），乘法要直接算出来，结果记作 `prev`。代码回溯的过程全部隐藏在参数传递中了，本次的计算结果和字符串的拼接。

代码：
```java
class Solution {
    int n, t;
    String s;
    List<String> ans;
    
    public List<String> addOperators(String num, int target) {
        n = num.length();
        t = target;
        s = num;
        ans = new ArrayList<>();
        if (n == 0) {
            return ans;
        }
        dfs(0, 0, 0, "");
        return ans;
    }

    void dfs(int u, long prev, long cur, String ss) {
        if (u == n) {
            if (cur == t) ans.add(ss);
            return;
        }
        for (int i = u; i < n; i++) {
            if (i != u && s.charAt(u) == '0') break;
            long next = Long.parseLong(s.substring(u, i + 1));
            if (u == 0) {
                dfs(i + 1, next, next, "" + next);
            } else {
                dfs(i + 1,  next, cur + next, ss + "+" + next);
                dfs(i + 1, -next, cur - next, ss + "-" + next); // 记录负数可以统一加号，例如，-5 = +(-5)
                // 乘号里的 prev 要直接算出来，判断逻辑只留下加法 
                long x = prev * next;
                dfs(i + 1, x, cur - prev + x, ss + "*" + next);
            }
        }
    }
}
```

## LC 301. 删除无效的括号（重点）

思考：
- 选择一个左括号 `score + 1`，选择一个右括号 `score - 1`，当前得分出现负数肯定要 return，`startIndex` 控制当前栈帧选择哪一个字符。
- 本题类似启发式搜索方案，当前的这个 `s[startIndex]` 字符可以不被选择（之前的题目是 `s[startIndex] - s[i]` 都要被选择）。到达叶子节点统计最长的有效括号。

代码：
```java
class Solution {
    int n, maxScore;
    StringBuilder path;
    List<String> ans;
    int maxLen = 0;
    HashSet<String> set = new HashSet<>(); // 去重只能加入 String，不能是 StringBuilder

    public List<String> removeInvalidParentheses(String s) {
        n = s.length();
        path = new StringBuilder();
        ans = new ArrayList<>();
        char[] cs = s.toCharArray();
        int l = 0, r = 0;
        // 从左到右的组合问题
        for (int i = 0; i < n; i++) {
            if (cs[i] == '(') l++;
            else if (cs[i] == ')') r++;
        }
        maxScore = Math.min(l, r);
        dfs(path, 0, 0, cs);
        for (String item : set) {
            ans.add(item.toString());
        }
        return ans;
    }

    private void dfs(StringBuilder path, int score, int startIndex, char[] cs) {
        if (score < 0 || score > maxScore) {
            return;
        }
        if (startIndex == n) { // 到达空节点
            if (score == 0 && path.length() >= maxLen) {
                if (path.length() > maxLen) {
                    set.clear();
                }
                maxLen = path.length();
                set.add(path.toString());
            }
            return;
        }
        char c = cs[startIndex];
        if (c == '(') { // 当前的字符可以选择，可以不选择
            dfs(path.append(c), score + 1, startIndex + 1, cs);
            path.deleteCharAt(path.length() - 1); // backtracking
            dfs(path, score, startIndex + 1, cs);
        } else if (c == ')') {
            dfs(path.append(c), score - 1, startIndex + 1, cs);
            path.deleteCharAt(path.length() - 1);
            dfs(path, score, startIndex + 1, cs);
        } else {
            dfs(path.append(c), score, startIndex + 1, cs); // 字母一定要选择
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```
## LC 386. 字典序排数

描述：

```LaTeX
按字典序返回范围 [1,n] 内所有整数。
```

思考：

树的高度就是 $n$ 的位数。

代码：
```java
class Solution {
    private LinkedList<Integer> path = new LinkedList<>();

    private LinkedList<Integer> ans = new LinkedList<>();

    public List<Integer> lexicalOrder(int n) {
        int len = 0;
        int count = n;
        while (count > 0){
            count /= 10;
            len++;
        }
        dfs(n, len, 0);
        return ans;
    }

    private void dfs(int n, int len, int depth) {
        if (depth >= len) {
            return;
        }
        for (int i = 0; i <= 9; i++) {
            if (i == 0 && path.isEmpty()) { // 排除前导 0
                continue;
            }
            if (getNum(path) * 10 + i > n) {
                return;
            }
            path.add(i);
            ans.add(getNum(path));
            dfs(n, len, depth + 1);
            path.removeLast();
        }

    }

    private int getNum(LinkedList<Integer> path) {
        int size = path.size();
        int count = 0;
        for (int i = 0; i < size; i++) {
            count = count * 10 + path.get(i);
        }
        return count;
    }
}
```
## LC 397. 整数替换

描述：

```latex
给定一个正整数 n ，你可以做如下操作：

如果 n 是偶数，则用 n / 2替换 n 。
如果 n 是奇数，则可以用 n + 1或n - 1替换 n 。
返回 n 变为 1 所需的 最小替换次数 。
```

思考：

DFS 还要加上记忆化。

代码：

```java
class Solution {
    // 这里 n + 1 会直接越界
    Map<Long, Integer> map = new HashMap<>();
    public int integerReplacement(int n) {
        return dfs((long) n);
    }

    private int dfs(long n) {
        if (n == 1) return 0;
        if (map.containsKey(n)) return map.get(n); // 记忆化搜索
        int ans = n % 2 == 0 ? dfs(n / 2) : Math.min(dfs(n - 1), dfs(n + 1));
        map.put(n, ans + 1);
        return ans + 1;
    }
}
```
## LC 403. 青蛙过河（重点）

思考：

记忆化搜索将 DFS 函数中的**可变参数**作为维度，存储的是返回值。只要本栈帧内有返回值就记录下来。

DFS 函数入参的是 `startIndex`，能否递归到下一个栈帧看跳的下一个点有没有石头。

代码：

```java
class Solution {
    private int[] stones;

    private Map<Integer, Integer> map = new HashMap<>();

    private Map<String, Boolean> memo = new HashMap<>();

    public boolean canCross(int[] stones) {
        this.stones = stones;
        int n = stones.length;
        if (stones[1] != 1) return false;   
        for (int i = 0; i < n; i++) {
            map.put(stones[i], i);
        }
        return dfs(1, 1);
    }

    private boolean dfs(int index, int k) {
        // 这里的下标 index 就是 startIndex
        String key = index + "_" + k;
        if (memo.containsKey(key)) {
            return memo.get(key);
        }
        if (index == stones.length - 1) {
            memo.put(key, true);
            return true;
        }
        for (int step = -1; step <= 1; step++) {
            if (k + step == 0) continue;
            // 0 + 2 2 上没有石头
            int nextPos = stones[index] + k + step;
            if (map.containsKey(nextPos)) {
                int nextIndex = map.get(nextPos);
                // 以步长 k + step 来到 nextIndex 是否可以到达终点
                boolean isArrival = dfs(nextIndex, k + step);
                if (isArrival) {
                    memo.put(key, true);
                    return true;
                }
            }
        }
        memo.put(key, false);
        return false;
    }
}
```

## LC 473. 火柴拼正方形（重点）

描述：
```LaTeX
你将得到一个整数数组 matchsticks ，其中 matchsticks[i] 是第 i 个火柴棒的长度。
你要用 所有的火柴棍 拼成一个正方形。你 不能折断 任何一根火柴棒，
但你可以把它们连在一起，而且每根火柴棒必须 使用一次 。

如果你能使这个正方形，则返回 true ，否则返回 false 。
```

思考：启发式搜索，每一个栈帧枚举的是一根火柴，这一根火柴有 4 个位置，如果可以放进去就递归下去。


代码：
```java
class Solution {
    private int target = 0;

    public boolean makesquare(int[] matchsticks) {
        int sum = 0;
        for (int stick : matchsticks) {
            sum += stick;
        }
        if (sum % 4 != 0) return false;
        target = sum / 4;
        // 从大到小搜索会更好
        matchsticks = bubbleSort(matchsticks);
        return dfs(matchsticks, 0, new int[4]);
    }

    private boolean dfs(int[] matchsticks, int startIndex, int[] size) {
        if (startIndex == matchsticks.length) {
            if (size[0] == size[1] && size[1] == size[2] && size[2] == size[3]) {
                return true;
            }
            return false;
        }
        for (int i = 0; i < 4; i++) {
            if (size[i] + matchsticks[startIndex] > target || (i > 0 && size[i] == size[i - 1])) { // 去重什么原理
                continue;
            }
            size[i] += matchsticks[startIndex];
            if (dfs(matchsticks, startIndex + 1, size)) {
                return true;
            }
            size[i] -= matchsticks[startIndex];
        }
        return false;
    }

    private int[] bubbleSort(int[] nums) {
        int n = nums.length;
        int temp = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[j] > nums[i]) {
                    temp = nums[i];
                    nums[i] = nums[j];
                    nums[j] = temp;
                }
            }
        }
        return nums;
    }
}
```
## LC 488. 祖玛游戏（重点）

描述：
```LaTeX
你正在参与祖玛游戏的一个变种。

在这个祖玛游戏变体中，桌面上有 一排 彩球，每个球的颜色可能是：红色 'R'、黄色 'Y'、蓝色 'B'、绿色 'G' 或白色 'W' 。你的手中也有一些彩球。

你的目标是 清空 桌面上所有的球。每一回合：

从你手上的彩球中选出 任意一颗 ，然后将其插入桌面上那一排球中：两球之间或这一排球的任一端。
接着，如果有出现 三个或者三个以上 且 颜色相同 的球相连的话，就把它们移除掉。
如果这种移除操作同样导致出现三个或者三个以上且颜色相同的球相连，则可以继续移除这些球，直到不再满足移除条件。
如果桌面上所有球都被移除，则认为你赢得本场游戏。
重复这个过程，直到你赢了游戏或者手中没有更多的球。
给你一个字符串 board ，表示桌面上最开始的那排球。另给你一个字符串 hand ，表示手里的彩球。请你按上述操作步骤移除掉桌上所有球，
计算并返回所需的 最少 球数。如果不能移除桌上所有的球，返回 -1 。
```

思考：
- DFS，可变参数是 `board` 和 `hand`。
- `bitMap`：记录小球的选取情况，是一个全排列。
- 记忆化搜索：key 是 DFS 函数的所有可变参数，value 是每一个栈帧的返回值。
- 每一个栈帧中选取一个小球插入 `board` 中，`board` 消除了一些字母后递归到下一个栈中。

代码：
```java
class Solution {
    private final int INF = 0x3f3f3f3f;
    private int m;
    private String hand;
    private Map<String, Integer> map = new HashMap<>();

    public int findMinStep(String board, String hand) {
        int ans = INF;
        m = hand.length();
        this.hand = hand;
        ans = dfs(board, 1 << m);
        return ans == INF ? -1 : ans;
    }

    private int dfs(String board, int prev) {
        // 小球选取的是 prev，字符串是 board 的最小次数
        if (board.length() == 0) return 0;
        int ans = INF;
        String key = board + "_" + prev; // 就是入参
        if (map.containsKey(key)) {
            return map.get(key);
        }
        int n = board.length();
        for (int i = 0; i < m; i++) { // 一个栈有 m 个分支
            if (((prev >> i) & 1) == 1) continue; // 只记录低位，组合问题
            int cur = (1 << i) | prev; // cur 是变化的，有 1 的位都记录下来，按位或
            char ball = hand.charAt(i);
            for (int j = 0; j <= n; j++) {
                StringBuilder sb = new StringBuilder();
                boolean ok = false;
                if (j > 0 && j < n && 
                board.charAt(j) == board.charAt(j - 1) && 
                board.charAt(j - 1) != ball) ok = true; // 特殊的情况
                if (j < n && board.charAt(j) == ball) ok = true;
                if (!ok) continue;
                sb.append(board.substring(0, j)).append(ball);
                if (j < n) {
                    sb.append(board.substring(j));
                }
                int k = j;
                // 小球消除的逻辑
                while (0 <= k && k < sb.length()) {
                    char c = sb.charAt(k);
                    int l = k, r = k;
                    while (l >= 0 && sb.charAt(l) == c) l--;
                    while (r < sb.length() && sb.charAt(r) == c) r++;
                    if (r - l - 1 >= 3) {
                        sb.delete(l + 1, r);
                        k = l >= 0 ? l : r;
                    } else {
                        break;
                    }
                }
                ans = Math.min(ans, dfs(sb.toString(), cur) + 1);
            } 
        }
        map.put(key, ans); // map 里的 key 是 board + "_" + prev
        return ans;
    }
}
```

## LC 494. 目标和（重点）

描述：
```LaTeX
给你一个整数数组 nums 和一个整数 target 。

向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：

例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。
```

思考：背包问题，也可以使用记忆化搜索。和[[#LC 282. 给表达式添加运算符（重点）]]是同一类问题。

代码：
```java
private Map<String, Integer> memo = new HashMap<>();

public int findTargetSumWays(int[] nums, int target) {
    return dfs(nums, target, 0, 0);
}

private int dfs(int[] nums, int target, int startIndex, int sum) {
    String key = startIndex + "_" + sum;
    if (memo.containsKey(key)) return memo.get(key);
    if (startIndex == nums.length) {
        memo.put(key, sum == target ? 1 : 0);
        return memo.get(key);
    }
    int cur = nums[startIndex];
    int left = dfs(nums, target, startIndex + 1, sum + cur);
    int right = dfs(nums, target, startIndex + 1, sum - cur);
    memo.put(key, left + right);
    return left + right;
}
```

## LC 638. 大礼包（重点）

描述：
```LaTeX
在 LeetCode 商店中， 有 n 件在售的物品。每件物品都有对应的价格。
然而，也有一些大礼包，每个大礼包以优惠的价格捆绑销售一组物品。

给你一个整数数组 price 表示物品价格，其中 price[i] 是第 i 件物品的价格。
另有一个整数数组 needs 表示购物清单，其中 needs[i] 是需要购买第 i 件物品的数量。

还有一个数组 special 表示大礼包，special[i] 的长度为 n + 1 ，其中 special[i][j] 表示第 i 个大礼包中内含第 j 件物品的数量，
且 special[i][n] （也就是数组中的最后一个整数）为第 i 个大礼包的价格。

返回 确切 满足购物清单所需花费的最低价格，你可以充分利用大礼包的优惠活动。你不能购买超出购物清单指定数量的物品，即使那样会降低整体价格。任意大礼包可无限次购买。
```

思考：
- 记忆化搜索，可变参数只有 `needs`。注意这里的可变参数是引用传递，每次递归都要传递一个新的 `newNeeds`。
- 每一个栈帧中枚举所有的大礼包，满足条件就递归下去。

代码：
```java
class Solution {
    private List<Integer> price;
    private List<List<Integer>> special;
    private List<Integer> needs;
    private Map<List<Integer>, Integer> map;

    public int shoppingOffers(List<Integer> price, List<List<Integer>> special, List<Integer> needs) {
        this.price = price;
        this.special = special;
        this.needs = needs;
        this.map = new HashMap<>();
        return dfs(needs);
    }

    private int dfs(List<Integer> needs) { // 记忆化搜索
        if (map.containsKey(needs)) {
            return map.get(needs);
        }
        int ans = getPrice(needs, price); // 最后等于 0
        int size = special.size();
        int n = 0;
        for (int i = 0; i < size; i++) {
            List<Integer> ticket = special.get(i);
            int m = ticket.size(); // m = n + 1
            n = m - 1; // 一共是 n 件商品
            boolean ok = true;
            for (int k = 0; k < n; k++) { 
                if (ticket.get(k) > needs.get(k)) { // 当前的优惠券商品的数量超出了需求
                    ok = false;
                    break;
                }
            }
            if (!ok) continue;
            // 优惠券可以使用
            // 更新 needs
            List<Integer> newNeeds = new ArrayList<>();
            for (int k = 0; k < n; k++) {
                newNeeds.add(needs.get(k) - ticket.get(k));
            }
            // 计算价格
            ans = Math.min(ans, dfs(newNeeds) + ticket.get(m - 1));
        }
        map.put(needs, ans);
        return ans;
    }

    private int getPrice(List<Integer> needs, List<Integer> price) {
        int sum = 0;
        for (int i = 0; i < needs.size(); i++) {
            sum += needs.get(i) * price.get(i);
        }
        return sum;
    }
}
```

## LC 691. 贴纸拼词

描述：
```LaTeX
我们有 n 种不同的贴纸。每个贴纸上都有一个小写的英文单词。

您想要拼写出给定的字符串 target ，方法是从收集的贴纸中切割单个字母并重新排列它们。
如果你愿意，你可以多次使用每个贴纸，每个贴纸的数量是无限的。

返回你需要拼出 target 的最小贴纸数量。如果任务不可能，则返回 -1 。

注意：在所有的测试用例中，所有的单词都是从 1000 个最常见的美国英语单词中随机选择的，
并且 target 被选择为两个随机单词的连接。
```

思考：
- 记忆化搜索，每一个栈帧中枚举每一张贴纸，如果这一张贴纸可以消除字符串，就递归下去搜索。
- 本题还要注意**单词字母消除**的逻辑。

代码：
```java
class Solution {

    private String[] stickers;
    
    private final int INF = 0x3f3f3f3f;
    
    private Map<String, Integer> map = new HashMap<>();

    public int minStickers(String[] stickers, String target) {
        this.stickers = stickers;
        int ans = dfs(target);
        return ans == INF ? -1 : ans;
    }

    private int dfs(String target) {
        if (target == null || target.length() == 0) return 0;
        if (map.containsKey(target)) {
            return map.get(target);
        }
        int ans = INF;
        for (int i = 0; i < stickers.length; i++) {
            String sticker = stickers[i];
            String cur = operation(sticker, target);
            if (cur.length() == target.length()) {
                continue;
            }
            ans = Math.min(ans, dfs(cur) + 1);
        }
        map.put(target, ans);
        return ans;
    }

    private String operation(String sticker, String target) {
        int[] count = new int[26]; // 所有的字母都是小写字母
        for (char c : target.toCharArray()) {
            count[c - 'a']++;
        }
        for (char c : sticker.toCharArray()) {
            count[c - 'a']--;
        }
        StringBuilder sb = new StringBuilder(); // 可以这样拼接是因为不强调顺序
        for (int i = 0; i < 26; i++) {
            char c = (char) (i + 'a');
            if (count[i] > 0) {
                int num = count[i];
                for (int j = 0; j <num; j++) {
                    sb.append(c);
                }
            }
        }
        return sb.toString();     
    }
}
```
## LC 779. 第 K 个语法符号

描述：
```LateX
我们构建了一个包含 n 行( 索引从 1  开始 )的表。
首先在第一行我们写上一个 0。接下来的每一行，将前一行中的0替换为01，1替换为10。

例如，对于 n = 3 ，第 1 行是 0 ，第 2 行是 01 ，第3行是 0110 。
给定行数 n 和序数 k，返回第 n 行中第 k 个字符。（ k 从索引 1 开始）
```

思考：
```LaTeX
        0
	0		1
0	   1 1		0

        1
	1		2
1	   2 3		4
```

代码：
## LC 784. 字母大小写全排列

描述：
```LaTeX
给定一个字符串 s ，通过将字符串 s 中的每个字母转变大小写，我们可以获得一个新的字符串。

返回 所有可能得到的字符串集合 。以 任意顺序 返回输出。
```

代码：
```java
class Solution {
    private StringBuilder path = new StringBuilder();

    private List<String> ans=  new ArrayList<>();

    public List<String> letterCasePermutation(String s) {
        dfs(s, 0);
        return ans;
    }

    private void dfs(String s, int index) {
        if (path.length() == s.length()) {
            ans.add(new String(path));
            return;
        }
        char c = s.charAt(index);
        if (Character.isUpperCase(c)) {
            for (int i = 0; i < 2; i++) {
                if (i == 0) {
                    path.append(c);
                    dfs(s, index + 1);
                    path.deleteCharAt(path.length() - 1);
                } else {
                    path.append(Character.toLowerCase(c));
                    dfs(s, index + 1);
                    path.deleteCharAt(path.length() - 1);
                }
            }
        } else if (Character.isLowerCase(c)) {
            for (int i = 0; i < 2; i++) {
                if (i == 0) {
                    path.append(c);
                    dfs(s, index + 1);
                    path.deleteCharAt(path.length() - 1);
                } else {
                    path.append(Character.toUpperCase(c));
                    dfs(s, index + 1);
                    path.deleteCharAt(path.length() - 1);
                }
            }
        } else {
            path.append(c);
            dfs(s, index + 1);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```
## LC 1723. 完成所有工作的最短时间

思考：类比[LC 473. 火柴拼正方形](#ofRjc)，这里是要求最长的边最小。优先将当前工作分配给空闲工人。

代码：
```java
class Solution {
    private int k;

    private int[] jobs;

    private int n;

    private int ans = 0x3f3f3f3f;

    public int minimumTimeRequired(int[] jobs, int k) {
        this.k = k;
        this.jobs = jobs;
        this.n = jobs.length;
        int[] sum = new int[k];
        dfs(sum, 0, 0, 0);
        return ans;
    }
    
    private void dfs(int[] sum, int used, int u, int max) {// 传入的是记录的状态
        if (max >= ans) {
            return;
        }
        if (u == n) { // 统计的是叶子节点的信息
            ans = Math.min(ans, max);
            return;
        }
        // 优先分配给空闲工人，一开始就比较平均，ans 就可以很小，剪枝的效果更好
        if (used < k) {
            sum[used] = jobs[u];
            dfs(sum, used + 1, u + 1, Math.max(sum[used], max));
            sum[used] = 0;
        }
        // used < k, 如果 sum 有空余的，就不要后放了
        for (int i = 0; i < used; i++) { // 这里是 used //
            sum[i] += jobs[u];
            dfs(sum, used, u + 1, Math.max(sum[i], max));
            sum[i] -= jobs[u];
        }
    }
}
```
## LC 2044. 统计按位或能得到最大值的子集数目
思考：
一共是$2^{n}$种状态，利用 bitMap 直接枚举。
DFS，遇到了当前字母可以选择，也可以不选择，统计叶子节点。
代码：
```java
class Solution {
    private int[] nums;

    private int max = 0;

    private int count = 0;

    public int countMaxOrSubsets01(int[] nums) {
        this.nums = nums;
        dfs(0, 0);
        return count;
    }

    public int countMaxOrSubsets(int[] nums) {
        int n = nums.length;
        int mask = 1 << n;
        int max = 0;
        int count = 0;
        for (int s = 0; s < mask; s++) { // 2 ^ n 个状态，当前子集的状态 
            int cur = 0;
            for (int i = 0; i < n; i++) { 
                if (((s >> i) & 1) == 1) { // 在循环中 s 的值没有改变，判断 nums[i] 有没有被选出来
                    cur = cur | nums[i]; // 0100
                }
            }
            if (cur > max) {
                max = cur;
                count = 1;
            } else if (cur == max) {
                count++;
            }
        }
        return count;
    }

    private void dfs(int u, int val) {
        // 统计的是叶子节点
        if (u >= nums.length) {
            if (val > max) {
                max = val;
                count = 1;
            } else if (val == max) {
                count++;
            }
            return;
        }
        dfs(u + 1, val); // 不选 nums[u]
        dfs(u + 1, val | nums[u]); // 选 nums[u]
    }
}
```
