const urlParser = require(__dirname + '/url_parser');

var Router = module.exports = exports = function() {
  this.routeLibrary = {
    'GET': {},
    'POST': {},
    'PUT': {},
    'PATCH': {},
    'DELETE': {},
    'FourOhFour': function(req, res) {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({msg: 'page not found'}));
      return res.end();
    }
  };
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(function(verb) {
  Router.prototype[verb.toLowerCase()] = function(url, callback) {
    var pathname = urlParser.getPathname(url);
    var params = urlParser.readParam(url);
    this.routeLibrary[verb][pathname] = {
      callback: callback,
      param: params,
      query: Boolean(url.indexOf('?') + 1)
    };
  };
});

Router.prototype.route = function() {
  return (req, res) => {
    var routingPoint = this.routeLibrary[req.method][urlParser.getPathname(req.url)];

    // call 404 directly if routingPoint doesn't exist
    if (!routingPoint) return this.routeLibrary.FourOhFour(req, res);

    // req.url contains parameters
    if (routingPoint.param.length) {
      var paramMatch = urlParser.matchParam(req.url, routingPoint.param);
      console.log(paramMatch);
      return routingPoint.callback(req, res, paramMatch);
    }

    // req.url contains query string (currently allows 1 query only)
    if (routingPoint.query) {
      var urlQuery = urlParser.getQuery(req.url);
      return routingPoint.callback(req, res, urlQuery);
    }

    // normal routing
    routingPoint.callback(req, res);
  };
};
