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
.option('--dir <dataDirectoryPath>', 'The data directory for the storage engines')
.option('--forever', 'Run trueno as a daemon in the background')
.option('--cluster <hostsJSON>', 'Start the database in cluster mode with the provided hosts JSON')
.option('--debug', 'Show debug messages in the console.')
.parse(process.argv);

/* path to pm2 */
let pm2Path = path.normalize(__dirname + "/../node_modules/pm2/bin/pm2");

/* Start PM2 supervisor either in daemon or non daemon mode */
pm2.connect((cli.forever == undefined), function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  /* flushing pm2 logs first */
  pm2.flush(function (err, result) {
    if (err) throw err
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
      /* if not in daemon mode show output */
      if (!cli.forever) {
        shell.exec(pm2Path + " logs Trueno-Core --raw", {async: true});
      }
    });
  });
});



