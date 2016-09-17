"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database component executer.
 * @module lib/core/initialize/component_executer
 * @see module:lib/core/initialize/init
 */

/** Import modules */
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const fs = require('fs');
const YAML = require('yamljs');
const path = require('path');
const pm2 = require('pm2');
/* Loading YAML configuration file */
let Components;

/** Description of the class */
class ComponentExecutor {

  /**
   * Create a component runner object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* extracting components from global */
    Components = global.config.components;

    this._components = Object.keys(Components);
    this._compCount = 0;
    this._processes = {};
    this._host = param.host || global.config.local.host;
    /* DB running flag */
    this._dbRunning = true;
  }

  /**
   * Start the download process.
   */
  execute() {
    /* This instance object reference */
    var self = this;
    /* the component promise execution array */
    let promiseArray = [];
    /* Logging start message */
    logger.info('Executing Trueno Components...');
    /* build all promises */
    for (var k in Components) {
      /* if the component is executable, then build the promise */
      if (Components[k].cmdUnix && Components[k].deploy) {
        /* Increasing the deployed component count */
        self._compCount++;
        /* Inserting deployment promise */
        promiseArray.push(
          new Promise((resolve, reject)=> {
            /* Run all components */
            self.run(Components[k], resolve, reject);
          })
        )
      }
    }
    /* resolve all executions */
    return Promise.all(promiseArray);
  }

  /**
   * Stop all processes.
   */
  stop() {
    /* This instance object reference */
    let self = this;
    /* the component promise termination array */
    let promiseArray = [];
    /* stop all processes */
    for (let p in self._processes) {
      /* Killing process */
      self._processes[p].kill();
      /* Push the exiting promise */
      promiseArray.push(
        new Promise((resolve, reject)=> {
          let proc = self._processes[p];
          let name = p;
          /* binding exit event */
          proc.on('close', (code) => {
            resolve();
            /* Process exited */
          });
        })
      )
    }
    /* when all promises are fullfilled, the promise will execute (then) */
    return Promise.all(promiseArray);
  }

  /**
   * Stop all processes.
   */
  setRunningState(s) {
    /* This instance object reference */
    this._dbRunning = s;
  }

  /**
   * Download the next component.
   * @param {object} compObj - The component object to be downloaded.
   * @param {function} resolve - Promise resolve function.
   * @param {function} reject - Promise reject function.
   */
  run(compObj, resolve, reject) {
    /* This instance object reference */
    var self = this;
    /* path to pm2 */
    let pm2Path = path.normalize(__dirname + "/../../../node_modules/pm2/bin/pm2");

    /* set the download number */
    compObj.num = this._compCount - this._components.length;
    /* Extracting command depending on the platform type: Unix or Windows */
    var cmd = (/^win/.test(process.platform)) ? compObj.cmdWin : compObj.cmdUnix;
    /* building parameters */
    self._configure(compObj);

    /* Join the command line arguments or set the regular array */
    let cmdFlags = (compObj.hasOwnProperty("joinCmdFlags")) ? [compObj.cmdFlags.join(compObj.joinCmdFlags)] : compObj.cmdFlags;
    /* starting process with working directory as the component root */
    logger.debug(compObj.name + ': ' + __dirname + '/../binaries/' + compObj.dir + '/' + cmd + ' ' + cmdFlags);
    /* the pm2 execution flags */
    let flags = "--no-daemon --interpreter bash --name " + compObj.name.replace(" ","-");
    /* execute the process */
    let proc = spawn(cmd, cmdFlags, {cwd: __dirname + '/../binaries/' + compObj.dir, shell: true});
    //let proc = spawn(pm2Path + " " + flags + " start " + cmd, cmdFlags, {cwd: __dirname + '/../binaries/' + compObj.dir, shell: true});
    /* saving the process */
    self._processes[compObj.name] = proc;
    /* Monitoring standard output */
    proc.stdout.on('data', (data) => {
      /* logging if debbug */
      logger.debug(compObj.name + ': ' + data);
      /* If ready string found, continue with next component */
      if (data.includes(compObj.readyString)) {
        /* Component sucessfully started */
        logger.info(compObj.name + ' successfully started, PID: ' + proc.pid);
        /* Resolving the execution promise */
        resolve();
      }
    });
    /* Monitoring standard error */
    proc.stderr.on('data', (data) => {

      /* if it is necessary to suppress errors and the ready flag is int he errors messages
       * fulfill this processas successful.
       */
      if (compObj.suppressErrors && data.includes(compObj.readyString)) {
        /* Component sucessfully started */
        logger.info(compObj.name + ' successfully started, PID: ' + proc.pid);
        /* Resolving the execution promise */
        resolve();
      } else if (!compObj.suppressErrors) {
        logger.error(compObj.name + ': ' + data);
      }

    });
    /* Monitoring process exit */
    proc.on('close', (code) => {
      if (self._dbRunning) {
        logger.error(compObj.name + ' abruptly exiting,  code:' + code + ', PID: ' + proc.pid);
      } else {
        logger.info(compObj.name + ' exiting , code:' + code + ', PID: ' + proc.pid);
      }
    });
    /* Listen to process errors */
    proc.on('error', (code) => {
      logger.error(compObj.name + ': ' + code);
    });

  }

  /**
   * Configure component parameters for execution.
   * @param {object} compObj - The component object to be downloaded.
   */
  _configure(compObj) {

    /* the component flags if any */
    let flags = [];

    /* If component is configurable via file */
    if (compObj.configFlags) {

      /* Loading the config file */
      let defaultConfig = YAML.load(__dirname + '/../binaries/' + compObj.dir + '/' + compObj.config) || {};

      /* Modify all flags */
      for (let f in compObj.configFlags) {
        defaultConfig[f] = compObj.configFlags[f];
      }
      /* Creating new YAML */
      let newConfig = YAML.stringify(defaultConfig, 4);
      /* overwrite the default config file */
      fs.writeFileSync(__dirname + '/../binaries/' + compObj.dir + '/' + compObj.config, newConfig);
    }

    /* return command line arguments */
    return compObj.cmdFlags;
  }


}

/* exporting the module */
module.exports = ComponentExecutor;
