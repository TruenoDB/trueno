"use strict";

var utils = require('../../../lib/backend/util/tools');

let mapa = new Map();
let notmapa = {}


notmapa['1'] = 'one';
notmapa['2'] = 'two';
notmapa['3'] = 'three';


console.log('1. ', mapa);

mapa.set(1, {x: 'xxx', y: 112});
mapa.set(2, 'yyy');
mapa.set(3, 'zzz');
console.log('2. ', mapa);

console.log('3. ', mapa.toString());

mapa.toString = function () {return "hi"};

console.log('4. ', mapa.toString());


console.log('5. ', mapa, ' notmapa: ', notmapa);

if (mapa instanceof Map)
  console.log ('mapa is a Map');

if (notmapa instanceof Map)
  console.log ('notmapa is a Map');


let computed = new Map();
//g.setComputedAttribute('pagerank','average',1.43245);
//g.setComputedAttribute('pagerank','min',0.0005);
//g.setComputedAttribute('pagerank','max',2.45);
//g.setComputedAttribute('clustering_coefficient','clustering',21.34);
//g.setComputedAttribute('some_algo','someAttr',false);
//g.setComputedAttribute('some_algo2','someAttr',11);

console.log('======================================\n');
console.log('computed: ', computed);

computed.set('pagerank', new Map ());
computed.set('clustering_coefficient', new Map ());
computed.set('some_algo', new Map ());
computed.set('some_algo2', new Map ());
computed.set('triangle_count', new Map());

computed.get('pagerank').set('average', 1.43245);
computed.get('pagerank').set('min', 0.0005);
computed.get('pagerank').set('max', 2.45);
computed.get('clustering_coefficient').set('clustering', 21.34);
computed.get('some_algo').set('someAttr', false);
computed.get('some_algo2').set('someAttr', 11);

console.log('computed: ', computed);

