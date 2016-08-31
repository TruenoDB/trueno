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

  return s.sql("SELECT * FROM citations where target = 9412200 or id = 9207078");

}).then((results)=> {

  console.log(results);
},(err)=>{

  console.log('error ocurred' ,err);

});