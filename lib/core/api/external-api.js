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
    this._rpc = null;

  }

  /**
   * Create and binds all external methods to the RPC object.
   */
  init() {

    /* This instance object reference */
    let self = this;

    return new Promise((resolve, reject)=> {

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
    let g = msg.payload;
    /* logging */
    logger.debug('ex_createGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph : g.id});
    /* This returns a promise inmediately */
    G.addGraph(g).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The graph has been created!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: g});
    /* reply to the client */
    reply(msg);
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
    let g = msg.payload;
    /* logging */
    logger.debug('ex_updateGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph : g.id});
    /* This returns a promise inmediately */
    G.updateGraph(g).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The graph has been updated!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: g});
    /* reply to the client */
    reply(msg);
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
    let g = msg.payload;
    /* logging */
    logger.debug('ex_deleteGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph : g.id});
    /* This returns a promise inmediately */
    G.removeGraph(g).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The graph has been removed!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: g});
    /* reply to the client */
    reply(msg);
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
    let g = msg.payload;
    /* logging */
    logger.debug('ex_getGraph invoked', g);

    /* backend */
    let G = new SimpleGraphAPI({graph : g.id});
    /* This returns a promise inmediately */
    G.getGraph(g).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The graph have been retrieved!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: g});
    /* reply to the client */
    reply(msg);
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
    let g = msg.payload;
    /* logging */
    logger.debug('ex_getGraphList invoked', g);

    /* build message */
    msg = Message.buildMessage({payload: g});
    /* reply to the client */
    reply(msg);
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
    let v = msg.payload;
    /* logging */
    logger.debug('ex_createVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph : v.graphid});
    /* This returns a promise inmediately */
    G.addVertex(v).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The vertex has been created!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: v});
    /* reply to the client */
    reply(msg);

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
    let v = msg.payload;
    /* logging */
    logger.debug('ex_updateVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph : v.graphid});
    /* This returns a promise inmediately */
    G.updateVertex(v).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The vertex have been updated!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: v});
    /* reply to the client */
    reply(msg);

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
    let v = msg.payload;
    /* logging */
    logger.debug('ex_deleteVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph : v.graphid});
    /* This returns a promise inmediately */
    G.removeVertex(v).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The vertex have been removed!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: v});
    /* reply to the client */
    reply(msg);
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
    let v = msg.payload;
    /* logging */
    logger.debug('ex_getVertex invoked', v);

    /* backend */
    let G = new SimpleGraphAPI({graph : v.graphid});
    /* This returns a promise inmediately */
    G.getVertex(v).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The vertex have been retrieved!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: v});
    /* reply to the client */
    reply(msg);
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
    let v = msg.payload;
    /* logging */
    logger.debug('ex_getVertexList invoked', v);

    /* build message */
    msg = Message.buildMessage({payload: v});
    /* reply to the client */
    reply(msg);

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
    let e = msg.payload;
    /* logging */
    logger.debug('ex_createEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph : e.graphid});
    /* This returns a promise inmediately */
    G.addEdge(e).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The edge has been created!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: e});
    /* reply to the client */
    reply(msg);

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
    let e = msg.payload;
    /* logging */
    logger.debug('ex_updateEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph : e.graphid});
    /* This returns a promise inmediately */
    G.updateEdge(e).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The edge has been updated!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: e});
    /* reply to the client */
    reply(msg);
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
    let e = msg.payload;
    /* logging */
    logger.debug('ex_deleteEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph : e.graphid});
    /* This returns a promise inmediately */
    G.removeEdge(e).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The edge has been removed!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: e});
    /* reply to the client */
    reply(msg);

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
    let e = msg.payload;
    /* logging */
    logger.debug('ex_getEdge invoked', e);

    /* backend */
    let G = new SimpleGraphAPI({graph : e.graphid});
    /* This returns a promise inmediately */
    G.getEdge(e).then(()=>{
      /* build message */
      msg = Message.buildMessage({payload: "The edge have been retrieved!"});
      /* reply to the client */
      reply(msg);
    },(err)=>{
      /* build message */
      msg = Message.buildMessage({payload: err});
      /* reply to the client */
      reply(msg);
    });
    /* backend */

    /* build message */
    msg = Message.buildMessage({payload: e});
    /* reply to the client */
    reply(msg);
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
    let e = msg.payload;
    /* logging */
    logger.debug('ex_getEdgeList invoked', e);

    /* build message */
    msg = Message.buildMessage({payload: e});
    /* reply to the client */
    reply(msg);

  }

}


/* exporting the module */
module.exports = ExternalAPI;
