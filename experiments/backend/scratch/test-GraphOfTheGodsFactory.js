"use strict";

/**
 * @author ebarsallo
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');
const gods = require('../../../lib/backend/example/graph-of-the-gods');

let titanGraph = new gods();

console.log('Loading ...');
titanGraph.load();

console.log('Done');
