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
    /* cleaning post install directory if any */
    this.clean();
    /* Logging start message */
    logger.info('Executing Trueno Post Install... This may take a while.');
    /* return outer promise */
    return new Promise((resolve, reject)=> {
      /* Get all components recursively */
      self.run(Components[self._components.pop()], 0, resolve, reject);
    });
  }

  /**
   * Cleans all post install binaries.
   */
  clean() {
    /* logging cleaning */
    logger.info('Cleaning post install directory...');
    /* removing Elastic Search components */
    shell.rm('-rf', __dirname + '/../binaries/elasticsearch/plugins/*');
  }

  /**
   * Execute the next post install script.
   * @param {object} compObj - The component object to be downloaded.
   * @param {function} resolve - Promise resolve function.
   * @param {function} reject - Promise reject function.
   */
  run(compObj, tryCount, resolve, reject) {
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
        /* go to the next component */
        if (self._components.length > 0) {
          /* Get all components recursively */
          self.run(Components[self._components.pop()], 0, resolve, reject);
        } else {
          /* done with component installation */
          resolve();
        }
      } else {
        if (tryCount < 5) {
          /* log error message */
          logger.info(compObj.name + ' installation failed, please use debug flag to see log output. Try #'+tryCount);
          /* retry this component */
          self.run(compObj, tryCount + 1, resolve, reject);
        } else {
          reject("Unable to install " + compObj.name + ", check your internet connection and disk space and retry later executing 'trueno setup -p'");
        }

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