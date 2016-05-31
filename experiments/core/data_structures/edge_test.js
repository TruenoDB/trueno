"use strict";
/**
 * Created by: victor on 5/23/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
const Edge = require('../../../lib/core/data_structures/edge');


let e = new Edge();

/* Setters */
e.from = '43242-24324-2434';
e.to = '45324-67543-98897';
e.partition = 1;
e.label = 'knows';

/* Adding attributes */
e.setAttribute('age', 25);
e.setAttribute('name','Michael');
e.setAttribute('salary',5000);
e.setAttribute('birth_date',new Date());
e.setAttribute('attr1',3.14);
e.setAttribute('attr2',false);
/* Getting attribute */
console.log(e.getAttribute('age'));
console.log(e.getAttribute('name'));
console.log(e.getAttribute('salary'));
/* removing attributes */
e.removeAttribute('attr1');
e.removeAttribute('attr2');

/* adding computed */
e.setComputedAttribute('pagerank','average',1.43245);
e.setComputedAttribute('pagerank','min',0.0005);
e.setComputedAttribute('pagerank','max',2.45);
e.setComputedAttribute('clustering_coefficient','clustering',21.34);
e.setComputedAttribute('some_algo','someAttr',false);
e.setComputedAttribute('some_algo2','someAttr',11);
/* Set computed algorigthm */
e.setComputedAlgorithm('triangle_count');
/* Getting computed attribute */
console.log(e.getComputedAttribute('pagerank','average'));
console.log(e.getComputedAttribute('pagerank','min'));
console.log(e.getComputedAttribute('clustering_coefficient','clustering'));
/* removing computed */
e.removeComputedAttribute('some_algo','someAttr');
e.removeComputedAttribute('some_algo2','someAttr');
e.removeComputedAlgorithm('some_algo2');


/* Adding attributes */
e.setMetaAttribute('created', new Date());
e.setMetaAttribute('user','admin');
e.setMetaAttribute('some',false);

/* Getting attribute */
console.log(e.getMetaAttribute('created'));
console.log(e.getMetaAttribute('user'));
/* removing attributes */
e.removeMetaAttribute('some');

/* Validate Graph */
e.validate().then((e)=>{

  console.log(e);

},(err)=>{

  console.log(err);

});
