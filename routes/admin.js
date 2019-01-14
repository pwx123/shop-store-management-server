const express = require('express');
const nodeRSA = require('node-rsa');
const router = express.Router();
const resUtils = require('./../utils/resUtils');
const connectionQuery = require('./../utils/utils').connectionQuery;

const rsaKey = new nodeRSA({b: 512});
let publicKey = rsaKey.exportKey('public');
let privateKey = rsaKey.exportKey('private');
// 登陆
router.post('/login', (req, res, next) => {
  let name = req.body.name;
  let pwd = req.body.pwd;
  let sql = 'SELECT * FROM admin_user WHERE name=?';
  let sqlParams = [name];
  connectionQuery(sql, sqlParams)
    .then(result => {
      if (result.length === 0) {
        res.json(resUtils.resMsg(600));
        return;
      }
      if (pwd === result[0].pwd) {
        res.json(resUtils.resSuccess());
      } else {
        res.json(resUtils.resMsg(601));
      }
    })
    .catch(error => {
      res.json(resUtils.resMsg(error));
    })
});

// 注册
router.post('/register', (req, res, next) => {
  let name = req.body.name;
  let pwd = req.body.pwd;
  let pwdRep = req.body.pwdRep;
  if (pwd !== pwdRep) {
    res.json(resUtils.resMsg(603));
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
      let sqlParams = [name, pwd];
      return connectionQuery(sql, sqlParams);
    })
    .then(() => {
      res.json(resUtils.resSuccess());
    })
    .catch(error => {
      res.json(resUtils.resMsg(error));
    })
})
module.exports = router;