::编译
call npm run docs:build

::进入生成的文件夹
cd .vuepress\dist

git init
git add -A
git commit -m 'deploy'

::强制推送覆盖
git push -f https://github.com/Clinan/clinan.github.io.git master
