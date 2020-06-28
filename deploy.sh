#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
#node c:/Users/leqee/AppData/Roaming/npm/node_modules/vuepress/cli.js build .
npm run docs:build
# 进入生成的文件夹
cd .vuepress/dist

# 如果是发布到自定义域名
echo 'www.clinan.xyz' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f https://github.com/Clinan/clinan.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
