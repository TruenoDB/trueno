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
.option('-b, --backend <backend>', 'The storage backend, options: cassandra or scylladb. Default: cassandra', /^(cassandra|scylladb)$/i)
.parse(process.argv);

/* instantiate an initialization object */
let init = new Init(cli);
/* Initialize Global Logger */
init.initLogger(cli.debug);
/* Initialize component downloader */
var dldr = new ComponentDownloader();
/* Start downloads */
dldr.start().then(()=> {
  /* Executing post installation scripts */
  var piexec = new PostInstallExecuter();
  return piexec.execute();
}).then(()=> {
  logger.info('Trueno setup successful, run \'$ trueno start\' to start the database.');
});
