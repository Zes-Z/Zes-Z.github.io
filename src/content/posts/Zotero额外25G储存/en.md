---
title: "Add 25 GB of Zotero Storage"
description: 'Use a cloud drive’s WebDAV feature to expand Zotero storage to 25 GB at no cost.'
pubDate: "2026-04-03"
category: "Math & Coding"
tag: [zotero,webdav]
# updatedDate: "2026-06-23"
postImage: " "
homepined: false
pinedOrder: 0
draft: false
---

## Prerequisites
> Before getting started, prepare:  
> * [x] A [Zotero](https://www.zotero.org/) account  
 > * [x] An [InfiniCLOUD](https://infini-cloud.net/en/index.html) account (or any cloud drive with WebDAV support)

---
## Configure WebDAV
1. Open the `My Page` page in `InfiniCLOUD`
2. Find `Apps Connection` below
3. Click `Reissue` to display the connection password  

> Note: Every time you click `Reissue`, the connection password is **reset**. All devices will then **fail server verification**!  
Once the password is displayed, save it and avoid clicking `Reissue` repeatedly.
4. Copy the following three items:
> **WebDAV Connection URL**   
> **Connection ID**  
> **Apps Password**  

> *By the way, scroll down past step `4.` and enter my invitation code `A2Y4K` to get an extra 5 GB of storage~*

5. Open `Zotero` and select **Edit - Settings - Sync - File Sync** in the upper-left menu.
6. Change the sync method from `Zotero` to `webdav`.
7. In the dialog, enter the information copied in step `4.` **exactly**.
8. After checking the information, click `Verify Server` and wait for the `File Sync Setup Succeeded` message.
9. Close the message and use `zotero` as usual.  

---
## Troubleshooting
0. Cannot open the InfiniCLOUD sign-up page  
* [ ] `InfiniCLOUD` is a Japanese cloud drive. A VPN may occasionally be needed, but in most cases you can connect directly.  

<br>

1. `Server verification failed`
* [ ] Carefully check the connection ID and password. The connection ID is neither your `InfiniCLOUD` user ID nor your `zotero` ID.
* [ ] Follow steps `4.` and `7.` exactly.
* [ ] Check whether you clicked `Reissue` again and reset the connection password.  

<br>

2. Server verification succeeds, but a red `!` appears next to sync in the upper-right corner of the `zotero` home page and files do not sync.
* [ ] If server verification succeeds but `zotero` still cannot sync files to the cloud, the WebDAV configuration is not the problem.  
Check your network connection. You can sync files from China without an accelerator!  

<br>

3. Server verification succeeds and `zotero` syncs files to the cloud, but other devices cannot view or download them.
* [ ] The problem is on the `other device`. Check the `sync settings` on the device that cannot view or download cloud files.  
* [ ] Follow the same steps in `Configure WebDAV` above.
---
## Zotero plugins
### Download Zotero plugins
1. In the `zotero` home page, find and click `Tools - Plugins`.
2. Use the [Zotero plugins directory](https://www.zotero.org/support/plugins) below to download a plugin.

### Install and use a plugin
1. In the `zotero` home page, find and click `Tools - Plugins`.
2. Click the `gear` icon to the right of `Manage Your Plugins`.
3. Select `Install Plugin From File`.
4. Find the downloaded `..plugin.xpi` file and click `Open`.

### Configure plugins
* [x] Plugin settings can be found and adjusted under `Edit - Settings` in the upper-left of the `zotero` home page.
---
