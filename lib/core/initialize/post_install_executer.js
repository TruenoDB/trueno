"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database post installation executer.
 * @module lib/core/initialize/post_install_executer
 * @see module:lib/trueno-setup
 */

/** Import modules */
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const fs = require('fs');
const YAML = require('yamljs');
/* Loading YAML configuration file */
let Components = YAML.load(__dirname + '/../../../conf/trueno-post-install.yaml');

/** Description of the class */
class PostInstallExecutor {

  /**
   * Create a component runner object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {
    /* Get all component names */
    this._components = Object.keys(Components);
    this._compCount = this._components.length;
    this._processes = {};
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
    logger.info('Executing Trueno Post Install... This may take a while.');
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
   * Execute the next post install script.
   * @param {object} compObj - The component object to be downloaded.
   * @param {function} resolve - Promise resolve function.
   * @param {function} reject - Promise reject function.
   */
  run(compObj, resolve, reject) {
    /* This instance object reference */
    var self = this;
    /* set the download number */
    compObj.num = this._compCount - this._components.length;
    /* Extracting command depending on the platform type: Unix or Windows */
    var cmd = (/^win/.test(process.platform)) ? compObj.cmdWin : compObj.cmdUnix;
    /* starting process with working directory as the component root */
    let proc = spawn(cmd, compObj.cmdFlags, {cwd: __dirname + '/../binaries/' + compObj.dir, shell: true});
    /* saving the process */
    self._processes[compObj.name] = proc;
    /* Monitoring standard output */
    proc.stdout.on('data', (data) => {
      /* logging if debbug */
      logger.debug(compObj.name + ': ' + data);
      /* If ready string found, continue with next component */
      if (data.includes(compObj.readyString)) {
        /* Component sucessfully started */
        logger.info(compObj.name + ' post installation successful');
        /* comp installed flag */
        compObj.installed = true;
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
      if (compObj.installed) {
        logger.info(compObj.name + ' installation closing');
      } else {
        logger.info(compObj.name + ' installation failed, please use debug flag to see log output.');
      }
    });
    /* Listen to process errors */
    proc.on('error', (code) => {
      logger.error(code);
    });
  }

}

/* exporting the module */
module.exports = PostInstallExecutor;