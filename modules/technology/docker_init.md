# Docker和lazydocker的安装

**写在开始，本教程只适用于ARM64架构的机器，其他的直接点击官网**

## 准备工作
配置系统的软件镜像，可以下载更快
- [ubuntu](https://developer.aliyun.com/mirror/ubuntu)
- [debian](https://developer.aliyun.com/mirror/debian)
- [其他的](https://developer.aliyun.com/mirror/)

## Docker 安装

官方安装教程
- [ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [debian](https://docs.docker.com/install/linux/docker-ce/debian/)
**注意:在使用添加apt软件源的时候，记得修改为阿里云的软件源镜像**


```bash
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# ubuntu
sudo add-apt-repository \
   "deb [arch=arm64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# debian
sudo add-apt-repository \
   "deb [arch=arm64] https://mirrors.aliyun.com/docker-ce/linux/debian \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

# 安装docker-ce
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

## lazydocker安装

[lazydocker项目地址](https://github.com/jesseduffield/lazydocker)

```bash
# 直接安装脚本
curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
```

## Nginx测试

```bash
docker run --name nginx -p 80:80 -d --restart=always nginx
```
浏览器访问一下IP 能够正确访问就成功了。

**如果404**
1. 查看防火墙是否开启，如果开启了要添加端口入网rule

```bash
# 查看是否开启防火墙 active是开启，inactive是未开启
sudo uwf status

# 允许80端口
sudo uwf allow 80
```

2. 如果防火墙是关闭的，或是开启了80端口，还是不行，查看服务器提供商是否有安全组

## Docker安装常见问题
[Docker中文网FAQ](http://www.docker.org.cn/faq/global/c96.html)