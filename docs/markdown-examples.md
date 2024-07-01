# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

# VitePress 使用策略
:::tip 方法论 1
1. 
2. 
3.  hello world
:::
:tada

## wiki 的内部引用
[统计不同的回文子序列](./LeetCode/动态规划/背包DP/#474-一和零)

[单串问题](/LeetCode/双指针、滑动窗口和二分/滑动窗口#lc-3-无重复字符的最长子串)

语法规则为：

```md
[统计不同的回文子序列](./LeetCode/动态规划/#最长回文子串)
```
12^2, hello world.

:100

:tada

## 代码组
::: code-group
```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```
:::

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features
like line-highlighting:

**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
