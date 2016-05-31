"use strict";

/**
 * @author ebarsallo
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');
const gods = require('./example/GraphOfTheGodsFactory');

let titanGraph = new gods();

console.log('Loading ...');
titanGraph.load();

console.log('Done');
