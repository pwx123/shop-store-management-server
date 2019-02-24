const express = require('express');
const router = express.Router();
const resMsg = require('./../utils/utils').resMsg;
const connectionQuery = require('./../utils/utils').connectionQuery;
const paginationData = require('./../utils/utils').paginationData;
const hasEmpty = require('./../utils/utils').hasEmpty;
const splitSql = require('./../utils/utils').splitSql;
const splitLikeSql = require('./../utils/utils').splitLikeSql;
const logger = require('./../utils/log4j');

router.post('/getBookList', (req, res, next) => {
  try {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      name,
      author,
      press
    } = req.body;
    if (hasEmpty(pageSize, pageNumber, startTime, endTime)) {
      res.json(resMsg(9001));
      return false;
    }
    let sql = `SELECT SQL_CALC_FOUND_ROWS * FROM book_list WHERE createAt >= ? AND createAt <= ?`;
    sql += splitLikeSql({
      name,
      author,
      press
    }, false);
    sql += `LIMIT ?,?;SELECT FOUND_ROWS() AS total`;
    let sqlParams = [startTime, endTime, (pageNumber - 1) * pageSize, pageSize];
    connectionQuery(sql, sqlParams)
      .then(result => {
        res.json(resMsg(200, paginationData(result, pageSize, pageNumber)));
      })
      .catch(error => {
        logger.error(error);
        res.json(resMsg());
      })
  } catch (error) {
    logger.error(error);
    res.json(resMsg());
  }
});
module.exports = router;