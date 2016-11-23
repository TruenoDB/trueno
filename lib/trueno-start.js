"use strict";

/**
 * @author Victor O. Santos Uceta
 * Starts the TruenoDB instance or cluster.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require('../package.json');
const shell = require('shelljs');
const path = require('path');
const pm2 = require('pm2');

cli._name = "$ trueno start";
cli.version(pkg.version)
.option('-h, --host <string>', 'The host or IP address to be exposed, default: localhost')
.option('-p, --port <number>', 'The local port to be exposed, default: 8000', parseInt)
.option('--debug', 'Show debug messages in the console')
.option('--dir <dataDirectoryPath>', 'The data directory for the storage engines')
.option('--forever', 'Run trueno as a daemon in the background')
.option('--cluster <hostsJSON>', 'Start the database in cluster mode with the provided hosts JSON')
.parse(process.argv);

/* path to pm2 */
let pm2Path = path.normalize(__dirname + "/../node_modules/pm2/bin/pm2");
/* flush the logs */
//shell.exec(pm2Path + " flush", {async: true});

if (cli.forever) {
  /* Start PM2 supervisor either in daemon or non daemon mode */
  pm2.connect(false, function (err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    /* Start the Core */
    pm2.start({
      name: "Trueno-Core",
      args: process.argv.slice(2),
      silent: true,
      script: path.normalize(__dirname + '/trueno-post-start.js'),
    }, function (err, apps) {
      if (err) throw err
      /* disconnect pm2 */
      pm2.disconnect();
    });
  });
} else {
  require("./trueno-post-start.js");
}

