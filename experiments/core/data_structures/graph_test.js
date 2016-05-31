"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
const Graph = require('../../../lib/core/data_structures/graph');


let g = new Graph();

/* Setters */
g.name = 'G';
g.directed = true;
g.dynamic = true;
g.multi = true;

/* Adding attributes */
g.setAttribute('age', 25);
g.setAttribute('name','Michael');
g.setAttribute('salary',5000);
g.setAttribute('birth_date',new Date());
g.setAttribute('attr1',3.14);
g.setAttribute('attr2',false);
/* Getting attribute */
console.log(g.getAttribute('age'));
console.log(g.getAttribute('name'));
console.log(g.getAttribute('salary'));
/* removing attributes */
g.removeAttribute('attr1');
g.removeAttribute('attr2');

/* adding computed */
g.setComputedAttribute('pagerank','average',1.43245);
g.setComputedAttribute('pagerank','min',0.0005);
g.setComputedAttribute('pagerank','max',2.45);
g.setComputedAttribute('clustering_coefficient','clustering',21.34);
g.setComputedAttribute('some_algo','someAttr',false);
g.setComputedAttribute('some_algo2','someAttr',11);
/* Set computed algorigthm */
g.setComputedAlgorithm('triangle_count');
/* Getting computed attribute */
console.log(g.getComputedAttribute('pagerank','average'));
console.log(g.getComputedAttribute('pagerank','min'));
console.log(g.getComputedAttribute('clustering_coefficient','clustering'));
/* removing computed */
g.removeComputedAttribute('some_algo','someAttr');
g.removeComputedAttribute('some_algo2','someAttr');
g.removeComputedAlgorithm('some_algo2');


/* Adding attributes */
g.setMetaAttribute('created', new Date());
g.setMetaAttribute('user','admin');
g.setMetaAttribute('some',false);

/* Getting attribute */
console.log(g.getMetaAttribute('created'));
console.log(g.getMetaAttribute('user'));
/* removing attributes */
g.removeMetaAttribute('some');

/* Validate Graph */
g.validate().then((g)=>{

  console.log(g);

},(err)=>{

  console.log(err);

});
