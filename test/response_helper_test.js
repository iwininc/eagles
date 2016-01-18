const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const fs = require('fs');

const eagles = require(__dirname + '/../index');

describe('Response helper', () => {
  beforeEach(() => {
    this.router = new eagles.Router();
    this.server = eagles.createServer(this.router.route(), 3000);
  });

  afterEach(() => {
    this.server.close();
  });

  describe('response header methods:', () => {
    describe('.status()', () => {
      it('should write a status code to response header', (done) => {
        this.router.get('/test', (req, res) => {
          eagles.status(res, 300);
          res.end();
        });
        request('localhost:3000')
        .get('/test')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(300);
          done();
        });
      });
    });

    describe('.contentType()', () => {
      it('should write a content type to response header', (done) => {
        this.router.get('/test', (req, res) => {
          eagles.contentType(res, 'text/html');
          res.end();
        });
        request('localhost:3000')
        .get('/test')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.header('content-type', 'text/html');
          done();
        });
      });

      it('should take shorthand content types', (done) => {
        this.router.get('/test', (req, res) => {
          eagles.contentType(res, 'html');
          res.end();
        });
        request('localhost:3000')
        .get('/test')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.header('content-type', 'text/html');
          done();
        });
      });
    });

    describe('.resHead()', () => {
      it('.resHead() should write response header', (done) => {
        this.router.get('/test', (req, res) => {
          eagles.resHead(res, 300, 'text/html');
          res.end();
        });
        request('localhost:3000')
        .get('/test')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(300);
          expect(res).to.have.header('content-type', 'text/html');
          done();
        });
      });
    });

    it('should be chainable', (done) => {
      this.router.get('/test', (req, res) => {
        eagles.status(res, 300).contentType(res, 'text/html');
        res.end();
      });
      request('localhost:3000')
        .get('/test')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(300);
          expect(res).to.have.header('content-type', 'text/html');
          done();
        });
    });
  });

  describe('response body methods:', () => {
    describe('.resBody()', () => {
      it('should write to response body', (done) => {
        this.router.get('/test', (req, res) => {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          eagles.resBody(res, 'Hello world');
          res.end();
        });
        request('localhost:3000')
          .get('/test')
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.text).to.eql('Hello world');
            done();
          });
      });
    });

    describe('.sendFile()', () => {
      it('.sendFile() should write content of a file to response body', (done) => {
        var testFilepath = __dirname + '/test_data/one.txt';
        this.router.get('/test', (req, res) => {
          eagles.sendFile(res, testFilepath);
        });
        request('localhost:3000')
          .get('/test')
          .end((err, res) => {
            expect(err).to.eql(null);
            fs.readFile(testFilepath, function(err, data) {
              expect(res.text).to.eql(data.toString());
              done();
            });
          });
      });
    });

    describe('.sendJSON()', () => {
      it('should write an object to response body as JSON', (done) => {
        this.router.get('/test', (req, res) => {
          eagles.sendJSON(res, {hello: 'world'});
        });
        request('localhost:3000')
        .get('/test')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.hello).to.eql('world');
          done();
        });
      });

      it('should response with content of file if filepath is specified', (done) => {
        var testFilepath = __dirname + '/test_data/random.json';
        this.router.get('/test', (req, res) => {
          eagles.sendFile(res, testFilepath);
        });
        request('localhost:3000')
          .get('/test')
          .end((err, res) => {
            expect(err).to.eql(null);
            fs.readFile(testFilepath, function(err, data) {
              expect(res.body).to.eql(JSON.parse(data.toString()));
              done();
            });
          });
      });
    });

  });

});
