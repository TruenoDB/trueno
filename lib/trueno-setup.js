"use strict";

/**
 * @author Victor O. Santos Uceta
 * Setup the TruenoDB components and initialize everything.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require("../package.json");
let Init = require('./core/initialize/init');
let ComponentDownloader = require('./core/initialize/component_downloader');
let PostInstallExecuter = require('./core/initialize/post_install_executer');


cli._name = "$ trueno setup";
cli.version(pkg.version)
.option('-p, --post', 'Run post setup.')
.option('--debug', 'Show debug messages in the console.')
.parse(process.argv);

/* instantiate an initialization object */
let init = new Init(cli);
/* Initialize component downloader */
let dldr = new ComponentDownloader();
/* Executing post installation scripts */
let piexec = new PostInstallExecuter();
/* result promise */
let resPromise;

/* if not post install flag, install everything */
if (!cli.post) {
  /* install components */
  resPromise = dldr.start().then(()=> {
    return piexec.execute();
  });
} else {
  /* run post install */
  resPromise = piexec.execute();
}

/* Start downloads */
resPromise.then(()=> {
  logger.info('Trueno setup successful, run \'$ trueno start\' to start the database.');
},(err)=>{
  logger.error(err);
});
