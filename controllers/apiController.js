const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const shopOrderModel = require("../modules/shopOrderModel");

class apiController {
  /**
   * 对外获取新订单接口
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getOrder(req, res, next) {
    try {
      let {
        orders,
        ...params
      } = req.body;
      let result = await shopOrderModel.createOrder(params);
      let subOrderArr = JSON.parse(orders);
      for (let i = 0, len = subOrderArr.length; i < len; i++) {
        subOrderArr[i].mainOrderId = result.id;
      }
      await shopOrderModel.createSubOrder(subOrderArr);
      for (let key of Object.keys(req.app.io.sockets.sockets)) {
        let socket = req.app.io.sockets.sockets[key];
        let sessionID = socket.request.sessionID;
        socket.request.sessionStore.client.get(sessionID, function (err, result) {
          if (err) {
            logger.error(err);
          } else {
            if (result) {
              if (params.status === 1) {
                socket.emit("hasNewOrder", resMsg(200));
              } else if (params.status === 6) {
                socket.emit("hasNewRefundOrder", resMsg(200));
              }
            } else {
              socket.emit("err", resMsg(401));
              socket.disconnect(true);
            }
          }
        });
      }
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * orderNotify
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async orderNotify(req, res, next) {
    try {
      let {type} = req.body;
      for (let key of Object.keys(req.app.io.sockets.sockets)) {
        let socket = req.app.io.sockets.sockets[key];
        let sessionID = socket.request.sessionID;
        socket.request.sessionStore.client.get(sessionID, function (err, result) {
          if (err) {
            logger.error(err);
          } else {
            if (result) {
              if (type === 1) {
                socket.emit("hasNewOrder", resMsg(200));
              } else if (type === 6) {
                socket.emit("hasNewRefundOrder", resMsg(200));
              }
            } else {
              socket.emit("err", resMsg(401));
              socket.disconnect(true);
            }
          }
        });
      }
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = apiController;
