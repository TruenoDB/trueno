"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database external API class.
 * @module lib/core/api/external-api
 * @see module:lib/core/initialize/init
 */

/** Import modules */
const Promise = require("bluebird");
const RPC = require('../communication/rpc');
const Message = require('../communication/message');
const SimpleGraphAPI = require('../../backend/trueno-graph-simple');

// FIXME: Temporary. Redesign backend to adjust to new model. Right now, just make the changes to make it work.

/* Compute Modules */
const ComputeScheduler = require("../../compute/scheduler/compute_scheduler");

/** Indexing modules */
const SearchManager = require("../../search/search-manager");

/** Description of the class */
class ExternalAPI {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Exposing host and port */
    this._host = param.host || 'http://localhost';
    this._port = param.port || 8000;
    this._sHost = param.sHost || 'http://localhost';
    this._sPort = param.sPort || 8004;
    this._rpc = null;
    this._search = null;
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
      let rpc = new RPC({port: this._port, host: this._host});

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

    /* Instantiate Search Manager */
    this._search = new SearchManager({host: this._sHost, port: this._sPort});
    /* Initializing search manager */
    let searchPromise = this._search.init();

    /* resolving both promises */
    return Promise.all([rpcPromise, searchPromise]);

  }

  /********************************* DRIVERS EXTERNAL API METHODS *********************************/

  /**
   * [DESCRIPTION].
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_fetch(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    if (pld.ftr) {
      let filter = this._search.buildFilter(pld.ftr);
      console.log('Filter for this search is:', JSON.stringify(filter.build()));
    }

    /* logging */
    logger.info('ex_fetch invoked', pld);
  }

  /**
   * [DESCRIPTION].
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_count(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    if (pld.ftr) {
      let filter = this._search.buildFilter(pld.ftr);
      console.log('Filter for this search is:', JSON.stringify(filter.build()));
    }

    /* logging */
    logger.info('ex_count invoked', pld);
  }

  /**
   * [DESCRIPTION].
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_destroy(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;

    if (pld.ftr) {
      let filter = this._search.buildFilter(pld.ftr);
      console.log('Filter for this search is:', JSON.stringify(filter.build()));
    }

    /* logging */
    logger.info('ex_destroy invoked', pld);
  }

  /**
   * [DESCRIPTION].
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_persist(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;
    /* logging */
    logger.info('ex_persist invoked', pld);
  }

  /**
   * [DESCRIPTION].
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
   * [DESCRIPTION].
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

    /* logging */
    logger.info('ex_neighbors invoked', pld);
  }

  /**
   * [DESCRIPTION].
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {Message} msg - The message with the payload.
   */
  ex_vertices(reply, msg) {

    /* This instance object reference */
    let self = this;
    /* extracting message payload */
    let pld = msg._payload;
    /* logging */
    logger.info('ex_vertices invoked', pld);
  }

  /********************************* GRAPH EXTERNAL API METHODS *********************************/

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

  /********************************* VERTEX EXTERNAL API METHODS *********************************/

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

  /********************************* EDGE EXTERNAL API METHODS *********************************/

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

  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< COMPUTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

  /**
   * Compute Algorithm API method to be invoked by external client driver.
   * @param {function} reply - Reply function for the request(send back to the client).
   * @param {object} msg - The requested job object, it must include the following
   * - Algorithm type
   * - Personalized Parameter matching Algorithm Requirements
   * Object expected: job
   * job.algorithm.type
   * job.algorithm.property.graph,
   * job.algorithm.property.TOL,
   * job.algorithm.property.resetProb
   * job.algorithm.property.maxIterations
   */
  ex_compute(reply, msg) {

    let self = this;

    /* Message payload */
    let messagePayload = msg;

    /* Logging */
    logger.debug('ex_compute invoked', messagePayload);
    console.log(messagePayload);

    /* Connection settings */
    var options = {
      parent: self
    };

    /* The spark library connection variable */
    let objComputeScheduler = new ComputeScheduler(options);

    let objJob = {
      algorithm: {
        algorithmType: messagePayload.algorithm.type,
        graph: messagePayload.algorithm.graph,
        TOL: messagePayload.algorithm.TOL,
        alpha: messagePayload.algorithm.resetProb
      }
    };

    /* Promise based Dynamic Version of PageRank */
    /* Request a job of type PageRank and receives a jobId */
    /* JobId will be used to keep track of the submitted jobs */
    /* Keeping status of jobs will help in Web UI */
    objComputeScheduler._ex_compute(objJob).then((jobId) => {

      /* Obtaining the PageRank JobId from the promise */
      console.log("[Compute] jobId -> " + jobId);

      /* Create Reply Message Payload */
      msg = Message.buildMessage({payload: {code: 0, result: jobId}});

      /* Reply to the client */
      reply(msg);

    }, (err) => {

      /* Error in Promise */
      console.log("Error: " + err);

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

    let self = this;

    /** Message payload */
    let messagePayload = msg.payload;

    /** Logging */
    logger.debug('ex_computeJobStatus invoked', messagePayload);

    /** Connection settings */
    var options = {
      parent: self
    };

    /** The spark library connection variable */
    let objComputeScheduler = new ComputeScheduler(options);

    let jobId = messagePayload.jobId;

    /**
     * Promise based Dynamic Version of PageRank
     * Uses the jobId to obtain the Result
     * JobId will be used to keep track of the submitted jobs
     * Keeping status of jobs will help in Web UI
     * Object expected: job
     */
    objComputeScheduler._ex_computeJobStatus(jobId).then((status) => {

      /* Obtaining the PageRank JobId from the promise */
      console.log("[Compute] jobId [" + jobId + "] -> status " + status);

      /* Create Reply Message Payload */
      msg = Message.buildMessage({payload: {code: 0, result: status}});

      /* Reply to the client */
      reply(msg);

    }, (err)=> {

      /* Error in Promise */
      console.log("Error: " + err);

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

    let self = this;

    /* Message payload */
    let messagePayload = msg.payload;

    /* Logging */
    logger.debug('ex_computeJobResult invoked', messagePayload);

    /* Connection settings */
    var options = {
      parent: self
    };

    /** The spark library connection variable */
    let objComputeScheduler = new ComputeScheduler(options);

    let jobId = messagePayload.jobId;

    /**
     * JobId will be used to keep track of the submitted jobs
     * JobID is used to obtain the result from the Job Server
     * Keeping status of jobs will help in Web UI
     * Object expected: job
     */
    objComputeScheduler._ex_computeJobStatus(jobId).then((result) => {

      /** Obtaining the JobId */
      console.log("[Compute] jobId [" + jobId + "] -> result " + result);

      /** Create Reply Message Payload */
      msg = Message.buildMessage({payload: {code: 0, result: result}});

      /** Reply to the client */
      reply(msg);

    }, (err)=> {

      /** Error in Promise */
      console.log("Error: " + err);

    });

  }//ex_computeJobResult


  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END COMPUTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

}//External API


/* exporting the module */
module.exports = ExternalAPI;
