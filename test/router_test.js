const expect = require('chai').expect;
const Router = require(__dirname + '/../lib/router');

describe('Router', () => {
  it('should be able to create a router with routes', () => {
    var router = new Router();
    expect(router).to.have.property('routeLibrary');
    expect(router.routeLibrary).to.be.an('object');
  });

  it('should be able to register a get request', () => {
    var router = new Router();
    var testReq = { method: 'GET', url: '/test' };
    var called = false;

    router.get('/test', function(req, res) {
      called = true;
      expect(req.method).to.eql('GET');
      expect(req.url).to.eql('/test');
      expect(res).to.eql(null);
    });
    router.route()(testReq, null);
    expect(called).to.eql(true);
  });

  it('should be able to register a post request', () => {
    var router = new Router();
    var testReq = { method: 'POST', url: '/test' };
    var called = false;

    router.post('/test', function(req, res) {
      called = true;
      expect(req.method).to.eql('POST');
      expect(req.url).to.eql('/test');
      expect(res).to.eql(null);
    });
    router.route()(testReq, null);
    expect(called).to.eql(true);
  });

  it('should handle a 404', () => {
    var called = 0;
    var testRes = {
      writeHead: function(statusCode, headers) {
        expect(statusCode).to.eql(404);
        expect(headers['Content-Type']).to.eql('application/json');
        called++;
      },
      write: function(msg) {
        expect(msg).to.eql('{"msg":"page not found"}');
        called++;
      },
      end: function() {
        called++;
      }
    };

    var router = new Router();
    router.route()({ method: 'GET', url: '/doesnotexist' }, testRes);
    expect(called).to.eql(3);
  });

  it('should be able to register a route with parameters and pass to callback', () => {
    var router = new Router();
    var testReq = { method: 'GET', url: '/greet/morning/world' };
    var called = false;

    router.get('/greet/:time/:name', function(req, res, param) {
      called = true;
      expect(param.time).to.eql('morning');
      expect(param.name).to.eql('world');
    });

    router.route()(testReq, null);
    expect(called).to.eql(true);
  });

  it('should route URL containing query string and pass to callback', () => {
    var router = new Router();
    var testReq = { method: 'GET', url: '/greet?name=world' };
    var called = false;

    router.get('/greet?', function(req, res, query) {
      called = true;
      expect(query.name).to.eql('world');
    });

    router.route()(testReq, null);
    expect(called).to.eql(true);
  });
});
