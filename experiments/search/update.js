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

    /* Inserting all vertices */
    vertices.forEach((v)=> {
      v.gender = (Math.random() > 0.5) ? 'unknown' : 'asexual';
      v.height = (Math.random()) * 100;
      promises.push(s.update(v, 'mygraph', 'vertex'));
    });

  } else {
    console.log("This index does not exist");
    process.exit();
  }

  return Promise.all(promises);

}).then((results)=> {
  //console.log(results);
  console.log("done with update");
}, (err)=> {
  console.log(err);
});