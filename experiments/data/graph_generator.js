"use strict";

/**
 * @author Victor O. Santos Uceta
 * Generate a random graph.
 */

let cli = require('commander');
let faker = require('faker');

cli.version('1.0.0')
.option('-d, --directed', 'Create directed graph.')
.option('-s, --seed <number>', 'The random data seed.', parseInt)
.option('-v, --vertices <number>', 'The amount of vertices.', parseInt)
.option('-e, --edges <number>', 'The amount of edges.', parseInt)
.parse(process.argv);

const maxMeta = 8;
let vertexSequence = 0;
let seed = cli.seed || 1;

/* Setting random number */
Math.seed = function(s) {
  return function() {
    s = Math.sin(s) * 10000; return s - Math.floor(s);
  };
};
/* Setting seeds  */
faker.seed(seed);
Math.random = Math.seed(seed);

function generateNode() {

  let v = {properties: {}, meta: {}};
  let max = Math.ceil(Math.random() * 100 % maxMeta)

  /* create properties */
  v.properties.id = vertexSequence++;
  v.properties.firstName = faker.name.firstName();
  v.properties.lastName = faker.name.lastName();
  v.properties.jobTitle = faker.name.jobTitle();
  v.properties.title = faker.name.title();
  v.properties.jobArea = faker.name.jobArea();
  v.properties.jobType = faker.name.jobType();
  v.properties.userName = faker.internet.userName();
  v.properties.email = faker.internet.email();

  let meta =
    [['system', 'mimeType'],
      ['system', 'fileExt'],
      ['system', 'fileType'],
      ['finance', 'account'],
      ['finance', 'bitcoinAddress'],
      ['company', 'companyName'],
      ['company', 'catchPhrase'],
      ['address', 'country']];

  /* Metadata */
  for(let i = 0; i < max; i++){
    v.meta[meta[i][1]] = faker[meta[i][0]][meta[i][1]]();
  }

  return v;
}

while(1){
  generateNode();
  console.log(vertexSequence);
}
