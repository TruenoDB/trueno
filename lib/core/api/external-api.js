"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database external API class.
 * @module lib/core/api/external-api
 * @see module:lib/core/initialize/init
 */

/** Import modules */
const ComputeScheduler = require("../../compute/scheduler/compute_scheduler");
const StorageManager = require('../../backend/trueno-storage-manager');
const SimpleGraphAPI = require('../../backend/trueno-graph-simple');
const SearchManager = require("../../search/search-manager");
const Message = require('../communication/message');
const Status = require('../communication/status');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');
const RPC = require('../communication/rpc');
const Promise = require("bluebird");
const HTTP = require('http');

// FIXME: Temporary. Redesign backend to adjust to new model. Right now, just make the changes to make it work.

/** Description of the class */
class ExternalAPI {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Exposing host and port */
    this._host = param.host || global.config.local.host;
    this._port = param.port || global.config.local.externalPort;
    this._sHost = param.sHost || global.config.local.host;
    this._sPort = param.sPort || global.config.components.elasticsearch.configFlags['http.port'];
    this._serve = serveStatic(__dirname + '/../../ui/web_console/app/', {'index': ['index.html', 'index.htm']});
    this._app = HTTP.createServer(this._httpHandler.bind(this));
    this._rpc = null;
    this._search = null;
    this._storage = null;
  }

  /**
   * Create and binds all external methods to the RPC object.
   */
  init() {

    /* This instance object reference */
    let self = this;

    /* Initializing RPC promise */
    let rpcPromise = new Promise((resolve, reject)=> {

      /* Get new rpc socket server instance */
      let rpc = new RPC({port: this._port, host: this._host, app: this._app});

      /* Binding external methods extracting each prototype */
      Object.getOwnPropertyNames(Object.getPrototypeOf(self)).filter((p)=> {
        /* Filter all external method */
        return p.includes('ex_');
      }).forEach((p)=> {
        /* Binding each external method */
        rpc.expose(p, self[p].bind(self));
      });

      /* Start listening at the indicated host and port, resolve or reject promise
       * depending on outcome */
      rpc.listen((socket)=> {
        //TODO: Client connected
        logger.info('Client ' + socket.id + ' connected!');
      }, (socket)=> {
        //TODO: Client connected
        logger.info('Client ' + socket.id + ' disconnected!');
      });

      /* Assigning rpc to class */
      self._rpc = rpc;

      /* Resolve sync promise */
      resolve(self._host + ':' + self._port);
    });

    /* Instantiate Backing Storage Manager */
    this._storage = new StorageManager();

    /* Instantiate Search Manager */
    this._search = new SearchManager({host: this._sHost, port: this._sPort});
    /* Initializing search manager */
    let searchPromise = this._search.init();

    /* Instantiate Compute Scheduler */
    self._compute = new ComputeScheduler();

    /* resolving both promises */
    return Promise.all([rpcPromise, searchPromise]);

  }

  /**
   * The HTTP Server handler.
   */
  _httpHandler(req, res) {

    /* Serve web console */
    var done = finalhandler(req, res);
    this._serve(req, res, done)
  }

  /* =========================== DRIVERS EXTERNAL API METHODS =========================== */

  /**
   * Return components matching a query.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_fetch(reply, msg) {

    //logger.info('ex_fetch');

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    if (pld.ftr) {
      let filter = self._search.buildFilter(pld.ftr);
      //console.log('Filter for this search is:', JSON.stringify(filter.build()));
    }

    /* if type is graph search on all indices */
    if(pld.type.toLowerCase() === 'g'){
      pld.graph = '*';
    }

    /* Fetching data from elastic search */
    self._search.fetch(pld.ftr, pld.graph, pld.type, pld.mask).then((results)=> {
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      reply(rsp);
    }, (error)=> {
      console.log(error);
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error.body.error});
      reply(rsp);
    });


    /* logging */
    //logger.info('ex_fetch invoked', pld);

  }

  /**
   * Get the number of documents for the cluster, index, type, or a query.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_count(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    if (pld.ftr) {
      let filter = self._search.buildFilter(pld.ftr);
      console.log('Filter for this search is:', JSON.stringify(filter.build()));
    }

    /* Counting results of data from elastic search */
    self._search.count(pld.ftr, pld.graph, pld.type).then((results)=> {
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      reply(rsp);
    }, (error)=> {
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error.body.error});
      reply(rsp);
    });

    /* logging */
    logger.info('ex_count invoked', pld);
  }

  /**
   * Delete a typed JSON document from a specific index based on its id.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_destroy(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;
    /* promises collection for multiple operations */
    let promises = [];

    /* destroy in elastic search */
    promises.push(self._search.destroy(pld.obj, pld.ftr, pld.graph, pld.type));
    /* destroy objects in the storage backend (C*) */
    /* FIXME: destroy on storage does not support filter */
    promises.push(self._storage.destroy(pld.obj, pld.graph, pld.type));

    /* resolve all promises */
    Promise.all(promises).then((results)=> {
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: true});
      reply(rsp);
    }, (error)=> {
      let err = (error.hasOwnProperty('body.error')) ? error.body.error : error;
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: err});
      reply(rsp);
    });

    /* logging */
    logger.info('ex_destroy invoked', pld);
  }

  /**
   * Creates the index and stores data to the backend.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_persist(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;
    /* promises collection for multiple operations */
    let promises = [];

    /* Persisting in backing storage */
    promises.push(self._storage.persist(pld.obj, pld.graph, pld.type));
    /* Persisting in elastic search */
    promises.push(self._search.persist(pld.obj, pld.graph, pld.type));

    /* resolve all promises */
    Promise.all(promises).then((results)=> {
      logger.info('ex_persist. [', pld.type, '] Successful! ');
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      reply(rsp);
    }, (error)=> {
      logger.info('ex_persist. [', pld.type, '] Failure!');
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error});
      reply(rsp);
    });

    /* logging */
    // TOFIX. Temporaly commented. Implement a batch update, and used for sevenbridges toy graph.
    // logger.info('ex_persist invoked', pld);
  }

  /**
   * Insert the component, update will be done if id is provided
   * and only for existing fields.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_create(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;
    /* promises collection for multiple operations */
    let promises = [];

    /* Create in backing storage */
    // promises.push(self._storage.createGraph(pld.obj));
    /* Create in elastic search */
    promises.push(self._search.createGraph(pld.obj, pld.graph, pld.type));

    /* resolve all promises */
    Promise.all(promises).then((results)=> {
      logger.info('ex_create: graph successfully created ->  [', pld.graph, '] ', results);
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      reply(rsp);
    }, (error)=> {
      logger.info('ex_create: error while creating graph [', pld.graph, '] -> ', error);
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error});
      reply(rsp);
    });

    /* logging */
    logger.info('ex_create invoked', pld);
  }

  /**
   * Returns the info from an specific graph. If the graph does not exists in the backend, the graph is created.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_open(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;
    let obj = pld.obj;
    /* response */
    let rtn = [];

    /* Trying to retrieve graph from backend */
    self.ex_fetch(function(result) {
      if (result._status == Status.response.SUCCESS) {
        if (result._payload.length == 0) {
          /* the index was not found, let's create it on the backend */
          msg._payload.graph = obj.label;
          self.ex_create(function(res) {
            if (res._status == Status.response.SUCCESS) {
              /* if success return the same object that was created */
              let payload = {};
              obj.id = obj.label;
              payload._source = obj;
              rtn.push(payload);
              let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: rtn});
              reply(rsp);
            } else {
              reply(res);
            }
          }, msg);
        } else {
          reply(result);
        }
      } else {
        reply(result)
      }
    }, msg);

    /* logging */
    logger.info('ex_open invoked', pld);
  }

  /**
   * In graph theory, the degree (or valency) of a vertex of a graph
   * is the number of edges incident to the vertex
   * This method returns the degree associated with the graph G
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_degree(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    if (pld.ftr) {
      let filter = this._search.buildFilter(pld.ftr);
      console.log('Filter for this search is:', JSON.stringify(filter.build()));
    }

    /* logging */
    logger.info('ex_degree invoked', pld);
  }

  /**
   * The neighbourhood of a vertex v in a graph G is the induced subgraph of G
   * consisting of all vertices adjacent to v.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_neighbors(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    if (pld.ftr) {
      let filter = this._search.buildFilter(pld.ftr);
      console.log('Filter for this search is:', JSON.stringify(filter.build()));
    }

    /* Searching neighbors of node v c V in G=(V,E) from elastic search */
    self._search.neighbors(pld.id, pld.ftr, pld.sFtr, pld.dir, pld.graph, pld.cmp).then((results)=> {
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      logger.info('ex_neighbors results', results.length);
      reply(rsp);
    }, (error)=> {
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error.body.error});
      reply(rsp);
    });

    /* logging */
    logger.info('ex_neighbors invoked', pld);
  }

  /**
   * Fetch the vertices attached to a determined edge e
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_vertices(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    /* Persisting in elastic search */
    this._search.vertices(pld.id, pld.graph).then((results)=> {
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      reply(rsp);
    }, (error)=> {
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error});
      reply(rsp);
    });

    /* logging */
    logger.info('ex_vertices invoked', pld);
  }

  /**
   * Executes SQL query on the indexing engine.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_sql(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    /* Persisting in elastic search */
    this._search.sql(pld.q).then((results)=> {
      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      reply(rsp);
    }, (error)=> {
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error});
      reply(rsp);
    });

    /* logging */
    logger.info('ex_sql invoked', pld);
  }

  /**
   * Executes bulk operations on the elasticsearch engine and backend.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_bulk(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;
    /* promises collection for multiple operations */
    let bPromises = [], iPromises = [];
    /* split operations */
    let backendBuffer = pld.operations.slice();
    let indexBuffer = pld.operations.slice();
    /* Insert execution timers */
    let bStart, bElapsed, iStart, iElapsed;

    /* start backend insert timer */
    iStart = new Date();
    /* Insert operations in batches of 300(found optimal)*/
    while (indexBuffer.length) {
      /* Persisting in elastic search */
      iPromises.push(self._search.bulk(indexBuffer.splice(0, 1000), pld.graph));
    }

    // /* start backend insert timer */
    // bStart = new Date();
    // /* Insert operations in batches of 15(recommended optimal)*/
    // while (backendBuffer.length) {
    //   /* Persisting in storage backend */
    //   bPromises.push(self._storage.bulk(backendBuffer.splice(0, 1000), pld.graph));
    // }

    /* backend final promise */
    let iFinalPromise = Promise.all(iPromises).then((res)=> {
      iElapsed = new Date() - iStart;
      return {index: res};
    });

    // /* backend final promise */
    // let bFinalPromise = Promise.all(bPromises).then((res)=> {
    //   bElapsed = new Date() - bStart;
    //   return {backend: res};
    // });


    /* resolve all promises */
    Promise.all([/*bFinalPromise,*/ iFinalPromise]).then((results)=> {
      /* logging times */
      logger.info('bulk times, backend: ', bElapsed, 'ms, index: ', iElapsed, 'ms, ratio(b/i): ', bElapsed/iElapsed);

      let rsp = Message.buildMessage({status: Status.response.SUCCESS, payload: results});
      reply(rsp);
    }, (error)=> {
      logger.info('bulk error: ', error);
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error});
      reply(rsp);
    });

    /* logging */
    logger.info('ex_bulk invoked', pld.operations.length);
  }

  /* FIXME. The function below are useless. All the functionaly was replaced by the function above.
     These function are deprecated, and will be deleted in the next days. All the .js who invoke them will
     be retooled or deleted. */
  /* ============================ GRAPH EXTERNAL API METHODS ============================ */

  /**
   * Create graph API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The graph to be created.
   */
  ex_createGraph(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let g = msg._payload;
    /* logging */
    logger.debug('ex_createGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph: g._property._id});
    /* This returns a promise inmediately */
    G.addGraph(g).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}, status: 0});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}, status: 0});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Update graph method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The graph to be updated.
   */
  ex_updateGraph(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let g = msg._payload;
    /* logging */
    logger.debug('ex_updateGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph: g._property._id});
    /* This returns a promise immediately */
    G.updateGraph(g).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Delete graph method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The graph to be deleted.
   */
  ex_deleteGraph(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let g = msg._payload;
    /* logging */
    logger.debug('ex_deleteGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph: g._property._id});
    /* This returns a promise inmediately */
    G.removeGraph(g).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Get graph API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The requested graph object, must contain name.
   */
  ex_getGraph(reply, msg) {


    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let g = msg._payload;
    /* logging */
    logger.debug('ex_getGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph: g._property._id});
    /* This returns a promise immediately */
    G.getGraph(g).then((graph)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0, result: graph}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Get graph list API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The requested graph object, fields will be used
   * as filters. Filtered graphs will be returned in a array collection.
   */
  ex_getGraphList(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    //let g = msg.payload;
    /* logging */
    logger.debug('ex_getGraphList invoked');

    /* backend */
    let G = new SimpleGraphAPI();
    /* This returns a promise inmediately */
    G.getGraphList().then((list)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0, result: list}, status: 0});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}, status: -1});
      /* reply to the client */
      reply(msg);
    });
  }

  /* =========================== VERTEX EXTERNAL API METHODS ============================ */

  /**
   * Create vertex API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The vertex to be created.
   */
  ex_createVertex(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let v = msg._payload;
    /* logging */
    logger.debug('ex_createVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph: v._property._graphid});
    /* This returns a promise inmediately */
    G.addVertex(v).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}, status: 0});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}, status: -1});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Update vertex method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The vertex to be updated.
   */
  ex_updateVertex(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let v = msg._payload;
    /* logging */
    logger.debug('ex_updateVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph: v._property._graphid});
    /* This returns a promise inmediately */
    G.updateVertex(v).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Delete vertex method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} g - The vertex to be deleted.
   */
  ex_deleteVertex(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let v = msg._payload;
    /* logging */
    logger.debug('ex_deleteVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph: v._property._graphid});
    /* This returns a promise inmediately */
    G.removeVertex(v).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    //msg = Message.buildMessage({payload: v});
    ///* reply to the client */
    //reply(msg);
  }

  /**
   * Get vertex API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The requested vertex object, must contain id.
   */
  ex_getVertex(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let v = msg._payload;
    /* logging */
    logger.debug('ex_getVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph: v._property._graphid});
    /* This returns a promise inmediately */
    G.getVertex(v).then((vertex)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0, result: vertex}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    //msg = Message.buildMessage({payload: v});
    ///* reply to the client */
    //reply(msg);
  }

  /**
   * Get vertex list API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} v - The requested vertex object, fields will be used
   * as filters. Filtered vertices will be returned in a array collection.
   */
  ex_getVertexList(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let v = msg._payload;
    /* logging */
    logger.debug('ex_getVertexList invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph: v._property._graphid});
    /* This returns a promise inmediately */
    G.getVertexList(v).then((list)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0, result: list}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    //msg = Message.buildMessage({payload: v});
    ///* reply to the client */
    //reply(msg);

  }

  /* ============================ EDGE EXTERNAL API METHODS ============================= */

  /**
   * Create edge API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The edge to be created.
   */
  ex_createEdge(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let e = msg._payload;
    /* logging */
    logger.debug('ex_createEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph: e._property._graphid});
    /* This returns a promise immediately */
    G.addEdge(e).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    //msg = Message.buildMessage({payload: e});
    ///* reply to the client */
    //reply(msg);

  }

  /**
   * Update edge method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The edge to be updated.
   */
  ex_updateEdge(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let e = msg._payload;
    /* logging */
    logger.debug('ex_updateEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph: e._property._graphid});
    /* This returns a promise immediately */
    G.updateEdge(e).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    //msg = Message.buildMessage({payload: e});
    ///* reply to the client */
    //reply(msg);
  }

  /**
   * Delete edge method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The edge to be deleted, must contain id.
   */
  ex_deleteEdge(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let e = msg._payload;
    /* logging */
    logger.debug('ex_deleteEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph: e._property._graphid});
    /* This returns a promise inmediately */
    G.removeEdge(e).then(()=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Get edge API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The requested edge object, must contain id.
   */
  ex_getEdge(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let e = msg._payload;
    /* logging */
    logger.debug('ex_getEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph: e._property._graphid});
    /* This returns a promise immediately */
    G.getEdge(e).then((edge)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0, result: edge}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
  }

  /**
   * Get vertex list API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} e - The requested edge object, fields will be used
   * as filters. Filtered vertices will be returned in a array collection.
   */
  ex_getEdgeList(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let e = msg._payload;
    /* logging */
    logger.debug('ex_getEdgeList invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph: e._property._graphid});
    /* This returns a promise inmediately */
    G.getEdgeList(e).then((list)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: 0, result: list}});
      /* reply to the client */
      reply(msg);
    }, (err)=> {
      /* build message */
      msg = Message.buildMessage({payload: {code: -1, error: err}});
      /* reply to the client */
      reply(msg);
    });
  }

  /* ==================================== COMPUTE ======================================= */

  /**
   * Compute Algorithm API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - The requested job object, it must include the following:
   *  - Algorithm type
   *  - Personalized Parameter matching Algorithm Requirements
   * Object expected: job
   * job.algorithm.type
   * job.algorithm.property.graph,
   * job.algorithm.property.TOL,
   * job.algorithm.property.resetProb
   * job.algorithm.property.maxIterations
   */
  ex_compute(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* Extracting message payload */
    let pld = msg._payload;

    /* Logging */
    logger.debug('ex_compute invoked', pld);

    /* Request a job of type PageRank and receives a jobId */
    /* JobId will be used to keep track of the submitted jobs */
    /* Keeping status of jobs will help in Web UI */
    //objComputeScheduler._ex_compute(pld).then((jobId) => {
    self._compute._ex_compute(pld).then((jobId) => {
      /* Create Reply Message Payload */
      msg = Message.buildMessage({status: Status.response.SUCCESS, payload: {_jobId: jobId}});
      /* Reply to the client */
      reply(msg);
    }, (error) => {
      /* Error in Promise */
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error});//body.error
      reply(rsp);
    });

  }//ex_compute

  /**
   * Compute Algorithm API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - The requested job object, it must include the following
   * - Algorithm type
   * - Personalized Parameter matching Algorithm Requirements
   * Value expected: jobId
   */
  ex_computeJobStatus(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* Extracting message payload */
    let pld = msg._payload;

    /* Logging */
    logger.debug('ex_computeJobStatus invoked', pld);

    /* Obtaining jobId */
    let jobId = pld.jobId;

    /**
     * Promise based Dynamic Version of PageRank
     * Uses the jobId to obtain the Result
     * JobId will be used to keep track of the submitted jobs
     * Keeping status of jobs will help in Web UI
     * Object expected: job
     */
    self._compute._ex_computeJobStatus(jobId).then((status) => {
      /* Create Reply Message Payload */
      msg = Message.buildMessage({status: Status.response.SUCCESS, payload: {status: status}});
      /* Reply to the client */
      reply(msg);
    }, (error) => {
      /* Error in Promise */
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error.body.error});
      reply(rsp);
    });

  }//ex_computeJobStatus

  /**
   * Compute Algorithm API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - The requested job object, it must include the following
   * - Algorithm type
   * - Personalized Parameter matching Algorithm Requirements
   * Value expected: jobId
   * Returns the result when the status of the job is FINISHED
   */
  ex_computeJobResult(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* Extracting message payload */
    let pld = msg._payload;

    /* Logging */
    logger.debug('ex_computeJobResult invoked', pld);

    /* Obtaining jobId */
    let jobId = pld.jobId;

    /**
     * JobId is used to keep track of the submitted jobs
     * JobID is used to obtain the result from the Job Server
     * Object expected: job
     */
    self._compute._ex_computeJobResult(jobId).then((result) => {
      /** Create Reply Message Payload */
      msg = Message.buildMessage({status: Status.response.SUCCESS, payload: {result: result}});
      /** Reply to the client */
      reply(msg);
    }, (error) => {
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error.body.error});
      reply(rsp);
    });

  }//ex_computeJobResult

  /**
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - The requested job object, it must include the following
   */
  ex_getComputeAlgorithms(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* Extracting message payload */
    let pld = msg._payload;

    /* Logging */
    logger.debug('ex_getComputeAlgorithms invoked', pld);

    self._compute._ex_getComputeAlgorithms().then((result) => {
      /** Create Reply Message Payload */
      msg = Message.buildMessage({status: Status.response.SUCCESS, payload: {result: result}});
      /** Reply to the client */
      reply(msg);
    }, (error) => {
      let rsp = Message.buildMessage({status: Status.response.ERROR, payload: error.body.error});
      reply(rsp);
    });

  }//ex_getComputeAlgorithms

}//External API


/* exporting the module */
module.exports = ExternalAPI;
