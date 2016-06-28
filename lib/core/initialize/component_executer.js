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
let Components = require('./components.json');

/** Description of the class */
class ComponentExecuter {

  /**
   * Create a component runner object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {
    /* Get all component names */
    this._components = Object.keys(Components);
    this._compCount = this._components.length;
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
    logger.info('Executing Trueno Components... This may take a while.');
    /* build all promises */
    for (var k in Components) {
      /* if the component is executable, then build the promise */
      if (Components[k].cmdUnix) {
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
   * Download the next component.
   * @param {string} comp - String with the component property name in the Components object.
   */
  run(compObj, resolve, reject) {
    /* This instance object reference */
    var self = this;

    /* set the download number */
    compObj.num = this._compCount - this._components.length;
    /* Extracting command depending on the platform type: Unix or Windows */
    var cmd = (/^win/.test(process.platform)) ? compObj.cmdWin : compObj.cmdUnix;
    /* building parameters */
    let flags = [];
    compObj.flags.forEach((f)=>{
      flags.push(f[0] +' '+ f[1]);
    });
    /* starting process with working directory as the component root */
    const proc = spawn(cmd, flags, {cwd: __dirname + '/../binaries/' + compObj.dir, shell: true});

    /* Monitoring standard output */
    proc.stdout.on('data', (data) => {
      /* If ready string found, continue with next component */
      if (data.includes(compObj.readyString)) {
        /* Component sucessfully started */
        logger.info(compObj.name + ' successfully started...');
        /* Resolving the execution promise */
        resolve();
      }
    });
    /* Monitoring standard error */
    proc.stderr.on('data', (data) => {
      logger.error(compObj.name + ': ' + data);
    });
    /* Monitoring process exit */
    proc.on('close', (code) => {
      if (self._dbRunning) {
        logger.error(compObj.name + ': Exiting without stopping DB ' + code);
      } else {
        logger.info(compObj.name + ': Exiting ' + code);
      }

    });
  }


}

/* exporting the module */
module.exports = ComponentExecuter;