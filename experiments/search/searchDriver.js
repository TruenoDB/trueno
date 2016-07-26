"use strict";
const Search = require('../../lib/search/search');
//const Logger = require("../../lib/core/logging/logger");

//global.logger = new Logger({'debug': false});

var s = new Search();

/* init the search */
s.init().then((host)=> {

  return Promise.all([s.deleteIndex('mygraph'), s.initIndex('mygraph')]);

}, (error)=> {

  console.log(error);

}).then((results)=> {
  console.log(results);
  return Promise.all([s.put({
    index: 'mygraph',
    type: 'vertex',
    id: '1',
    body: {
      age: 30,
      name: 'Juan',
      birthdate: new Date()
    }
  }), s.put({
    index: 'mygraph',
    type: 'vertex',
    id: '2',
    body: {
      age: 20,
      name: 'Pedro',
      birthdate: new Date()
    }
  }), s.put({
    index: 'mygraph',
    type: 'edge',
    id: '1',
    body: {
      relation: 'knows',
      source: 1,
      target: 2
    }
  }), s.put({
    index: 'mygraph',
    type: 'edge',
    id: '2',
    body: {
      relation: 'meets',
      source: 2,
      target: 1
    }
  })]);
}).then((results)=> {
  console.log(results);
  return s.search({
    index: 'mygraph',
    type: 'edge',
    //q: "relation:knows"

  });
}).then((results)=> {
  console.log(results);
}, (err)=> {
  console.log(err);
});