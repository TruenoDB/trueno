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

  if (exist) {
    return Promise.all([s.deleteIndex('mygraph'), s.initIndex('mygraph')]);
  } else {
    return s.initIndex('mygraph');
  }

}).then((results)=> {

  var promises = [];

  /* Inserting all vertices */
  vertices.forEach((v)=> {
    promises.push(s.insert(v, 'mygraph', 'vertex'));
  });
  /* Inserting all edges */
  edges.forEach((e)=> {
    promises.push(s.insert(e, 'mygraph', 'edge'));
  });

  return Promise.all(promises);

}).then((results)=> {
  //console.log(results);
  console.log("done with creation");
});