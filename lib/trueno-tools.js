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
const pm2GUI = require('pm2-gui');

cli._name = "$ trueno tools";
cli.version(pkg.version)
.option('--status', 'Show the database processes status')
.option('--flush', 'Flush PM2 logs')
.option('--monitor <option>', 'Monitor the database processes, options: s(simple) or a(advanced)')
.parse(process.argv);

/* path to pm2 */
let pm2Path = path.normalize(__dirname + "/../node_modules/pm2/bin/pm2");

switch (true) {
  case (cli.status != undefined):
    shell.exec(pm2Path + " list", {async: true});
    break;
  case (cli.monitor != undefined):
    switch (cli.monitor) {
      case "s":
        shell.exec(pm2Path + " monit", {async: true});
        break;
      case "a":
        pm2GUI.dashboard();
        break;
    }
    break;
  case (cli.flush != undefined):
    shell.exec(pm2Path + " flush", {async: true});
    break;
  default:
    /* Not flag provided */
    console.log('No Tool flag provided. See  --help for options');
}