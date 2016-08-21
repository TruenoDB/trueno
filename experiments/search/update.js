"use strict";
const Search = require('../../lib/search/search-client');
const Logger = require("../../lib/core/logging/logger");
const faker = require("faker");
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
      v = {prop:v};
      v.id = v.prop.id;
      v.prop.gender = faker.random.arrayElement(["male","female"]);
      v.prop.height = faker.random.number({min:4, max:7});
      v.prop.jobArea = faker.name.jobArea();
      v.prop.salary = faker.random.number({min:2000, max:10000});
      v.prop.birthdate = new Date(faker.date.between('1988-01-01', '2015-12-31'));
      if(faker.random.number({min:1, max:2}) == 2){
        v.prop.optionalField = true;
      }

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