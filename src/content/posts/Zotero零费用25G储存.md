---
title: Zotero免费25G储存
published: 2026-04-03
description: "使用网盘webdav功能，零费将zotero同步空间容量扩展到25G"
category: Coding
tags: [zotero]
image: ""
draft: false 
lang: ""
---
## 准备工作
> 在开始之前我们需要准备:  
> * [x] 一个[Zotero](https://www.zotero.org/)账号  
> * [x] 一个[InfiniCLOUD](https://infini-cloud.net/en/index.html)账号(或任意有webdav功能的网盘)

---
## 配置webdav
1. 进入`InfiniCLOUD`的`My Page`页面
2. 找到下方的`Apps Connection`
3. 点击`Reissue`以显示链接密码  

> 注:每次点击`Reissue`都会**重置**并显示新的链接密码,导致所有设备**验证服务器失败**!  
所以密码显示以后,保存下来,不要频繁`Reissue`
4. 分别复制以下3条信息:
> **WebDAV Connection URL**   
> **Connection ID**  
> **Apps Password**  

> *ちなみに、步骤 `4.`往下滑,输入我的邀请码 `A2Y4K`,可多得5GB空间~*

5. 打开`Zotero`,点击左上角**编辑-设置-同步-文件同步**
6. 将同步方式: 由`Zotero`切换为`webdav`
7. 在弹出的方框内,务必**准确**填入步骤`4.`中复制的信息
8. 确认信息完全对应后,点击`验证服务器`,等待弹窗`文件同步设定成功`
9. 关闭提示,正常使用`zotero`  

---
## 配置时可能遇到的一些问题
0. 无法进入,注册`InfiniCLOUD`  
* [ ] 由于`InfiniCLOUD`是日本的网盘,有时需要`科学上网`,但绝大多数情况下不需要,可直连  

<br>

1. `验证服务器失败`
* [ ] 仔细检查你的链接id和密码,链接id不是`InfiniCLOUD`的用户id,也不是`zotero`的id
* [ ] 严格执行步骤`4.`和步骤`7.`
* [ ] 回想是否再次点击过`Reissue`,导致链接密码被重置  

<br>

2. 服务器设置验证通过后,`zotero`主页右上角的同步爆红`!`,未正常同步文件
* [ ] 服务器验证通过后,`zotero`仍无法同步文件至云端,说明此时问题不在webdav配置,  
请检查你的网络是否通畅,国内不需要使用加速器也可正常同步文件!  

<br>

3. 服务器验证通过,且`zotero`正常同步文件至云端,但其它设备查看或下载文件失败
* [ ] 问题出在`其它设备`,请检查不可查看或下载云端文件设备的`同步设置`,  
* [ ] 具体操作同上 `配置webdav`
---
## 关于zotero插件
### 如何下载zotero插件
1. 在`zotero`主页找到`工具-插件`,并点击
2. 点击下方 从 [Zotero plugins directory](https://www.zotero.org/support/plugins) 下载插件。

### 如何安装并使用插件
1. 在`zotero`主页找到`工具-插件`,并点击
2. 点击`Manage Your Plugins`右方`齿轮`图标
3. 选择`install Plugin From File`
4. 找到下载好的`..插件.xpi`,并`打开`即可

### 如何配置各种插件
* [x] 各种插件的自定义可在`zotero`主页左上角`编辑-设置`中找到并调试
---