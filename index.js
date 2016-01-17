const server = require(__dirname + '/lib/server');
const Router = require(__dirname + '/lib/router');
const resHelper = require(__dirname + '/lib/response_helper');

exports.Router = Router;
// user: var router = new eagle.Router();

// set up routes

exports.createServer = server;
// user: var server = eagles.createServer(router.route(), 3000);

for (var prop in resHelper) {
  exports[prop] = resHelper[prop];
}
