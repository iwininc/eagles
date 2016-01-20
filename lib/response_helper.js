const fs = require('fs');

var resHelper = module.exports = exports = {};

/* ===============================================
        METHODS FOR WRITING RESPONSE HEADER
=============================================== */

var resDefault = {
  statusCode: 200,
  contentType: 'text/plain'
};
// starts with default values, caches in obj whenever user specifies a field, resets to default whenever .resHead() is called
var resCache = Object.assign({}, resDefault);

var writeResHead = function(res, useDefault) {
  var settings = (useDefault)? resDefault : resCache;
  return res.writeHead(settings.statusCode, {'Content-Type': settings.contentType});
};

resHelper.status = function(res, code, next) {
  resCache.statusCode = code;
  if (!next) writeResHead(res);
  return resHelper;
};

resHelper.contentType = function(res, type, next) {
  var contentTypeShortcut = {
    'plain': 'text/plain',
    'html': 'text/html',
    'xml': 'text/xml',
    'json': 'application/json',
    'octet': 'application/octet-stream',
    'form': 'multipart/form-data',
    'jpg': 'image/jpeg',
    'png': 'image/png'
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
  var readStream = fs.createReadStream(filepath);
  readStream.on('open', function() {
    readStream.pipe(res);
  });
  readStream.on('error', function(err) {
    console.log(err);
    res.end();
  });
};

// send back JSON with status code 200 and content-type 'application/json'
// if input is a filepath that points to a JSON, content of that file will be sent
resHelper.sendJSON = function(res, input) {
  resHelper.contentType(res, 'json');
  var writeJSON = function(str) {
    resHelper.resBody(res, str);
    res.end();
  };

  if (typeof input === 'string') {
    fs.stat(input, function(err, stats) {
      if (!err && input.endsWith('.json') && stats.isFile()) {
        return resHelper.sendFile(res, input);
      }
      // send back filepath if it's not a json file
      return writeJSON(JSON.stringify(input));
    });
  } else {
    writeJSON(JSON.stringify(input));
  }
};
