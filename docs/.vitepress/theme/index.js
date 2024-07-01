// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
    ...DefaultTheme,
    enhanceAppContext(ctx) {
        ctx.app.provide('$cssVars', {
            'content-max-width': '1000px'
        })
    }
}