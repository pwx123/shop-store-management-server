# 项目配置

## 开发依赖

- `Mysql` 数据库
- `Redis` 数据库
- `Apache` 或 `Nginx` 服务器 （存放图片等静态资源）

## 配置信息

- `sql` 文件夹下为数据库库名以及库表结构，包含数据。
- `config/dbConnect.js` 为数据库连接文件
- `config/redisConnect.js` 为 `Redis` 连接文件
- `config/uploadConfig.js` 为文件操作的路径信息，所有上传或下载的文件，都是存储在 `Apache` 服务器路径下的。比如上传图书照片，服务器接受照片，然后存到 `Apache` 的 `/images/book/` 路径下，然后将图片链接 `http://127.0.0.1/image/book/x.jpg` 写入数据库，前端页面就可正常访问。

## 资源文件

资源文件见 [链接](https://github.com/pwx123/shop-store-management-server/tree/master/resource), 复制到 `Apache` 服务器根目录下即可。