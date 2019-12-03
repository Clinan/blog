# 树莓派
## 1.开机设置
   在连接上树莓派，应该先设置密码、时区、ssh登录、联网（在路由器上给pi设置静态ip），在询问是否要更新源时，应该跳过更新源。
## 2. 使用清华的树莓派源
修改`/etc/apt/source.list`文件
```
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
```
## 3. 执行更新源数据库和软件更新
```bash
sudo apt-get update
sudo apt-get upgrade
```
## 4. dockerce的安装

```bash
# step 1: 安装必要的一些系统工具
sudo apt-get update
sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common
# step 2: 安装GPG证书
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/raspbian/gpg | sudo apt-key add -
# Step 3: 写入软件源信息
sudo add-apt-repository "deb [arch=armhf] https://mirrors.aliyun.com/docker-ce/linux/raspbian $(lsb_release -cs) stable"
# Step 4: 更新并安装Docker-CE
sudo apt-get -y update
sudo apt-get -y install docker-ce 
``` 

## 5. 内网穿透软件的安装

- Sakura frp的官网（https://www.natfrp.org/）
- 注册账号并下载arm版本的软件
    
```bash
cd /etc/
mkdir frp
wget https://cdn.tcotp.cn:4443/client/Sakura_frpc_linux_arm.tar.gz
tar -zxvf Sakura_frpc_linux_arm.tar.gz
mv Sakura_frpc_linux_arm frp
# 运行
./frp
# 输入账号密码，并根据提示列表选择需要的线路即可
```
 - 由于要长期使用这个内网穿透工具，需要配置为开机自启动服务
```bash
cd /etc/systemd/system/
touch frp.service
```
 - 将下面的内容复制到frp.service文件中
```bash
[Unit]
Description=Sakura Frp Client
Wants=network-online.target
After=network-online.target
[Service]
User=root
WorkingDirectory=/
LimitNOFILE=4096
PIDFile=/var/run/sakurafrp/client.pid
RestartSec=20s
ExecStart=/etc/frp/frp  --su=注册的账号 --sp=注册的密码 --sid=线路编号，不知道可以参照上一步直接运行的时候，选择线路输入的数字
Restart=on-failure
StartLimitInterval=600
[Install]
WantedBy=multi-user.target
```
- 启动服务，并设置为开机自启动
```bash
systemctl daemon-reload
systemctl start frp.service
# 查看是否正常启动
systemctl status frp.service
#设置为开机自启动
systemctl enable frp.service
```
