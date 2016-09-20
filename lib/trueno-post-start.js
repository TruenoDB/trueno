"use strict";

/**
 * @author Victor O. Santos Uceta
 * Starts the TruenoDB instance or cluster.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require('../package.json');
let Init = require('./core/initialize/init');
let Joi = require('joi');
let pm2 = require('pm2');
let fs = require('fs');

cli._name = "$ trueno start";
cli.version(pkg.version)
.option('-h, --host <string>', 'The host or IP address to be exposed, default: localhost')
.option('-p, --port <number>', 'The local port to be exposed, default: 8000', parseInt)
//.option('-w, --workers <number>', 'Number of client socket worker instances, by default: Number of CPU cores', parseInt)
//.option('-s, --secure <boolean>', 'Secure client connection via secure socket, default: false')
.option('--dir <dataDirectoryPath>', 'The data directory for the storage engines')
.option('--forever', 'Run trueno as a daemon in the background')
.option('--cluster <hostsJSON>', 'Start the database in cluster mode with the provided hosts JSON')
.option('--debug', 'Show debug messages in the console.')
.parse(process.argv);

/* check if cluster configuration is provided */
if (cli.cluster) {
  try {
    /* set the components where "key": {component object}
     * is which host has which component, for example, a particular
     * host can only have computing, where other can have backend and index.*/
    cli.clusterHosts = JSON.parse(fs.readFileSync(cli.cluster));
    /* master counter */
    let masterCount = 0;
    /* Validate component indicators */
    Joi.array().items(Joi.object().keys({
      "compute": Joi.boolean(),
      "index": Joi.boolean(),
      "backend": Joi.boolean(),
      "master": Joi.boolean(),
    })).validate(Object.keys(cli.clusterHosts).map((k)=> {
      masterCount += (cli.clusterHosts[k].master) ? 1 : 0;
      return cli.clusterHosts[k];
    }), (err) => {
      if (err) {
        throw err;
      } else if (masterCount !== 1) {
        throw new Error("Exactly one master is required to run the cluster");
      }
    });
    /* validate keys as IP or hostnames */
    Joi.array().items(Joi.alternatives().try(Joi.string().ip({
      version: ['ipv4', 'ipv6'], cidr: 'required'
    }), Joi.string().hostname())).min(2)
    .validate(Object.keys(cli.clusterHosts),
      (err) => {
        if (err) {
          throw err;
        }
      });
  } catch (err) {
    console.log("Error! Cluster host file not valid: " + err.message);
    process.exit();
  }
}

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


