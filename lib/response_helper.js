const fs = require('fs');

var resHelper = module.exports = exports = {};

/* ===============================================
        METHODS FOR WRITING RESPONSE HEADER
=============================================== */

// starts with default values, caches in obj whenever user specifies a field
var resDefault = {
  statusCode: 200,
  contentType: 'text/plain'
};
var resCache = Object.assign({}, resDefault);

var writeResHead = function(res, useDefault) {
  var settings = (useDefault)? resDefault : resCache;
  console.log(settings);
  return res.writeHead(settings.statusCode, {'Content-Type': settings.contentType});
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
  resCache = Object.assign({}, resDefault);
  this.status(res, code, true);
  this.contentType(res, type, true);
  writeResHead(res);
  return resHelper;
};


/* ===============================================
        METHODS FOR WRITING RESPONSE BODY
=============================================== */

resHelper.resBody = function(res, body) {
  res.write(body);
  return resHelper;
};

// send back the file at specified filepath as response
// status code and content-type uses default unless overwritten by head methods
resHelper.sendFile = function(res, filepath) {
  writeResHead(res);
  console.log('Reading file from: ' + filepath);
  fs.createReadStream(filepath).pipe(res);
};

resHelper.sendJSON = function(res, input) {
  var writeJSON = function(str) {
    resHelper.contentType(res, 'json');
    resHelper.resBody(res, str);
    res.end();
  };

  // check whether it's a filepath
  if (typeof input === 'string') {
    fs.stat(input, function(err, stats) {
      if (err || !stats.isFile()) {
        return writeJSON(JSON.stringify(input));
      }
      resHelper.sendFile(res, input);
    });
  } else {
    writeJSON(JSON.stringify(input));
  }
};
