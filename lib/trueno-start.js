"use strict";

/**
 * @author Victor O. Santos Uceta
 * Starts the TruenoDB instance or cluster.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require('../package.json');
let Init = require('./core/initialize/init');

cli._name = "$ trueno start";
cli.version(pkg.version)
.option('-h, --host <string>', 'The host or IP address to be exposed, default: localhost')
.option('-p, --port <number>', 'The local port to be exposed, default: 8000', parseInt)
.option('-w, --workers <number>', 'Number of client socket worker instances, by default: Number of CPU cores', parseInt)
.option('-c, --config <configfile>', 'Configuratio file, if provided all other command line flags will be ignored')
.option('-s, --secure <boolean>', 'Secure client connection via secure socket, default: false')
.option('--cluster <configfile>', 'Start the database in cluster mode with the provided configuration')
.option('--debug', 'Show debug messages in the console.')
.parse(process.argv);

/* instantiate an initialization object */
let init = new Init(cli);

/* Initialize Global Logger */
init.initLogger(cli.debug);

/* Log the checking components progress */
logger.info('Checking components...');
/* Starting initialization process */
init.startComponents().then(()=> {

  /* Log the checking components progress */
  logger.info('All components started');
  /* Log the checking components progress */
  logger.info('Starting database...');
  /* Return next promise(finish starting)*/
  return init.start(cli);

}, (error)=> {

  /* Logging and throw error */
  logger.error('Error initializing components!', error);

}).then(()=> {

  /* The start process was successful */
  logger.info('TruenoDB Started...');
})


