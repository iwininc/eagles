const fs = require('fs');
const path = require('path');
var resHelper = require(__dirname + '/response_helper');

var static = exports.static = function(dirPath, router, _originDir){
  //if the _originDir is not set, this is the first iteration of the function
  // and we need to save the dirPath for future use. Else, leave it alone.
  _originDir = _originDir ? _originDir : dirPath;
  //console.log(dirPath);
  var convertPath = dirPath;
  //console.log(convertPath);
  var currPaths = fs.readdirSync(convertPath);
  for(var i = 0; i < currPaths.length; i++){
    if(currPaths[i] && currPaths[i][0] != '.'){
      var hereEntry = path.join(convertPath, currPaths[i]);
      //console.dir(hereEntry);
      var statsEntry = fs.statSync(hereEntry);
      if(statsEntry.isDirectory()){
        static(hereEntry, router, _originDir);
      }

      if(statsEntry.isFile()){
        var relativePath = hereEntry.slice(_originDir.length - 1);
        console.log(relativePath);
        //assign file path to the router.get
        router.get(relativePath, function(req, res) {
          resHelper.sendFile(res, hereEntry);
        });

      };

    }
  }
};
