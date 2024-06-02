import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "QinBoom' blog",
    description: "A VitePress Site",
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Examples', link: '/markdown-examples'},
            {
                text: 'LeetCode算法笔记',
                items: [
                    {
                        text: 'DP',
                        items: [
                            {text: '线性DP', link: '/LeetCode/动态规划/线性DP'},
                            {text: '区间DP', link: '/markdown-examples'}
                        ]
                    },
                    {
                        text: 'greedy algorithm',
                        items: [
                            {text: 'slide_window', link: '/LeetCode/slide_window/slide_window'}
                        ]
                    }
                ]
            }
        ],

        sidebar: [
            {
                text: 'LeetCode',
                collapsed: true,

                items: [
                    {text: '动态规划', link: '/LeetCode/动态规划/线性DP'},
                    {text: '贪心算法', link: '/markdown-examples'},
                    {text: 'Runtime API Examples', link: '/api-examples'}
                ]
            }
        ],
        socialLinks: [
            {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
        ],
        outline: {
            level: [2, 3],
            label: 'On This Page'
        }
    },
    markdown: {
        math: true
    }
})
