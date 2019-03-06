const logger = require('../config/log4j');
const resMsg = require('../utils/utils').resMsg;
const hasEmpty = require('../utils/utils').hasEmpty;
const bookListModel = require('../modules/bookListModel');

class adminUserController {
  /**
   * 获取图书列表
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof adminUserController
   */
  static async getBookList(req, res, next) {
    try {
      if (hasEmpty(req.body.pageSize, req.body.pageNumber, req.body.startTime, req.body.endTime)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await bookListModel.getBookList(req.body);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 删除图书
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof adminUserController
   */
  static async deleteBooks(req, res, next) {
    try {
      let {
        ids
      } = req.body;
      if (hasEmpty(ids)) {
        res.json(resMsg(9001));
        return false;
      }
      await bookListModel.deleteBooks(ids);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = adminUserController;