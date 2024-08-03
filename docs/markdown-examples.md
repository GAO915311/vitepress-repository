# Markdown Extension Examples

VitePress is a Static Site Generator fast
字体和字体之间的区别
windows $\mathrm{windows}$ windows Markdown vitepress index.js

This page demonstrates some fo the built-in markdown extensions provided by VitePress.

This page demonstrates some of the built-in markdown extensions provided by VitePress.

# VitePress 使用策略
:::tip 方法论 1
1. 
2. 
3.  hello world
:::
:tada

## wiki 的内部引用

要注意文件的相对路径。

情况 1：
```md
LeetCode
    动态规划
        前缀和.md
        线性DP.md
markdown-examples.md
```

语法规则为：

[lc-115-不同的子序列](./LeetCode/动态规划/线性DP#lc-115-不同的子序列)

12<sup>2</sup> 这样也可以
23<sub>3</sub> , hello world.

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
