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
/* Loading YAML configuration file */
let Components = YAML.load(__dirname + '/../../../conf/trueno-single.yaml').components;

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
    /* building parameters */
    self._configure(compObj);

    /* starting process with working directory as the component root */
    const proc = spawn(cmd, compObj.cmdFlags, {cwd: __dirname + '/../binaries/' + compObj.dir, shell: true});

    /* Monitoring standard output */
    proc.stdout.on('data', (data) => {
      /* logging if debbug */
      logger.debug(compObj.name + ': ' + data);
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
      let defaultConfig = YAML.load(__dirname + '/../binaries/' + compObj.dir + '/' + compObj.config);
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
module.exports = ComponentExecuter;