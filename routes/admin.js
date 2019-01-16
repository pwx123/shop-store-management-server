const express = require('express');
const router = express.Router();
const rsaKey = require('./../utils/rsa');
const resMsg = require('./../utils/utils').resMsg;
const connectionQuery = require('./../utils/utils').connectionQuery;

router.post('/login', (req, res, next) => {
  try {
    let name = req.body.name;
    let rsaPwd = decodeURI(req.body.rsaPwd);
    let decryptPwd = rsaKey.decrypt(rsaPwd, 'utf8');
    let sql = 'SELECT * FROM admin_user WHERE name=?';
    let sqlParams = [name];
    connectionQuery(sql, sqlParams)
      .then(result => {
        if (result.length === 0) {
          res.json(resMsg(600));
          return false;
        }
        if (pwd === result[0].pwd) {
          res.json(resMsg(200));
        } else {
          res.json(resMsg(601));
        }
      })
      .catch(error => {
        res.json(resMsg(error));
      })
  } catch (error) {
    console.log(error);
    res.json(resMsg(9999));
  }

});

// 注册
router.post('/register', (req, res, next) => {
  let name = req.body.name;
  let pwd = req.body.pwd;
  let pwdRep = req.body.pwdRep;
  if (pwd !== pwdRep) {
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
      let sqlParams = [name, pwd];
      return connectionQuery(sql, sqlParams);
    })
    .then(() => {
      res.json(resMsg(200));
    })
    .catch(error => {
      res.json(resMsg(error));
    })
})
module.exports = router;