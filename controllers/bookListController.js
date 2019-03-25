const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const nodeXlsx = require("node-xlsx");
const nodeZip = require("archiver");
const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const bookListModel = require("../modules/bookListModel");
const shopStockRecordModel = require("../modules/shopStockRecordModel");
const uploadConfig = require("./../config/uploadConfig");

class bookListController {
  /**
   * 获取图书列表
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof bookListController
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
   * @memberof bookListController
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

  /**
   * 更新图书
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof bookListController
   */
  static async updateBook(req, res, next) {
    let form = new formidable.IncomingForm();
    form.encoding = uploadConfig.ENCODING;
    form.uploadDir = uploadConfig.SERVER_DIR + uploadConfig.BOOK_IMG_URL;
    form.keepExtensions = uploadConfig.KEEP_EXTENSIONS;
    form.maxFileSize = uploadConfig.MAX_FILESIZE;
    form.parse(req, async (error, fields, files) => {
      if (error) {
        logger.error(error);
        res.json(resMsg());
        return false;
      }
      let data = fields;
      let {
        id,
        name,
        author,
        press,
        title,
        description,
        price,
        salePrice,
        isSell
      } = data;
      if (hasEmpty(id, name, author, press, title, description, price, salePrice, isSell)) {
        res.json(resMsg(9001));
        return false;
      }
      if (files.imageUrl) {
        let extname = path.extname(files.imageUrl.name);
        let newPath = uploadConfig.SERVER_DIR + uploadConfig.BOOK_IMG_URL + data.id + extname.toLocaleLowerCase();
        fs.renameSync(files.imageUrl.path, newPath);
        data.imageUrl = uploadConfig.SERVER_URL + uploadConfig.BOOK_IMG_URL + data.id + extname.toLocaleLowerCase();
      } else {
        delete data.imageUrl;
      }
      await bookListModel.updateBook(data);
      res.json(resMsg(200));
    });
    form.on("error", function (error) {
      logger.error(error);
      res.json(resMsg());
      return false;
    });
  }

  /**
   * 新增图书
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof bookListController
   */
  static async insertBook(req, res, next) {
    let form = new formidable.IncomingForm();
    form.encoding = uploadConfig.ENCODING;
    form.uploadDir = uploadConfig.SERVER_DIR + uploadConfig.BOOK_IMG_URL;
    form.keepExtensions = uploadConfig.KEEP_EXTENSIONS;
    form.maxFileSize = uploadConfig.MAX_FILESIZE;
    form.parse(req, async (error, fields, files) => {
      if (error) {
        logger.error(error);
        res.json(resMsg());
        return false;
      }
      let data = fields;
      let {
        name,
        author,
        press,
        title,
        description,
        stock,
        stockPrice,
        price,
        salePrice,
        isSell
      } = data;
      if (hasEmpty(name, author, press, title, description, stock, stockPrice, price, salePrice, isSell)) {
        res.json(resMsg(9001));
        return false;
      }
      delete data.imageUrl;
      let result = await bookListModel.insertBook([data]);
      let imageUrl = "";
      if (files.imageUrl) {
        let extname = path.extname(files.imageUrl.name);
        let newPath = uploadConfig.SERVER_DIR + uploadConfig.BOOK_IMG_URL + result[0].id + extname.toLocaleLowerCase();
        fs.renameSync(files.imageUrl.path, newPath);
        imageUrl = uploadConfig.SERVER_URL + uploadConfig.BOOK_IMG_URL + result[0].id + extname.toLocaleLowerCase();
        let updateObj = {
          id: result[0].id,
          imageUrl
        };
        await bookListModel.updateBook(updateObj);
      }
      let stockObj = {
        bookId: result[0].id,
        bookName: result[0].name,
        stockNum: stock,
        stockPrice,
        type: 0,
        remark: "新进图书：新进图书"
      };
      await shopStockRecordModel.createStockRecord([stockObj]);
      res.json(resMsg(200));
    });
    form.on("error", function (error) {
      logger.error(error);
      res.json(resMsg());
      return false;
    });
  }

