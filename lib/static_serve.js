const fs = require('fs');
const path = require('path');

var static = exports.static = function(dirPath){

  //console.log(dirPath);
  var convertPath = dirPath;
  //console.log(convertPath);
  var returnPaths = [];
  var currPaths = fs.readdirSync(convertPath);
  for(var i = 0; i < currPaths.length; i++){
    if(currPaths[i] && currPaths[i][0] != '.'){
      var hereEntry = path.join(convertPath, currPaths[i]);
      //console.dir(hereEntry);
      var statsEntry = fs.statSync(hereEntry);
      if(statsEntry.isDirectory()) returnPaths.push( static(hereEntry));
      if(statsEntry.isFile()) returnPaths.push(hereEntry.toString());

    }
  }
  return returnPaths;
};
