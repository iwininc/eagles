const eagles = require(__dirname + '/../index');

var router = new eagles.Router();

router.get('/hello', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('yooooo');
  res.end();
});

router.get('/hello2', function(req, res) {
  eagles.status(res, 200);
  eagles.contentType(res, 'plain');
  eagles.resBody(res, 'looooo');
  res.end();
});

router.get('/hello2.5', function(req, res) {
  eagles.status(res, 200).contentType(res, 'plain');
  eagles.resBody(res, 'world');
  res.end();
});

router.get('/hello3', function(req, res) {
  eagles.resHead(res, 200, 'plain');
  eagles.resBody(res, 'polo');
  res.end();
});

router.get('/sayhi', function(req, res, query) {
  eagles.resHead(res, 200, 'plain');
  eagles.resBody(res, 'oh hi ' + query.name);
  res.end();
});

router.get('/greet/:time/:name', function(req, res, param) {
  eagles.resHead(res, 200, 'plain');
  eagles.resBody(res, 'top of the ' + param.time + ' to you, ' + param.name);
  res.end();
});

router.get('/read', function(req, res) {
  eagles.resHead(res, 200, 'json');
  eagles.sendFile(res, __dirname + '/test_data/random.json');
});

router.get('/readobj', function(req, res) {
  eagles.sendJSON(res, {msg: 'hello from the other side'});
});

router.get('/readJSON', function(req, res) {
  eagles.sendJSON(res,  __dirname + '/test_data/random.json');
});


var server = eagles.createServer(router.route(), 3000);
