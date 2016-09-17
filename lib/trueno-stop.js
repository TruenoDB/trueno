"use strict";

/**
 * @author Victor O. Santos Uceta
 * Stops the TruenoDB instance.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require("../package.json");
let shell = require('shelljs');
let path = require('path');

cli._name = "$ trueno stop";
cli.version(pkg.version)
.parse(process.argv);

/* path to pm2 */
let pm2Path = path.normalize(__dirname + "/../node_modules/pm2/bin/pm2");

/* stop the execution */
shell.exec(pm2Path + " kill", {async: true});
