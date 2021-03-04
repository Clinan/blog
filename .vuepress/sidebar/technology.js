module.exports = [
    '/modules/technology/',
    {
        title: 'Java', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/Springboot配置Servlet原理',
            '/modules/technology/SpringDispatcherServlet分析',
            '/modules/technology/springboot-autoconfigure',
            '/modules/technology/spring-HandlerMethodArgumentResolver',
            '/modules/technology/JVM',
            '/modules/technology/springboot',
            '/modules/technology/springboot_init_flow',
            '/modules/technology/spring-data-access',
            '/modules/technology/big_data_export',
            '/modules/technology/mybatis',
            '/modules/technology/redis',
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
            '/modules/technology/mysql_learn',
            '/modules/technology/mysql_isolation',
            '/modules/technology/docker_init',
            '/modules/technology/CSS_Module踩坑',
            '/modules/technology/binary',
        ]
    },
]