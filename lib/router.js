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
    // TODO: process and extract variables, if any

    this.routeLibrary[verb][url] = {
      callback: callback
    };
  };
});

Router.prototype.route = function() {
  return (req, res) => {
    var pathname = urlParser.getPathname(req.url);

    // req.url contains query string
    if (req.url.indexOf('?') > -1) {
      var urlQuery = urlParser.getQuery(req.url);
      var routeFunction = this.routeLibrary[req.method][pathname]['callback'] || this.routeLibrary.FourOhFour;
      routeFunction(req, res, urlQuery);
    }

    // req.url contains parameters
    else if (this.routeLibrary[req.method][pathname]['param']) {
      var urlParam = urlParser.getParam(req.url);
      var routeFunction = this.routeLibrary[req.method][pathname]['callback'] || this.routeLibrary.FourOhFour;
      routeFunction(req, res, urlParam);
    }

    // normal routing
    else {
      var routeFunction = this.routeLibrary[req.method][pathname]['callback'] || this.routeLibrary.FourOhFour;
      routeFunction(req, res);
    }
  };
};
