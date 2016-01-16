const http = require('http');

var server;
var createServer = (port, routes) => {
  var port = port || 3000;

  return http.createServer(routes)
    .listen(port, () => {
      console.log('server up on port ' + port);
    });
};
