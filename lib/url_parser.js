const nodeUrl = require('url');

exports.getPathname = function(url) {
  return '/' + url.split('/')[1];
};

exports.getQuery = function(url) {
  return nodeUrl.parse(url, true).query;
};

exports.getParam = function(url, variables) {};

exports.matchParam = function(url) {};
