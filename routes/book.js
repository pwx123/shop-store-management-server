const express = require('express');
const router = express.Router();
const bookListController = require('../controllers/bookListController')

// 获取图书列表
router.post('/getBookList', bookListController.getBookList);
// 删除列表中的图书
router.post('/deleteBooks', bookListController.deleteBooks);
// 获取所有图书分类
router.post('/getAllClassify', bookListController.getAllClassify);
// 更新图书
router.post('/insertBook', bookListController.insertBook);
// 更新图书
router.post('/updateBook', bookListController.updateBook);
// 批量上传图书
router.post('/uploadExcel', bookListController.uploadExcel);
// 下载上传模板
router.post('/downloadBookTemplate', bookListController.downloadBookTemplate);
// 删除分类
router.post('/deleteClassify', bookListController.deleteClassify);
// 新增分类
router.post('/addClassify', bookListController.addClassify);
module.exports = router;