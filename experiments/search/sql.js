"use strict";
const Search = require('../../lib/search/search-client');
const Logger = require("../../lib/core/logging/logger");

/* Init logger */
global.logger = new Logger({'debug': false});

var s = new Search();

/* init the search */
s.init().then((host)=> {

  return s.indexExists('mygraph');

}, (error)=> {

  console.log(error);

}).then((exist)=> {

  return s.sql("SELECT * FROM mygraph WHERE last_name = 'Snyder' AND _type = 'vertex'");

}).then((results)=> {

  console.log(results);
})