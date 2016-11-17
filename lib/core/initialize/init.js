"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database initialization and startup module.
 * @module lib/core/initialize/init
 * @see core/trueno-start
 */

/** Import modules */
const Promise = require("bluebird");
const Logger = require("../logging/logger");
const InternalAPI = require('../api/internal-api');
const ExternalAPI = require('../api/external-api');
const Status = require('../status/status');
const StorageManager = require('../../backend/trueno-storage-manager');
const ComponentExecutor = require('./component_executor');
const pm2GUI = require('pm2-gui');
const shell = require('shelljs');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');
const ini = require('ini');

/** Description of the class */
class Init {
  /**
   * Create init object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Create the status object */
    this._status = new Status();
    /* Add status to params */
    param.status = this._status;

    /* Init Logger */
    global.logger = new Logger({'debug': param.debug});

    /* IMPORTANT: Initialize configuration */
    this._initConfig(param);
    /* Set Connection Collection Object */
    this._initConnections(param);

    /* Create external API */
    this._extAPI = new ExternalAPI(param);
    /* Create internal API */
    this._intAPI = new InternalAPI(param);
    /* Component executor */
    this._executor = new ComponentExecutor(param);
  }

  /* Initialize Configuration to overwrite provided parameters */
  _initConfig(param) {
    /* Loading configuration */
    global.config = YAML.load(__dirname + '/../../../conf/trueno-config.yaml');
    /* Overwrite config if host is provided */
    param.host = param.host || 'localhost'; //require('os').hostname();
    /* setting new host */
    global.config.local.host = param.host;
    /* extracting components */
    let Components = global.config.components;
    /* for all components, overwrite host */
    for (var k in Components) {
      /* Overwrite hostname port binding in all configuration files */
      if (Components[k].hostMappings) {
        /* For all overwrites in the mappings array */
        Components[k].hostMappings.forEach((mapping)=> {
          let property = Components[k];
          /* iterate until find the property to overwrite */
          mapping.forEach((element, index)=> {
            /* if the last element, assign new host */
            if (mapping.length == (index + 1)) {
              property[element] = param.host;
            } else {
              property = property[element];
            }
          });
        });
      }
      /* Overwrite cluster peers addresses */
      if (Components[k].clusterMappings && param.clusterHosts) {
        /* For all overwrites in the mappings array */
        Components[k].clusterMappings.forEach((mapping)=> {
          let property = Components[k];
          /* iterate until find the property to overwrite */
          mapping.forEach((element, index)=> {
            /* if the last element, assign new host */
            if (mapping.length == (index + 1)) {
              switch (property[element].constructor.name) {
                case "Array":
                  /* Set cluster host array */
                  property[element] = Object.keys(param.clusterHosts);
                  break;
                case "String":
                  /* Set cluster host array separated by comma */
                  property[element] = Object.keys(param.clusterHosts).join(',');
                  break;
                default:
                  throw new Error("Cluster configuration error: field type not supported: " + property[element].constructor.name);
              }
            } else {
              property = property[element];
            }
          });
        });
      }

    }

    /* if cluster mode, check which components to deploy in this machine */
    if (param.clusterHosts) {
      /* Set this machine components */
      if (param.clusterHosts[param.host]) {
        /* deploy backend */
        Components.cassandra.deploy = param.clusterHosts[param.host].backend && Components.cassandra.deploy;
        /* deploy index */
        Components.elasticsearch.deploy = param.clusterHosts[param.host].index && Components.elasticsearch.deploy;
        /* deploy compute server */
        Components.truenoComputeServer.deploy = param.clusterHosts[param.host].master && Components.truenoComputeServer.deploy;
        /* deploy compute master */
        Components.sparkMaster.deploy = param.clusterHosts[param.host].master && Components.sparkMaster.deploy;
        /* deploy compute worker */
        Components.sparkWorker.deploy = (param.clusterHosts[param.host].compute && !param.clusterHosts[param.host].master) && Components.sparkWorker.deploy;
      } else {
        logger.error("This machine host must match its entry in the cluster host file");
        process.exit();
      }
      /* set the master address to compute workers */
      for (let host in param.clusterHosts) {
        /* if this host contains the master set it to the worker address */
        if (param.clusterHosts[host].master) {
          /* set the master address to this worker */
          Components.sparkWorker.cmdFlags[2] = host;
          /* set the master */
          param.masterNode = host;
          break;
        }
      }
    }

    /* set PM2 Monitor configuration */
    var pm2Guiconfig = ini.parse(fs.readFileSync(__dirname + '/../../../conf/pm2-gui.ini', 'utf-8'));
    /* set remotes */
    for (let host in param.clusterHosts) {
      /* if it is not this host */
      if (global.config.local.host != host) {
        pm2Guiconfig.remotes[host.replace(/[^a-zA-Z_0-9]/g, "_")] = host + ":" + Components.ui.ports.pm2Gui;
      }
    }
    /* set the PM2 gui port */
    pm2Guiconfig.port = Components.ui.ports.pm2Gui;
    /* writing back the configuration file */
    fs.writeFileSync(__dirname + '/../../../conf/pm2-gui-custom.ini', ini.stringify(pm2Guiconfig));

    /* Set data directories if provided, else put default */
    let dataBasePath = (param.dir) ? param.dir + "/" : __dirname + "/../data/";
    /* directories for cassandra */
    Components.cassandra.configFlags.data_file_directories[0] = path.normalize(dataBasePath + Components.cassandra.configFlags.data_file_directories[0]);
    Components.cassandra.configFlags.commitlog_directory = path.normalize(dataBasePath + Components.cassandra.configFlags.commitlog_directory);
    Components.cassandra.configFlags.saved_caches_directory = path.normalize(dataBasePath + Components.cassandra.configFlags.saved_caches_directory);
    /* directories for elasticsearch */
    Components.elasticsearch.configFlags["path.data"] = path.normalize(dataBasePath + Components.elasticsearch.configFlags["path.data"]);
    /* Spark worker directory */
    Components.sparkWorker.cmdFlags[6] = path.normalize(dataBasePath + Components.sparkWorker.cmdFlags[6]);

    /* creating directories if don't exist */
    if (!fs.existsSync(Components.cassandra.configFlags.data_file_directories[0])) {
      shell.mkdir('-p', Components.cassandra.configFlags.data_file_directories[0]);
    }
    if (!fs.existsSync(Components.cassandra.configFlags.commitlog_directory)) {
      shell.mkdir('-p', Components.cassandra.configFlags.commitlog_directory);
    }
    if (!fs.existsSync(Components.cassandra.configFlags.saved_caches_directory)) {
      shell.mkdir('-p', Components.cassandra.configFlags.saved_caches_directory);
    }
    if (!fs.existsSync(Components.elasticsearch.configFlags["path.data"])) {
      shell.mkdir('-p', Components.elasticsearch.configFlags["path.data"]);
    }
    if (!fs.existsSync(Components.sparkWorker.cmdFlags[6])) {
      shell.mkdir('-p', Components.sparkWorker.cmdFlags[6]);
    }
  }

  /**
   * Init intra-cluster connections.
   */
  _initConnections(param) {
    /* initialize the global connections object */
    global.config.connections = {
      "index": [],
      "backend": [],
      "compute": []
    }

    if (param.clusterHosts) {
      /* add the cluster connections */
      for (let host in param.clusterHosts) {

        /* Add index connection to this host */
        if (param.clusterHosts[host].index) {
          global.config.connections.index.push({
            port: global.config.components.elasticsearch.configFlags['http.port'],
            host: host
          });
        }
        /* Add backend connection to this host */
        if (param.clusterHosts[host].backend) {
          global.config.connections.backend.push({
            port: global.config.components.cassandra.configFlags['native_transport_port'],
            host: host
          });
        }
        /* Add compute connection to this host */
        if (param.clusterHosts[host].compute) {
          global.config.connections.compute.push({
            host: host
          });
        }
      }

    } else {
      /* Set single connection for all components */
      global.config.connections.index.push({
        port: global.config.components.elasticsearch.configFlags['http.port'],
        host: global.config.local.host
      });
      global.config.connections.backend.push({
        port: global.config.components.cassandra.configFlags['native_transport_port'],
        host: global.config.local.host
      });
      global.config.connections.compute.push({
        host: global.config.local.host
      });
    }


  }

  /**
   * Verifies that all components are present before continuing.
   * @return {promise} The promise with success or error.
   */
  verifyComponents() {

    let components = YAML.load(__dirname + '/../../../conf/trueno-config.yaml').components;
    let postComponents = YAML.load(__dirname + '/../../../conf/trueno-post-install.yaml');
    let promises = [];

    /* check main components */
    for (var k in components) {
      promises.push(new Promise((resolve, reject)=> {
        /* the component reference */
        let cmp = components[k];
        /* check if verifiable */
        if (!cmp.dir) {
          resolve();
        }
        /* build the path */
        let compPath = path.normalize(__dirname + '/../binaries/' + cmp.dir + "/" + cmp.cmdUnix);
        fs.stat(compPath, function (err) {
          if (err) {
            reject(cmp.name + " not present, please run 'trueno setup' to install");
          } else {
            resolve();
          }
        });
      }));
    }
    /* check install components */
    for (var k in postComponents) {
      promises.push(new Promise((resolve, reject)=> {
        /* the component reference */
        let cmp = postComponents[k];
        /* check if verifiable */
        if (!cmp.dir || !cmp.sanitize) {
          resolve();
        }
        /* build the path */
        let compPath = path.normalize(__dirname + '/../binaries/' + cmp.dir + "/plugins/" + cmp.name);
        fs.stat(compPath, function (err, stats) {
          if (err) {
            reject(cmp.name + " not present, please run 'trueno setup -p' to install");
          } else {
            resolve();
          }
        });
      }));
    }
    /* return promise when resolved */
    return Promise.all(promises);
  }

  /**
   * Check and start all components before running the main database process.
   * @return {promise} The promise with success or error.
   */
  startComponents() {
    /* Executing all components */
    return this._executor.execute();
  }

  /**
   * Stop all components.
   * @return {promise} The promise with success or error.
   */
  stopComponents() {
    /* Executing all components */
    return this._executor.stop();
  }

  /**
   * Change running status.
   * @param {boolean} s - True or false value for the running status indicator.
   */
  setRunningState(s) {
    /* Change running status */
    this._executor.setRunningState(s);
  }

  /**
   * Start database process.
   * @return {promise} The promise with success or error on the starting process.
   */
  start() {

    /* This instance object reference */
    let self = this;

    /* return outer promise */
    return new Promise((resolve, reject)=> {

      /* Start Promise chain initialization */
      /* Initializing the internal API */
      self._intAPI.init().then((addrs)=> {

        /* Successfully started Internal api */
        logger.info('Internal API awaiting for connections at: ' + addrs);

        /* initialize internal api ASAP */
        return self._extAPI.init();

      }, (error)=> {
        logger.error('Error while initializing Internal API.', error);
      }).then((addrs)=> {

        /* Initialize PM2 GUI monitor */
        let pm2GuiPath = path.normalize(__dirname + "/../../../node_modules/pm2-gui/pm2-gui");
        shell.exec(pm2GuiPath + " start " + __dirname + "/../../../conf/pm2-gui-custom.ini", {
          async: true,
          silent: true
        })
        .stdout.on('data', function (data) {
          logger.info('PM2-UI Monitor: ' + data);
        });
        /* Successfully started external api */
        logger.info('ElasticSeach engine connected at: ' + JSON.stringify(addrs[1]));
        logger.info('External API awaiting for connections at: ' + addrs[0]);

        /* Initializing the internal API */
        return self._status.collectStatus();

      }, (error)=> {
        logger.error('Error while initializing External API.', error);
      }).then((addrs)=> {


        /* Initializing the internal API */
        return self._status.collectStatus();

      }, (error)=> {
        logger.error('Error while initializing Internal API.', error);
      }).then((status)=> {

        /* Successfully started Internal api */
        logger.info('Cluster status collected. ', status);

        /* Initializing backend storage */
        return StorageManager.init();

      }, (error)=> {
        logger.error('Collecting cluster status.', error);
      }).then((status) => {

        /* Successfully initialized backend storage */
        logger.info('Backend storage is running OK');

      }, (error) => {
        logger.error('Error initializing backend', error);
      });
    })
  }
}


/* exporting the module */
module.exports = Init;
