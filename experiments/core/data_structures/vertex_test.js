"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
const Vertex = require('../../../lib/core/data_structures/vertex');


let v = new Vertex();

/* Setters */
v.partition = 1;

/* Adding attributes */
v.setAttribute('age', 25);
v.setAttribute('name','Michael');
v.setAttribute('salary',5000);
v.setAttribute('birth_date',new Date());
v.setAttribute('attr1',3.14);
v.setAttribute('attr2',false);
/* Getting attribute */
console.log(v.getAttribute('age'));
console.log(v.getAttribute('name'));
console.log(v.getAttribute('salary'));
/* removing attributes */
v.removeAttribute('attr1');
v.removeAttribute('attr2');

/* adding computed */
v.setComputedAttribute('pagerank','average',1.43245);
v.setComputedAttribute('pagerank','min',0.0005);
v.setComputedAttribute('pagerank','max',2.45);
v.setComputedAttribute('clustering_coefficient','clustering',21.34);
v.setComputedAttribute('some_algo','someAttr',false);
v.setComputedAttribute('some_algo2','someAttr',11);
/* Set computed algorigthm */
v.setComputedAlgorithm('triangle_count');
/* Getting computed attribute */
console.log(v.getComputedAttribute('pagerank','average'));
console.log(v.getComputedAttribute('pagerank','min'));
console.log(v.getComputedAttribute('clustering_coefficient','clustering'));
/* removing computed */
v.removeComputedAttribute('some_algo','someAttr');
v.removeComputedAttribute('some_algo2','someAttr');
v.removeComputedAlgorithm('some_algo2');


/* Adding attributes */
v.setMetaAttribute('created', new Date());
v.setMetaAttribute('user','admin');
v.setMetaAttribute('some',false);

/* Getting attribute */
console.log(v.getMetaAttribute('created'));
console.log(v.getMetaAttribute('user'));
/* removing attributes */
v.removeMetaAttribute('some');

/* Validate Graph */
v.validate().then((v)=>{

  console.log(v);

},(err)=>{

  console.log(err);

});
