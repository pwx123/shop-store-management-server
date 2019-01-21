const express = require('express');
const router = express.Router();
const rsaKey = require('./../utils/rsa');
const resMsg = require('./../utils/utils').resMsg;
const connectionQuery = require('./../utils/utils').connectionQuery;
const logger = require('./../utils/log4j');

router.post('/login', (req, res, next) => {
  try {
    let name = req.body.name;
    let pwd = decodeURI(req.body.pwd);
    let decryptPwd = rsaKey.decrypt(pwd, 'utf8');
    let sql = 'SELECT * FROM admin_user WHERE name=?';
    let sqlParams = [name];
    connectionQuery(sql, sqlParams)
      .then(result => {
        if (result.length === 0) {
          res.json(resMsg(600));
          return false;
        }
        if (decryptPwd === result[0].pwd) {
          req.session.user = result[0].name;
          res.json(resMsg(200));
        } else {
          res.json(resMsg(601));
        }
      })
      .catch(error => {
        logger.warn(error);
        res.json(resMsg(error));
      })
  } catch (error) {
    res.json(resMsg(9999));
  }
});

// 注册
router.post('/register', (req, res, next) => {
  try {
    let name = req.body.name;
    let pwd = decodeURI(req.body.pwd);
    let repPwd = decodeURI(req.body.repPwd)
    let decryptPwd = rsaKey.decrypt(pwd, 'utf8');
    let decryptRepPwd = rsaKey.decrypt(repPwd, 'utf8');
    if (decryptRepPwd !== decryptPwd) {
      res.json(resMsg(603));
      return false;
    }
    let sql = 'SELECT * FROM admin_user WHERE name=?';
    let sqlParams = [name];
    connectionQuery(sql, sqlParams)
      .then(result => {
        if (result.length !== 0) {
          return Promise.reject(602);
        }
        let sql = 'INSERT INTO admin_user(name,pwd) VALUES(?,?)';
        let sqlParams = [name, decryptPwd];
        return connectionQuery(sql, sqlParams);
      })
      .then(() => {
        res.json(resMsg(200));
      })
      .catch(error => {
        res.json(resMsg(error));
      })
  } catch (error) {
    logger.warn(error);
    res.json(resMsg(9999));
  }

})
module.exports = router;