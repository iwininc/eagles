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
      param: params
    };
  };
});

Router.prototype.route = function() {
  return (req, res) => {
    var pathname = urlParser.getPathname(req.url);
    var routeFunction = this.routeLibrary[req.method][pathname]['callback'] || this.routeLibrary.FourOhFour;

    var variables = this.routeLibrary[req.method][pathname]['param'];

    // req.url contains parameters
    if (variables.length) {
      var paramMatch = urlParser.matchParam(req.url, variables);
      console.log(paramMatch);
      return routeFunction(req, res, paramMatch);
    }

    // req.url contains query string (currently allows 1 query only)
    if (req.url.indexOf('?') > -1) {
      var urlQuery = urlParser.getQuery(req.url);
      return routeFunction(req, res, urlQuery);
    }

    // normal routing
    routeFunction(req, res);
  };
};
