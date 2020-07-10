module.exports = {
    title: '克林',
    description: '生活、技术、摄影',
    port: 80,
    cache: false,
    base: '/',
    '/': {
        lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
        title: '克林',
        description: '生活、技术、摄影'
    },
    head: [
        //     ['link', {
        //         rel: 'stylesheet',
        //         href: `https://fonts.cat.net/css?family=Roboto:100,300,400,500,700,900|Material+Icons`
        //     }],
        ['link', {rel: 'stylesheet', href: `https://cdn.clinan.xyz/fontawesome.css`}],
        // ['script', { src: 'https://use.fontawesome.com/623269ea04.js' }]
    ],
    themeConfig: {
        repo: 'clinan/blog',
        logo: 'https://cdn.clinan.xyz/mini_logo.png',
        // 如果你的文档不在仓库的根部
        // docsDir: 'docs',
        // 可选，默认为 master
        docsBranch: 'master',
        // 默认为 true，设置为 false 来禁用
        editLinks: true,
        lastUpdated: '最后更新于',
        // search: false,
        searchMaxSuggestions: 10,
        // sidebar: 'auto',
        smoothScroll:true,
        sidebar: {
            '/modules/photography/': require('./sidebar/photography'),
            '/modules/technology/': require('./sidebar/technology'),
            '/modules/life/': require('./sidebar/life'),
            '/modules/literature/': require('./sidebar/literature')
        },
        displayAllHeaders: true,
        nav: [
            { text: '现代文学', link: '/modules/literature/' },
            { text: '杂技奇谭', link: '/modules/technology/' },
            { text: '吃草日常', link: '/modules/life/' },
            { text: '无后期摄影', link: '/modules/photography/' }
        ],

    },
    plugins: [
        ['@vuepress/nprogress'],
        ['@vuepress/search', {
            searchMaxSuggestions: 10
        }],
        ['@vuepress/back-to-top', true],
        ['@vuepress/active-header-links', true],
        ['@vssue/vuepress-plugin-vssue', {
            // 设置 `platform` 而不是 `api`
            platform: 'github',

            // 其他的 Vssue 配置
            owner: 'Clinan',
            repo: 'clinan.github.io',
            clientId: 'b0f0e07b684257f4d58b',
            clientSecret: 'f84b781141d1f67def044b7d97b7cc483c426391',
        }],
        ['container', {
            type: 'tip',
            defaultTitle: {
                '/': '提示'
            }
        }],
        ['container', {
            type: 'warning',
            defaultTitle: {
                '/': '注意'
            }
        }],
        ['container', {
            type: 'danger',
            defaultTitle: {
                '/': ''
            }
        }],

    ]

};