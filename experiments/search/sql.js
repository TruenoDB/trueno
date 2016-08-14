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

  /* Example term filter, NOTE: Must be lowercase */
  var termFilter = s.filterFactory()
  .filter('term', 'last_name', 'diaz')
  .filter('term', 'height', 7);
  return s.search(termFilter, 'mygraph', 'vertex');

}).then((results)=> {

  console.log("Done with term filter", results.splice(0, 3));

  /* Example term filter, NOTE: Must be lowercase */
  var termFilter = s.filterFactory().filter('terms', 'last_name', ['snyder', 'diaz'])
  return s.search(termFilter, 'mygraph', 'vertex');

})