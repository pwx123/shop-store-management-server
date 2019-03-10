// 编码
const ENCODING = 'utf-8';
// 服务器目录
const SERVER_DIR = 'D:/wampServer/www';
// 图书下载模板文件名
const BOOK_NAME = '批量上传图书.xlsx';
// 图书下载模板位置 
const BOOK_TEMPLATE = '/template/';
// temp临时目录
const TEMP = '/temp';
// 分类对照表excel文件名
const CLASSIFY_EXEL_NAME = '分类对照表.xlsx';
// 压缩文件名
const ZIP_NAME = '上传模板.zip';
// 是否保存拓展
const KEEP_EXTENSIONS = true;
// 最大上传大小
const MAX_FILESIZE = 1024 * 1024 * 20;
// 服务器URL
const SERVER_URL = 'http://127.0.0.1';
// 图书图片地址
const BOOK_IMG_URL = '/images/book/';

module.exports = {
  ENCODING,
  SERVER_DIR,
  KEEP_EXTENSIONS,
  MAX_FILESIZE,
  SERVER_URL,
  BOOK_NAME,
  BOOK_TEMPLATE,
  CLASSIFY_EXEL_NAME,
  ZIP_NAME,
  BOOK_IMG_URL,
  TEMP
}