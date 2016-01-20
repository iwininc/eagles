const nodeUrl = require('url');

exports.getPathname = function(url) {
  return '/' + url.split('/')[1].split('?')[0];
};

exports.getQuery = function(url) {
  return nodeUrl.parse(url, true).query;
};

exports.readParam = function(url) {
  return url.split('/:').slice(1);
};

exports.matchParam = function(url, variables) {
  var result = {};
  var values = url.split('/').slice(2);
  variables.forEach(function(varName, index) {
    result[varName] = values[index];
  });
  return result;
};
