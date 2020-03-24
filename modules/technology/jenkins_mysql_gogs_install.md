# jenkins、mysql、gogs、nginx的安装和整合

## jenkins安装
```bash
docker run  --name jenkins  -d -p 8002:8080 --mount "source=jenkins,target=/var/jenkins_home" \
-v /etc/timezone:/etc/timezone:ro \
-v /etc/localtime:/etc/localtime:ro \
-v /var/run/docker.sock:/var/run/docker.sock -v /usr/bin/docker:/usr/bin/docker jenkins/jenkins
```
*一定要用jenkins/jenkins这个库，不要使用docker官方的jenkins库*

**使用国内的插件源**
1. 由于上面挂载了jenkins_home到宿主机，所以直接在宿主机中操作文件即可
2. `nano /var/lib/docker/volumns/jenkins/_data/hudson.model.UpdateCenter.xml`
3. 修改URL为清华源或其他的
 * https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
 * http://mirror.esuni.jp/jenkins/updates/update-center.json
4. 上述步骤的2，3错误，从清华源等下载下来的json中，插件仍是指向jenkins-ci.org的下载源。
5. [原文链接](https://www.cnblogs.com/hellxz/p/jenkins_install_plugins_faster.html)
6. 容器中：
    ```bash
    cd /var/jenkins_home/updates/
    # sed 替换链接
    sed -i 's/http:\/\/updates.jenkins-ci.org\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g' default.json && sed -i 's/http:\/\/www.google.com/https:\/\/www.baidu.com/g' default.json
    ```
7. 如果在jenkins中使用docker命令，需要执行`cd /var/run/ && chmod 777 docker.sock`
8. 体验秒安装的快感
9. 插件选择gogs,maven,simple chinese location.

## MySQL的安装
```bash
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=password --mount "source=mysql_data,target=/var/lib/mysql" \
-v /etc/localtime:/etc/localtime:ro -p 3306:3306 -d mysql:8.0.18
```

*注意要修改上诉脚本中的root初始密码*

**mysql会存在查询慢的问题，去掉dns检索**  
`/etc/mysql/conf.d/mysql.cnf`的[mysqld]后面加上
```
skip-name-resolve
innodb_flush_log_at_trx_commit=0
sync_binlog=0
```

## gogs的安装

