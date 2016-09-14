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
/* prevent process stdout to close immediately */
process.stdin.resume();
/* set the exiting flag */
let exiting = true;

/* Set exit handlers */
function exitHandler(options, err) {
  if (exiting) {
    /* disable the handler to prevent double termination */
    exiting = false;
    /* changing the running status */
    init.setRunningState(false);
    /* Appending a new line */
    console.log('\n');
    /* Stop components */
    init.stopComponents().then(()=> {
      /* Log the checking components progress */
      logger.info('Trueno is now exiting...');
      /* logging error if any */
      if (err) logger.info(err.stack);
      /* exiting process */
      process.exit();
    });
  }
}

/* on process exiting handler */
process.on('exit', exitHandler.bind(null, {cleanup: true}));

/* on process ctrl+c handler */
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

/* on fatal exception handler */
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));

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


