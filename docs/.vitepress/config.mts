import {defineConfig} from 'vitepress'
import {withMermaid} from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
    title: "QinBoom' repository",
    description: "QinBoom的知识仓库",
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {
                text: 'Java SE',
                items: [
                    {
                        text: '函数式编程',
                        link: '/Java SE/函数式编程'
                    },
                    {
                        text: 'Java 8 新特性',
                        link: '/Java SE/Java 8 新特性：Lambda 表达式、方法引用和 Stream 流'
                    }

                ]
            },
            {
                text: 'LeetCode算法笔记',
                items: [
                    {
                        text: '数据结构',
                        items: [
                            {text: '基础数据结构', link: '/LeetCode/数据结构/基础数据结构'},
                            {text: '链表', link: '/LeetCode/数据结构/链表'},
                            {text: '栈和单调栈', link: '/LeetCode/数据结构/栈和单调栈'},
                        ]
                    },
                    {
                        text: '动态规划',
                        items: [
                            {text: '线性DP', link: '/LeetCode/动态规划/线性DP'},
                            {text: '区间DP', link: '/LeetCode/动态规划/区间DP'},
                            {text: '背包DP', link: '/LeetCode/动态规划/背包DP'},
                            {text: '前缀和', link: '/LeetCode/动态规划/前缀和'}
                        ]
                    },
                    {
                        text: '双指针、滑动窗口和二分',
                        items: [
                            {text: '双指针', link: '/LeetCode/双指针、滑动窗口和二分/双指针'},
                            {text: '滑动窗口', link: '/LeetCode/双指针、滑动窗口和二分/滑动窗口'},
                            {text: '二分', link: '/LeetCode/双指针、滑动窗口和二分/二分'}
                        ]
                    },
                    {
                        text: '深度优先搜索和广度优先搜索',
                        items: [
                            {text: '深度优先搜索', link: '/LeetCode/深度优先搜索和广度优先搜索/深度优先搜索（DFS）'},
                            {text: '回溯算法', link: '/LeetCode/深度优先搜索和广度优先搜索/回溯算法'},
                            {text: '广度优先搜索', link: '/LeetCode/深度优先搜索和广度优先搜索/广度优先搜索（BFS）'}
                        ]
                    }
                ]
            },
            {text: 'Android',
                items: [
                    {
                        text: 'Activity的生命周期和启动模式',
                        link: '/Android/Activity的生命周期和启动模式'
                    }
                ]
            }
        ],

        sidebar: [
            {
                text: 'Java SE',
                collapsed: true,
                items: [
                    {
                        text: '函数式编程',
                        link: '/Java SE/函数式编程'
                    },
                    {
                        text: 'Java 8 新特性：Lambda 表达式、方法引用和 Stream 流.md',
                        link: '/Java SE/Java 8 新特性：Lambda 表达式、方法引用和 Stream 流'
                    }
                ]
            },
            {
                text: 'LeetCode算法笔记',
                collapsed: true,
                items: [
                    {
                        text: '数据结构',
                        items: [
                            {text: '基础数据结构', link: '/LeetCode/数据结构/基础数据结构'},
                            {text: '链表', link: '/LeetCode/数据结构/链表'},
                            {text: '栈和单调栈', link: '/LeetCode/数据结构/栈和单调栈'},
                        ]
                    },
                    {
                        text: '动态规划',
                        items: [
                            {text: '线性DP', link: '/LeetCode/动态规划/线性DP'},
                            {text: '区间DP', link: '/LeetCode/动态规划/区间DP'},
                            {text: '背包DP', link: '/LeetCode/动态规划/背包DP'},
                            {text: '前缀和', link: '/LeetCode/动态规划/前缀和'}
                        ]
                    },
                    {
                        text: '双指针、滑动窗口和二分',
                        items: [
                            {text: '双指针', link: '/LeetCode/双指针、滑动窗口和二分/双指针'},
                            {text: '滑动窗口', link: '/LeetCode/双指针、滑动窗口和二分/滑动窗口'},
                            {text: '二分', link: '/LeetCode/双指针、滑动窗口和二分/二分'}
                        ]
                    },
                    {
                        text: '深度优先搜索和广度优先搜索',
                        items: [
                            {text: '深度优先搜索', link: '/LeetCode/深度优先搜索和广度优先搜索/深度优先搜索（DFS）'},
                            {text: '回溯算法', link: '/LeetCode/深度优先搜索和广度优先搜索/回溯算法'},
                            {text: '广度优先搜索', link: '/LeetCode/深度优先搜索和广度优先搜索/广度优先搜索（BFS）'}
                        ]
                    }
                ]
            }
        ],

        socialLinks: [
            {
                icon: {
                    svg: '<img src="https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/favicon.ico" ' +
                        'alt="Icon" width="20px" height="20px"/>'
                },
                link: 'https://www.baidu.com'
            },
            {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
        ],

        outline: {
            level: [1, 3],
            label: 'On This Page'
        },
        // search: {
        //     provider: 'local'
        // }
    },
    head: [['link', {rel: 'icon', href: 'https://gaorq.oss-cn-shanghai.aliyuncs.com/imgs/imgs1/favicon.ico'}]],
    mermaid: {},
    mermaidPlugin: {
        class: "mermaid my-class",
    },
    markdown: {
        math: true,
        image: {
            // 开启图片懒加载
            lazyLoading: true
        }
    }
})
