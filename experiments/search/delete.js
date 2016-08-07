"use strict";
const Search = require('../../lib/search/search-client');
const Logger = require("../../lib/core/logging/logger");
var vertices = require("./vertices.json");
var edges = require("./edges.json");

/* Init logger */
global.logger = new Logger({'debug': false});

var s = new Search();

/* init the search */
s.init().then((host)=> {

  return s.indexExists('mygraph');

}, (error)=> {

  console.log(error);

}).then((exist)=> {

  var promises = [];

  if (exist) {

    /* Delete all values with these ids */
    [5, 8, 9, 10, 14, 19, 22, 24].forEach((id)=> {
      promises.push(s.delete({id: id}, 'mygraph', 'vertex'));
    });

  } else {
    console.log("This index does not exist");
    process.exit();
  }

  return Promise.all(promises);

}).then((results)=> {
  //console.log(results);
  console.log("done with deletion");
}, (err)=> {
  console.log(err);
});