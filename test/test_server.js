const eagles = require(__dirname + '/../index');

var router = new eagles.Router();
router.get('/hello', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('yooooo');
  res.end();
});

eagles.createServer(router.route(), 3000);
