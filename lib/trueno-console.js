"use strict";

/**
 * @author Victor O. Santos Uceta
 * Starts the TruenoDB console.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require("../package.json");
let Console = require('./console/console');

cli._name = "$ trueno console";
cli.version(pkg.version)
.option('-h, --host <string>', 'The host or IP address to be exposed')
.option('-p, --port <number>', 'The local port to be exposed, default: 8000', parseInt)
.parse(process.argv);

/* Instantiating the console */
let cnsl = new Console(cli);
/* Initializing(launching) */
cnsl.init();
