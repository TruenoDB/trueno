"use strict";

/**
 * @author Victor O. Santos Uceta
 * Stops the TruenoDB instance.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require("../package.json");

cli._name = "$ trueno stop";
cli.version(pkg.version)
.option('--all', 'Stop all instances, including peer instances if in cluster mode')
.parse(process.argv);