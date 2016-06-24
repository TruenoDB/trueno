"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const ext_api = require('../../../lib/core/api/external-api');
const init = require('../../../lib/core/initialize/init');
const message = require('../../../lib/core/communication/message');

const graph = require('../../../lib/core/data_structures/graph');
const vertex = require('../../../lib/core/data_structures/vertex');
const edge = require('../../../lib/core/data_structures/edge');


let i = new init();
i.initLogger();

let api = new ext_api();
let g = new graph({id : 'test2'});


let msg = new message();
msg.payload = g;

// create graph
//api.ex_createGraph(console.log, msg);

// remove graph
//api.ex_deleteGraph(console.log, msg);

// add vertex
//let v1 = new vertex({id : 1, graphid : 'test', attributes : {'label' : 'titan', 'name' : 'saturn', 'age' : 10000} });
//msg.payload = v1;
//api.ex_createVertex(console.log, msg);

// update vertex
//let v = new vertex({id : 1, graphid : 'test', attributes : {'label' : 'titan', 'name' : 'jupiter', 'age' : 5000} });
//msg.payload = v;
//api.ex_updateVertex(console.log, msg);

//let v3 = new vertex({id : 3, graphid : 'test', attributes : {'name' : 'sky', 'type' : 'location'} });
//msg.payload = v3;
//api.ex_createVertex(console.log, msg);

// add edge
//let e = new edge({id : 1, from : 1, to : 2, graphid : 'test', attributes : {'label' : 'lives', 'reason' : 'loves fresh breezes'}});
//msg.payload = e;
//api.ex_createEdge(console.log, msg);

// update edge
//let e = new edge({id : 1, from : 1, to : 2, graphid : 'test', attributes : {'label' : 'lives', 'reason' : 'likes sunshines'}});
//msg.payload = e;
//api.ex_updateEdge(console.log, msg);


// remove edge
//let e = new edge({from : 1, to : 2, graphid : 'test'});
//msg.payload = e;
//api.ex_deleteEdge(console.log, msg);

//remove vertex
//let v = new vertex({id : 3, graphid : 'test'});
//msg.payload = v;
//api.ex_deleteVertex(console.log, msg);


//process.exit();
//let v = new vertex ({id: 1, graphid : 'test'});
//msg.payload = v;
//api.ex_getVertex(console.log, msg);
//
//
//let e = new edge ({from: 1, to: 2, graphid : 'test'});
//msg.payload = e;
//api.ex_getEdge(console.log, msg);


msg.payload = new graph ({id: 'test'});;
api.ex_getGraph(console.log, msg);

msg.payload = new graph ({id: 'test'});;
api.ex_getGraphList(console.log, msg);
