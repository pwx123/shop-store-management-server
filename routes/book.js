const express = require('express');
const router = express.Router();
const bookListController = require('../controllers/bookListController')

// 获取图书列表
router.post('/getBookList', bookListController.getBookList);
// 删除列表中的书籍
router.post('/deleteBooks', bookListController.deleteBooks);
// 获取所有图书分类
router.post('/getAllClassify', bookListController.getAllClassify);
// 删除分类
router.post('/deleteClassify', bookListController.deleteClassify);

module.exports = router;