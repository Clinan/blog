# vuepress发布到git page

:::tip
如何使用vuepress的教程在这里跳过，官网最为标准。  
:::
:::warning 
下面说的是部署在`youname.github.io`的根域名下。不带`vuepress config.js`中默认`base:'/'`
:::

## 1.在github创建仓库
![](/technology/vuepress_deploy_1.png)

## 2.部署脚本

在项目根目录下，创建`deploy.sh`，复制下面的代码到文件中    
请自行辨识下面的高亮行和备注，替换自己的信息上去   
windows用户可以使用git的命令行窗口执行脚本  `./deploy.sh`

```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build
# 进入生成的文件夹
cd .vuepress/dist

# 如果是发布到自定义域名
# echo 'www.domain.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f https://<USERNAME>.com/<USERNAME>/<USERNAME>.github.io.git master
git push -f https://github.com/clinan/clinan.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
```

## 3.到github项目界面上查看
![](/technology/vuepress_deploy_2.png)
![](/technology/vuepress_deploy_3.png)

## 4.访问`https://<USERNAME>.github.io`查看是否发布成功