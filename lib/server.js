const http = require('http');

var server;
module.exports = exports = (routes, port) => {
  var port = port || 3000;

  return http.createServer(routes)
    .listen(port, () => {
      console.log('server up on port ' + port);
    });
};
