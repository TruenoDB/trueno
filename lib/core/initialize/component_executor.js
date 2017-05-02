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
    /* return execution promise */
    return new Promise((resolve, reject)=> {

      /* build all promises */
      /* Start PM2 supervisor either in daemon or non daemon mode */
      pm2.connect(function (err) {
        if (err) {
          console.log(err);
          process.exit(2);
        }
        /* run all components */
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
        Promise.all(promiseArray).then(()=> {
          /* disconnect from PM2 */
          pm2.disconnect();
          /* resolve the promise */
          resolve();
        });
      });
    });
  }

  /**
   * Stop all processes.
   */
  stop() {
    /* return exit promise */
    return new Promise((resolve, reject)=> {
      /* path to pm2 */
      let pm2Path = path.normalize(__dirname + "/../../../node_modules/pm2/bin/pm2");
      /* stop the execution */
      shell.exec(pm2Path + " kill", {async: false});
      /* Resolve the promise */
      resolve();
    });
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

    /* set the download number */
    compObj.num = this._compCount - this._components.length;
    /* path to pm2 */
    let pm2Path = path.normalize(__dirname + "/../../../node_modules/pm2/bin/pm2");
    /* Extracting command depending on the platform type: Unix or Windows */
    var cmd = (/^win/.test(process.platform)) ? compObj.cmdWin : compObj.cmdUnix;
    /* building parameters */
    self._configure(compObj);
    /* Join the command line arguments and split by space, or set the regular array */
    let cmdFlags = (compObj.hasOwnProperty("joinCmdFlags")) ? compObj.cmdFlags.join(compObj.joinCmdFlags).split(" ") : compObj.cmdFlags;
    /* component base directory */
    let componentPath = path.normalize(__dirname + '/../binaries/' + compObj.dir);
    /* starting process with working directory as the component root */
    logger.debug(compObj.name + ': ' + componentPath + '/' + cmd + ' ' + cmdFlags);
    /* process object */
    let proc = {
      name: compObj.name.replace(/\s/g, "-"),
      interpreter: compObj.interpreter,
      script: cmd,
      args: cmdFlags,
      silent: false,
      cwd: componentPath
    };
    /* start process */
    pm2.start(proc, function (err, apps) {
      if (err) throw err
      /* disconnect pm2 */
      //pm2.disconnect();
      let outputFlag = (compObj.suppressErrors) ? "--err" : "--out";
      /* get process stdout */
      let child = spawn(pm2Path, ["logs", compObj.name.replace(/\s/g, "-"), outputFlag, "--raw"], {shell: true});
      /* Monitoring standard output */
      child.stdout.on('data', (data) => {
        /* logging if debbug */
        logger.debug(compObj.name + ': ' + data);
        /* If ready string found, continue with next component */
        if (data.includes(compObj.readyString)) {
          /* Component sucessfully started */
          logger.info(compObj.name + ' successfully started!');
          /* executing next component if any */
          if (compObj.next.length > 0) {
            compObj.next.forEach((n)=> {
              logger.info(compObj.name + ' -> next -> ' + Components[n].name);
              self.run(Components[n], resolve, reject);
            });
          } else {
            /* Resolving the execution promise */
            resolve();
          }
        }
      });
      /* Monitoring standard errors */
      child.stdout.on('error', (data) => {
        /* logging if debbug */
        logger.debug(compObj.name + '[ERROR]: ' + data);
      });
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
