module.exports = [
    '/modules/technology/',
    {
        title: '架构', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/architecture/alibaba_book'
        ]
    },{
        title: 'Java', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/java/JVM',
            '/modules/technology/java/big_data_export',
            '/modules/technology/java/tomcat',
            '/modules/technology/java/java',
            '/modules/technology/java/concurrent',
        ]
    },
    {
        title: '中间件', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/middleware/redis',
            '/modules/technology/middleware/elasticsearch',
            '/modules/technology/middleware/kafka',
            '/modules/technology/middleware/分布式事务',
        ]
    },
    {
        title: 'DB', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/db/hadoop',
            '/modules/technology/db/mysql-index',
            '/modules/technology/db/mysql-transaction',
            '/modules/technology/db/innodb',
            '/modules/technology/db/mysql_isolation',
            '/modules/technology/db/mysql_learn',
        ]
    },
    {
        title: 'Spring', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/spring/SPI启动',
            '/modules/technology/spring/DispatcherServlet分析',
            '/modules/technology/spring/springboot-autoconfigure',
            '/modules/technology/spring/controller参数解析拦截',
            '/modules/technology/spring/springboot',
            '/modules/technology/spring/spring-bean',
            '/modules/technology/spring/springboot_init_flow',
            '/modules/technology/spring/spring-data-access',
            '/modules/technology/spring/mybatis',
            '/modules/technology/spring/spring-mvc',
        ]
    },
    {
        title: 'SpringCloud', // 侧边栏名称 
        collapsable: true, // 可折叠 
        children: [
            '/modules/technology/springcloud/dubbo-nacos',
        ]
    },
    {
        title: 'Linux(Debian)',
        collapsable: true,
        children: [
            '/modules/technology/linux-server/rasperry_init',
            '/modules/technology/linux-server/docker_init',
            '/modules/technology/linux-server/linux_bash',
            '/modules/technology/linux-server/jenkins_mysql_gogs_install',
        ]
    },
    {
        title: '基础知识',
        collapsable: true,
        children: [
            '/modules/technology/base/algorithm',
            '/modules/technology/base/tcpip',
            '/modules/technology/base/binary',
            '/modules/technology/base/pattern',
        ]
    },
    {
        title: '前端',
        collapsable: true,
        children: [
            '/modules/technology/frontend/vuepress_deploy',
            '/modules/technology/frontend/CSS_Module踩坑',
        ]
    },
]