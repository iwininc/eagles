const server = require(__dirname + '/lib/server');
const Router = require(__dirname + '/lib/router');

exports.Router = Router;
// user: var router = new eagle.Router();

// set up routes

exports.createServer = server;
// user: var server = eagles.createServer(3000, router.route());
