#!/usr/bin/env node
/**
 * Created by: victor on 5/12/16.
 * Source: trueno-start.js
 * Author: victor
 * Description:
 *
 */
'use strict';
let cli = require('commander');
let pkg = require("../package.json");

cli._name = "$ trueno start";
cli.version(pkg.version)
.option('-h, --host <string>', 'The host or IP address to be exposed')
.option('-p, --port <number>', 'The local port to be exposed, default: 8000', parseInt)
.option('-w, --workers <number>', 'Number of client socket worker instances, by default: Number of CPU cores', parseInt)
.option('-c, --config <configfile>', 'Configuratio file, if provided all other command line flags will be ignored')
.option('-s, --secure <boolean>', 'Secure client connection via secure socket, default: false')
.option('--cluster <configfile>', 'Start the database in cluster mode with the provided configuration')
.parse(process.argv);