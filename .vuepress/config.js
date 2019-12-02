module.exports = {
    title: '克林的博客',
    description: '生活、技术、摄影',
    port: 9000,
    themeConfig: {
        nav: [
            {text: '技术', link: '/modules/technology/'},
            {text: '生活', link: '/modules/my_lift'},
            {text: '摄影', link: '/modules/photography'}
        ],

    },
    // plugins: [
    //     ['@vuepress/search', {
    //         searchMaxSuggestions: 10
    //     }]
    // ]
    // locales
    // configureWebpack: {
    //     resolve: {
    //         alias: {
    //             '@alias': 'static'
    //         }
    //     }
    // }
};