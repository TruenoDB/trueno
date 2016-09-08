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

  return s.indexExists('graphi');

}, (error)=> {

  console.log(error);

}).then((exist)=> {

  console.log('exists response is:', exist);

  if (exist) {
    return Promise.all([s.deleteIndex('graphi'), s.initIndex('graphi')]);
  } else {
    return s.initIndex('graphi');
  }

}).then((results)=> {

  var operations = [];

  /* Inserting all vertices */
  vertices.forEach((v)=> {
    operations.push({ "index" : {"_type" : "v"} });
    operations.push({id: v.id, prop: v, meta: {}, computed: {}});
  });
  /* Inserting all edges */
  edges.forEach((e)=> {
    operations.push({ "index" : {"_type" : "e"} });
    operations.push({prop: e, meta: {}, computed: {}});
  });

  return s.bulk(operations, 'graphi');

}).then((results)=> {
  console.log(results);
  console.log("done with creation");
});