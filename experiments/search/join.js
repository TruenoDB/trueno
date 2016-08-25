"use strict";
const Search = require('../../lib/search/search-client');
const Logger = require("../../lib/core/logging/logger");
const Joins = require("../../lib/search/neighbors.json");

/* Init logger */
global.logger = new Logger({'debug': false});

var s = new Search();

/* init the search */
s.init().then((host)=> {

  return s.indexExists('graphi');

}, (error)=> {

  console.log(error);

}).then((exist)=> {

  let neighbor = Joins.neighbors;

  /* Setting the source */
  neighbor.query.filtered.filter.filterjoin.source = {
    "indices": [
      "graphi"
    ],
    "types": [
      "v"
    ],
    "path": "id",
    "query": {
      "match_all": {}
    }
  };


  let outEdgesPromise = s.join(neighbor, 'graphi', 'e');


  return outEdgesPromise;

}).then((results)=> {

  console.log(results);
})