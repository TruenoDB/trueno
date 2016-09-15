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
const YAML = require('yamljs');

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

    /* IMPORTANT: Initialize configuration */
    this._initConfig(param);
    /* Set Connection Collection Object */
    this._initConnections(param);

    /* Init Logger */
    global.logger = new Logger({'debug': param.debug});

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
    param.host = param.host || require('os').hostname();
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
   * @return {promise} The promise with success or error on the starting procss.
   */
  start() {

    /* This instance object reference */
    let self = this;

    /* Change process tittle */
    process.title = "Trueno-Core";

    return new Promise((resolve, reject)=> {

      self._extAPI.init().then((addrs)=> {

        /* Successfully started external api */
        logger.info('ElasticSeach engine connected at: ' + JSON.stringify(addrs[1]));
        logger.info('External API awaiting for connections at: ' + addrs[0]);

        /* Initializing the internal API */
        return self._intAPI.init();

      }, (error)=> {
        logger.error('Error while initializing External API.', error);
      }).then((addrs)=> {

        /* Successfully started Internal api */
        logger.info('Internal API awaiting for connections at: ' + addrs);

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
