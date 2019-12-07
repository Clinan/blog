module.exports = [
    '/modules/technology/',
    {
        title: 'Java', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/Springboot配置Servlet原理',
            '/modules/technology/SpringDispatcherServlet分析',
        ]
    },
    {
        title: '树莓派',
        collapsable: true,
        children: [
            '/modules/technology/rasperry_init',
        ]
    },
    {
        title: 'Linux(Debian)',
        collapsable: true,
        children: [
            '/modules/technology/rasperry_init',
        ]
    },
    {
        title: '杂技',
        collapsable: true,
        children: [
            '/modules/technology/vuepress_deploy',
        ]
    },
]