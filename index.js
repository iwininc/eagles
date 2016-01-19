const server = require(__dirname + '/lib/server');
const Router = require(__dirname + '/lib/router');
const resHelper = require(__dirname + '/lib/response_helper');

exports.Router = Router;
exports.createServer = server;

for (var prop in resHelper) {
  exports[prop] = resHelper[prop];
}
