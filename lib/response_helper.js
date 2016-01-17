var resHelper = module.exports = exports = {};

var resCache = {
  statusCode: 200,
  contentType: 'text/plain'
};

var writeResHead = function(res) {
  console.log(resCache);
  return res.writeHead(resCache.statusCode, {'Content-Type': resCache.contentType});
};

resHelper.status = function(res, code, next) {
  resCache.statusCode = code;
  if (!next) writeResHead(res);
  return resHelper;
};

resHelper.contentType = function(res, type, next) {
  var contentTypeShortcut = {
    'json': 'application/json',
    'html': 'text/html',
    'plain': 'text/plain'
  };

  resCache.contentType = (contentTypeShortcut.hasOwnProperty(type)) ? contentTypeShortcut[type] : type;
  if (!next) writeResHead(res);
  return resHelper;
};

resHelper.resHead = function(res, code, type) {
  this.status(res, code, true);
  this.contentType(res, type, true);
  writeResHead(res);
  return resHelper;
};

resHelper.resBody = function(res, body) {
  res.write(body);
  return resHelper;
};

resHelper.sendJSON = function(res, obj) {
  // stringify JSON then send
};

resHelper.sendFile = function(res, filepath) {
  // pipe filestream to res
};

resHelper.send = function(res, body) {
  // auto detect, sets status = 200 and Content-Type as follows:
  // obj/array -> JSON
  // string -> html
  // buffer -> octet-stream
  // filepath?? maybe
};
