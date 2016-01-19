const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const fs = require('fs');

var static = require(__dirname + '/../lib/static_serve');

const eagles = require(__dirname + '/../index');

describe('Response helper', () => {
  beforeEach(() => {
    this.router = new eagles.Router();
    this.server = eagles.createServer(this.router.route(), 3000);
    static.static(__dirname + '/test_data/', this.router);
  });

  afterEach(() => {
    this.server.close();
  });


  describe('.sendFile()', () => {
    it('.sendFile() should write content of a file to response body', (done) => {
      var testFilepath = __dirname + '/test_data/one.txt';
      // this.router.get('/one.txt', (req, res) => {
      //   eagles.sendFile(res, testFilepath);
      // });
      request('localhost:3000')
        .get('/one.txt')
        .end((err, res) => {
          expect(err).to.eql(null);
          fs.readFile(testFilepath, function(err, data) {
            expect(res.text).to.eql(data.toString());
            done();
          });
        });
    });
  });
});
