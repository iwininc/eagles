const expect = require('chai').expect;
const urlParser = require(__dirname + '/../lib/url_parser');

describe('URL Parsing helper', () => {
  describe('Pathname parser', () => {
    it('should extract pathname from simple URL', () => {
      var pathname = urlParser.getPathname('/hello');
      expect(pathname).to.eql('/hello');
    });

    it('should extract pathname from URL with variables', () => {
      var pathname = urlParser.getPathname('/hello/world');
      expect(pathname).to.eql('/hello');
    });

    it('should extract pathname from URL with query string', () => {
      var pathname = urlParser.getPathname('/hello?name=world');
      expect(pathname).to.eql('/hello');
    });
  });

  describe('Query parser', () => {
    it('should return an object with query pairs', () => {
      var urlQuery = urlParser.getQuery('/hello?name=world&code=awesome');
      expect(urlQuery).to.be.an('object');
      expect(urlQuery).to.eql({name: 'world', code: 'awesome'});
    });

    it('should return an empty object if no query string is present', () => {
      var urlQuery = urlParser.getQuery('/hello');
      expect(urlQuery).to.be.an('object');
      expect(urlQuery).to.eql({});
    });
  });

  describe('Parameters handling', () => {
    it('should read and return an array of variables names', () => {
      var params = urlParser.readParam('/hello/:time/:name');
      expect(params).to.be.an('array');
      expect(params).to.eql(['time', 'name']);
    });

    it('should match variables and return an object with variable paris', () => {
      var paramMatch = urlParser.matchParam('/hello/morning/world', ['time', 'name']);
      expect(paramMatch).to.be.an('object');
      expect(paramMatch).to.eql({time: 'morning', 'name': 'world'});
    });
  });


});
