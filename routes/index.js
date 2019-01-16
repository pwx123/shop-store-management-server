const express = require('express');
const router = express.Router();
const rsaKey = require('./../utils/rsa');
const resMsg = require('./../utils/utils').resMsg;

router.post('/getPublicKey', (req, res, next) => {
  let publicKey = rsaKey.exportKey('public');
  res.json(resMsg(200, publicKey));
})
module.exports = router;