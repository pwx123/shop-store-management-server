var mysql = require("mysql");
var axios = require("axios");
var Decimal = require("decimal.js");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shop_store_management"
});
connection.connect();

axios.defaults.baseURL = "http://127.0.0.1:3000";

class autoCreateOrder {
  constructor(option) {
    this.orderInfo = {
      orderId: "",
      userId: "",
      userName: "",
      status: "",
      orderNum: "",
      orderMoney: "",
      deliveryMoney: "",
      totalMoney: "",
      deliveryId: null,
      deliveryOrderId: null,
      deliveryAddressId: "",
      orders: ""
    };
    setInterval(() => {
      this.init();
    }, option.time);
  }

  /**
   * 初始化
   *
   * @memberof autoCreateOrder
   */
  async init() {
    this.orderInfo = {
      orderId: "",
      userId: "",
      userName: "",
      status: "",
      orderNum: "",
      orderMoney: "",
      deliveryMoney: "",
      totalMoney: "",
      deliveryId: null,
      deliveryOrderId: null,
      deliveryAddressId: "",
      orders: ""
    };
    await this.getUserInfo();
    this.getStatus();
    await this.getOrderMoney();
    await this.getDeliveryInfo();
    this.sendHttp();
  }

  /**
   * 获取 userId userName orderId
   *
   * @memberof autoCreateOrder
   */
  async getUserInfo() {
    let sql = "select * from shop_user_list";
    let result = await this.connectionQuery(sql);
    let val = result[autoCreateOrder.getRandom(0, result.length - 1)];
    this.orderInfo.userId = val.id;
    this.orderInfo.userName = val.name;
    let str = "D";
    str += autoCreateOrder.padLeft(9, val.id);
    str += autoCreateOrder.getDataStr();
    this.orderInfo.orderId = str;
  }

  /**
   * 获取 status
   *
   * @memberof autoCreateOrder
   */
  getStatus() {
    this.orderInfo.status = autoCreateOrder.getRandom(0, 10) > 8 ? 6 : 1;
  }

  /**
   * 获取 orderNum orderMoney deliveryMoney totalMoney
   *
   * @memberof autoCreateOrder
   */
  async getOrderMoney() {
    this.orderInfo.orderNum = autoCreateOrder.getRandom(1, 5);
    let orderMoney = 0;
    let orders = [];
    let deliveryMoney = autoCreateOrder.getRandom(0, 6);
    let sql = "select * from shop_book_list";
    let bookData = await this.connectionQuery(sql);
    for (let i = 0; i < this.orderInfo.orderNum; i++) {
      let subOrder = {};
      let val = bookData[autoCreateOrder.getRandom(0, bookData.length - 1)];
      subOrder.bookId = val.id;
      subOrder.bookName = val.name;
      subOrder.bookTitle = val.title;
      subOrder.bookNum = autoCreateOrder.getRandom(1, 6);
      subOrder.bookPrice = val.price;
      subOrder.bookSalePrice = val.salePrice;
      subOrder.bookImageUrl = val.imageUrl;
      orderMoney = new Decimal(orderMoney).add(new Decimal(val.salePrice).mul(new Decimal(subOrder.bookNum))).toNumber();
      orders.push(subOrder);
    }
    this.orderInfo.orderMoney = orderMoney;
    this.orderInfo.deliveryMoney = deliveryMoney;
    this.orderInfo.totalMoney = new Decimal(orderMoney).add(new Decimal(deliveryMoney)).toNumber();
    this.orderInfo.orders = JSON.stringify(orders);
  }

  /**
   *  获取物流信息
   *
   * @memberof autoCreateOrder
   */
  async getDeliveryInfo() {
    if (this.orderInfo.status === 6) {
      let sql = "select * from shop_delivery_company";
      let deliveryCompany = await this.connectionQuery(sql);
      this.orderInfo.deliveryId = deliveryCompany[autoCreateOrder.getRandom(0, deliveryCompany.length - 1)].id;
      this.orderInfo.deliveryOrderId = autoCreateOrder.getRandomNumStr(11);
      this.orderInfo.deliveryAt = new Date();
    }
    let sql = "select * from shop_user_delivery where userId=?";
    let sqlParams = [this.orderInfo.userId];
    let deliveryAddress = await this.connectionQuery(sql, sqlParams);
    this.orderInfo.deliveryAddressId = deliveryAddress[autoCreateOrder.getRandom(0, deliveryAddress.length - 1)].id;
  }

  /**
   * 生成随机数
   *
   * @param {Number} lower 最小值
   * @param {Number} upper 最大值
   * @returns
   * @memberof autoCreateOrder
   */
  static getRandom(lower, upper) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
  }

  /**
   * 生成随机数字字段
   *
   * @param {String} len 长度
   * @returns
   * @memberof autoCreateOrder
   */
  static getRandomNumStr(len) {
    let str = "";
    for (let i = 0; i < len; i++) {
      str += autoCreateOrder.getRandom(0, 9);
    }
    return str;
  }

  /**
   * 获取 yyyyMMddHHmmss 时间
   *
   * @memberof autoCreateOrder
   */
  static getDataStr() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = autoCreateOrder.padLeft(2, date.getDate());
    let hour = autoCreateOrder.padLeft(2, date.getHours());
    let minute = autoCreateOrder.padLeft(2, date.getMinutes());
    let second = autoCreateOrder.padLeft(2, date.getSeconds());
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  /**
   * 数字补0
   *
   * @param {Number} len 补0长度
   * @param {Number} num 需要补0的字段
   * @returns
   * @memberof autoCreateOrder
   */
  static padLeft(len, num) {
    return new Array(len - (num + "").length + 1).join("0") + num;
  }

  sendHttp() {
    axios.post("/api/getOrder", this.orderInfo)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * 数据库 Promise
   *
   * @param {*} sql
   * @param {*} sqlParams
   * @returns Promise
   * @memberof autoCreateOrder
   */
  connectionQuery(sql, sqlParams) {
    return new Promise((resolve, reject) => {
      connection.query(sql, sqlParams, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

let option = {
  time: 1000 * 1
};

new autoCreateOrder(option);