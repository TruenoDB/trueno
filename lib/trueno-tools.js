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
const shell = require('shelljs');
const path = require('path');

cli._name = "$ trueno tools";
cli.version(pkg.version)
.option('--status', 'Show the database processes status')
.option('--monitor', 'Show the database processes status')
.parse(process.argv);

/* path to pm2 */
let pm2Path = path.normalize(__dirname + "/../node_modules/pm2/bin/pm2");

switch (true) {
  case (cli.status):
    shell.exec(pm2Path + " list", {async: true});
    break;
  case (cli.monitor):
    shell.exec(pm2Path + " monit", {async: true});
    break;
  default:
    /* Not flag provided */
    console.log('No Tool flag provided. See  --help for options');
}

