const nodeRSA = require("node-rsa");

let rsaKey = new nodeRSA({b: 512});
rsaKey.setOptions({encryptionScheme: "pkcs1"});

module.exports = rsaKey;

