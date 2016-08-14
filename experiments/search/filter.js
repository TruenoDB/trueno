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

}).then((results)=> {

  console.log("Done with terms filter", results.splice(0, 3));

  /* Example range filter */
  var heightBirthdayFilter = s.filterFactory()
  .filter('range', 'height', {gt: 5, lt: 7})
  .filter('range', 'birthdate', {
    "gte": "01/01/2013",
    "lte": "2015",
    "format": "dd/MM/yyyy||yyyy"
  });

  return s.search(heightBirthdayFilter, 'mygraph', 'vertex');

}).then((results)=> {

  console.log("Done with range filter", results.splice(0, 3));

  /* Example exist filter */
  var existFilter = s.filterFactory().filter('exists', 'field', 'optionalField');
  return s.search(existFilter, 'mygraph', 'vertex');

}).then((results)=> {

  console.log("Done with exists filter", results.splice(0, 3));
  /* Example missing filter */
  var missingFilter = s.filterFactory().filter('missing', 'field', 'optionalField');
  return s.search(missingFilter, 'mygraph', 'vertex');

}).then((results)=> {

  console.log("Done with missing filter", results.splice(0, 3));

  /* Example prefix filter */
  var prefixFilter = s.filterFactory().filter('prefix', 'first_name', 'and');
  return s.search(prefixFilter, 'mygraph', 'vertex');

}).then((results)=> {

  console.log("Done with prefix filter", results.splice(0, 3));
  /* Example prefix filter */
  var wildcardFilter = s.filterFactory().filter('wildcard', 'first_name', '*dre*');
  return s.search(wildcardFilter, 'mygraph', 'vertex');

}).then((results)=> {

  console.log("Done with wildcard filter", results.splice(0, 3));

  var regexpFilter = s.filterFactory().filter('regexp', 'first_name', '.*en.*');
  return s.search(regexpFilter, 'mygraph', 'vertex');


}).then((results)=> {

  console.log("Done with regexp filter", results.splice(0, 3));


});