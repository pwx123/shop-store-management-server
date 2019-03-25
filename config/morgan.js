/* 请求头打印 */
const morgan = require("morgan");

morgan.token("requestParameters", function (req, res) {
  return JSON.stringify(req.query) || "-";
});
morgan.token("requestBody", function (req, res) {
  return JSON.stringify(req.body) || "-";
});

morgan.format("live-api", function developmentFormatLine(tokens, req, res) {
  let status = headersSent(res) ?
    res.statusCode :
    undefined;

  let color = status >= 500 ? 31 // red
    :
    status >= 400 ? 33 // yellow
      :
      status >= 300 ? 36 // cyan
        :
        status >= 200 ? 32 // green
          :
          0; // no color
  let fn = developmentFormatLine[color];

  if (!fn) {
    fn = developmentFormatLine[color] = morgan.compile("\x1b[0m:method :url \x1b[" +
      color + "m:status\x1b[0m :response-time ms - :res[content-length]\x1b[0m :requestParameters :requestBody");
  }
  return fn(tokens, req, res);
});

function headersSent(res) {
  return typeof res.headersSent !== "boolean" ?
    Boolean(res._header) :
    res.headersSent;
}

module.exports = morgan;