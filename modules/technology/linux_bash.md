# Linux命令行操作

## 命令操作

| operate | action           |
| :------ | :--------------- |
| CTRL+A  | 光标回到行首     |
| CTRL+E  | 光标移至行尾     |
| CTRL+U  | 删除光标前的字符 |
| CTRL+K  | 删除光标后的字符 |


## 常用系统命令
### env 列出所有的环境变量
<details>
<summary>环境变量说明</summary>

- HOME 代表使用者的主文件夹。还记得我们可以使用 cd ~ 去到自己的主文件夹吗？或者利用 cd 就可以直接回到使用者主文件夹了。那就是取用这个变量啦～ 有很多程序都可能会取用到这个变量的值！

- SHELL 告知我们，目前这个环境使用的 SHELL 是哪支程序？ Linux 默认使用 /bin/bash 的啦！

- HISTSIZE 这个与“历史命令”有关，亦即是， 我们曾经下达过的指令可以被系统记录下来，而记录的“笔数”则是由这个值来设置的。

- MAIL 当我们使用 mail 这个指令在收信时，系统会去读取的邮件信箱文件 （mailbox）。

- PATH 就是可执行文件搜寻的路径啦～目录与目录中间以冒号（:）分隔， 由于文件的搜寻是依序由 PATH 的变量内的目录来查询，所以，目录的顺序也是重要的喔。

- LANG 这个重要！就是语系数据啰～很多讯息都会用到他， 举例来说，当我们在启动某些 perl 的程序语言文件时，他会主动的去分析语系数据文件， 如果发现有他无法解析的编码语系，可能会产生错误喔！一般来说，我们中文编码通常是 zh_TW.Big5 或者是 zh_TW.UTF-8，这两个编码偏偏不容易被解译出来，所以，有的时候，可能需要修订一下语系数据。 这部分我们会在下个小节做介绍的！

- RANDOM 这个玩意儿就是“随机乱数”的变量啦！目前大多数的 distributions 都会有乱数产生器，那就是 /dev/random 这个文件。 我们可以通过这个乱数文件相关的变量 （$RANDOM） 来随机取得乱数值喔。在 BASH 的环境下，这个 RANDOM 变量的内容，介于 0~32767 之间，所以，你只要 echo $RANDOM 时，系统就会主动的随机取出一个介于 0~32767 的数值。万一我想要使用 0~9 之间的数值呢？呵呵～利用 declare 宣告数值类型， 然后这样做就可以了：
```bash
$ declare -i number=$RANDOM*10/32768 
$ echo $number
$ 8   <== 此时会随机取出 0~9 之间的数值喔！
```
</details>

### locale 系统支持的语言
配置在默认语言定义在 `/etc/locale.conf `


## 变量
### 变量的声明`myname=clinan`，注意等于号两边不能有空格。
<details>
  <summary>Examples</summary>
  <code>myname='clina n'</code>
  <code>cat="clinan's cat"</code>
  <code>cat=clinan\'s\ cat</code>
</details>

### 变量的使用

<details>
  <summary>Examples</summary>
  <code>
  myname='clina n'
  echo $myname
  echo ${myname}withsubfix
  </code>
</details>

### 变量的累加
`PATH=$PATH:/home/dmtsai/bin`

### 变量的取消unset
`unset myname`

### 进阶
`cd /lib/modules/$(uname -r)/kernel` 进入到您目前核心的模块目录