const createServer = require(__dirname + '/../lib/server');
const expect = require('chai').expect;

describe('Server setup', () => {
  afterEach(() => {
    this.server.close();
  });

  it('should be able to create a HTTP server with specified port', () => {
    this.server = createServer(() => {}, 8080);
    var portNum = parseInt(this.server['_connectionKey'].substring(5, 9));
    expect(portNum).to.eql(8080);
  });

  it('should be able to create a HTTP server with using port 3000', () => {
    this.server = createServer(() => {});
    var portNum = parseInt(this.server['_connectionKey'].substring(5, 9));
    expect(portNum).to.eql(3000);
  });

});