  /**
   * 修改库存
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof bookListController
   */
  static async updateBookStock(req, res, next) {
    try {
      if (hasEmpty(req.body.id, req.body.changeStock)) {
        res.json(resMsg(9001));
        return false;
      }
      await bookListModel.updateBook({
        id: req.body.id,
        stock: req.body.changeStock
      });
      let stockObj = {
        bookId: req.body.id,
        bookName: req.body.name,
        stockNum: req.body.changeStock
      };
      if (req.body.type === 0) {
        stockObj.stockPrice = req.body.stockPrice;
        stockObj.type = 1;
        stockObj.remark = "新进图书：增加库存";
      } else {
        stockObj.type = 2;
        stockObj.remark = "删除库存：" + req.body.remark;
      }
      await shopStockRecordModel.createStockRecord([stockObj]);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 上传excel
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof bookListController
   */
  static async uploadExcel(req, res, next) {
    let excelUrl = uploadConfig.TEMP;
    let form = new formidable.IncomingForm();
    let map = {
      1: "A",
      2: "B",
      3: "C",
      4: "D",
      5: "E",
      6: "F",
      7: "G",
      8: "H",
      9: "I",
      10: "J",
      11: "K"
    };
    let dataMap = {
      0: "name",
      1: "author",
      2: "press",
      3: "isSell",
      4: "classify",
      5: "title",
      6: "description",
      7: "stock",
      8: "stockPrice",
      9: "price",
      10: "salePrice"
    };
    const DATA_LENGTH = Object.keys(dataMap).length;
    form.encoding = uploadConfig.ENCODING;
    form.uploadDir = uploadConfig.SERVER_DIR + excelUrl;
    form.keepExtensions = uploadConfig.KEEP_EXTENSIONS;
    form.maxFileSize = uploadConfig.MAX_FILESIZE;
    let errorMsg = "";
    form.parse(req, async (error, fields, files) => {
      if (error) {
        logger.error(error);
        res.json(resMsg());
        return false;
      }
      // 读取文件
      const excelData = nodeXlsx.parse(files.excel.path);
      // 删除文件
      fs.unlink(files.excel.path, (error) => {
        if (error) {
          logger.error(error);
        }
      });
      let optionData = excelData[0].data;
      let saveData = [];
      if (optionData.length > 1) {
        for (let i = 1, len = optionData.length; i < len; i++) {
          let data = optionData[i];
          let saveDataObj = {};
          for (let j = 0; j < DATA_LENGTH; j++) {
            let val = data[j];
            if (j === 3) {
              if (hasEmpty(val)) {
                errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据不能为空`;
                break;
              }
              if (val !== 1 && val !== 0) {
                errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据格式不正确，只能为 0 或 1`;
                break;
              }
            } else if (j === 4) {
              if (!hasEmpty(val) && !/^\d(,\d)*$/.test(val)) {
                errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据格式不正确，示例：'1' 或 '1,2,3'`;
                break;
              }
            } else if (j === 7) {
              if (hasEmpty(val)) {
                errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据不能为空`;
                break;
              }
              if (!/^\d+$/.test(val)) {
                errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据格式不正确，必须为大于0的数字`;
                break;
              }
            } else if (j === 8 || j === 9 || j === 10) {
              if (hasEmpty(val)) {
                errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据不能为空`;
                break;
              }
              if (!/^\d+(\.\d{0,2})?$/.test(val)) {
                errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据格式不正确，必须为大于0的数字，最多保留两位小数`;
                break;
              }
            } else if (hasEmpty(val)) {
              errorMsg = `第 <span style='color:#f56c6c'>${i + 1}</span> 行第 <span style='color:#f56c6c'>${map[j + 1]}</span> 列数据不能为空`;
              break;
            }
            saveDataObj[dataMap[j]] = val;
          }
          if (errorMsg) {
            break;
          }
          saveData.push(saveDataObj);
        }
        if (errorMsg) {
          logger.error(errorMsg);
          res.json({
            errorCode: 9999,
            errorMsg: errorMsg,
            data: ""
          });
          return false;
        } else {
          let result = await bookListModel.insertBook(saveData);
          let saveStockData = [];
          for (let i = 0, len = result.length; i < len; i++) {
            let item = result[i];
            let saveStockObj = {
              bookId: item.id,
              bookName: item.name,
              stockNum: item.stock,
              stockPrice: item.stockPrice,
              type: 0,
              remark: "新进图书：新进图书"
            };
            saveStockData.push(saveStockObj);
          }
          await shopStockRecordModel.createStockRecord(saveStockData);
          res.json(resMsg(200));
        }
      } else {
        logger.error("上传文件内容为空");
        res.json(resMsg(2001));
        return false;
      }
    });
    form.on("error", function (error) {
      logger.error(error);
      res.json(resMsg());
      return false;
    });
  }

  /**
   * 下载上传模板
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof bookListController
   */
  static async downloadBookTemplate(req, res, next) {
    let filePath = uploadConfig.SERVER_DIR + "/" + uploadConfig.ZIP_NAME;
    let classifyData = await bookListModel.getAllClassify();
    let name = uploadConfig.CLASSIFY_EXCEL_NAME;
    let zipName = uploadConfig.ZIP_NAME;
    let data = [
      ["id", "分类名"]
    ];
    for (var i = 0, len = classifyData.length; i < len; i++) {
      let temp = [];
      temp[0] = classifyData[i].id;
      temp[1] = classifyData[i].name;
      data.push(temp);
    }
    var buffer = nodeXlsx.build([{
      name,
      data
    }]);
    // 生成类别对照表excel
    fs.writeFile(uploadConfig.SERVER_DIR + uploadConfig.BOOK_TEMPLATE + "/" + name, buffer, (err) => {
      if (err) {
        logger.error(err);
        res.json(resMsg());
        return false;
      }
      // 压缩为zip
      let output = fs.createWriteStream(uploadConfig.SERVER_DIR + "/" + zipName);
      let archive = nodeZip("zip");
      archive.on("error", (err) => {
        logger.error(err);
        res.json(resMsg());
        return false;
      });
      archive.pipe(output);
      archive.directory(uploadConfig.SERVER_DIR + uploadConfig.BOOK_TEMPLATE, false);
      archive.finalize();
      output.on("close", () => {
        res.download(filePath);
      });
    });
  }

  /**
   * 获取所有分类信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof bookListController
   */
  static async getAllClassify(req, res, next) {
    try {
      let result = await bookListModel.getAllClassify();
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 删除分类信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof bookListController
   */
  static async deleteClassify(req, res, next) {
    try {
      if (hasEmpty(req.body.id)) {
        res.json(resMsg(9001));
        return false;
      }
      await bookListModel.deleteClassify(req.body.id);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 新增分类
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof bookListController
   */
  static async addClassify(req, res, next) {
    try {
      if (hasEmpty(req.body.classifyName)) {
        res.json(resMsg(9001));
        return false;
      }
      await bookListModel.addClassify(req.body.classifyName);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 批量修改图书上下架
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof bookListController
   */
  static async changeBookSellStatus(req, res, next) {
    try {
      if (hasEmpty(req.body.isSell, req.body.ids)) {
        res.json(resMsg(9001));
        return false;
      }
      await bookListModel.changeBookSellStatus(req.body.isSell, req.body.ids);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 分页获取进货记录
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof bookListController
   */
  static async getStockRecordList(req, res, next) {
    try {
      if (hasEmpty(req.body.pageSize, req.body.pageNumber, req.body.startTime, req.body.endTime)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopStockRecordModel.getStockRecordList(req.body);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = bookListController;