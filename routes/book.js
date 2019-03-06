const express = require('express');
const router = express.Router();
const bookListController = require('../controllers/bookListController')

// 获取图书列表
router.post('/getBookList', bookListController.getBookList);
// 删除列表中的书籍
router.post('/deleteBooks', bookListController.deleteBooks);

module.exports = router;