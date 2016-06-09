"use strict";

/**
 * @author ebarsallo
 * Trueno Graph basic implementation, which is not intended to support transactions. Modifications on the graph are
 * persisted in C* as single operations on their components (eg. adding an edge, deleting an edge, creating a vertex,
 * etc)
 * @module lib/backend/TruenoGraphSimple
 * @see module:path/referencedModuleName
 */

/** Import modules */
var  SessionFactory = require('./trueno-session-factory');

const Enums = require('../core/enum/backend');

// new
const SessionUtil = require('./trueno-session-util');
const VertexMap = require('./storage/vertex');
const EdgeMap = require('./storage/edge');
const GraphMap = require('./storage/graph');
const Graph = require('../core/data_structures/graph');


/* query builder */
const queryBuilder = require('./query-builder');
var q = new queryBuilder();
var Components = Enums.Components;
var Operations = Enums.Operations;


// FIXME: Avoid SQL inyection. Validate every value against the type expected.

/** Description of the class */
class TruenoGraphSimple {


  /**
   * Create a TruenoGraph object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._name = param.graph;
    this._conn = SessionFactory.getConnection();
    this._session = new SessionUtil();

  };


  /**
   *
   */
  close() {
  //
  //  this._conn.disconnect().then ( result => {
  //
  //  }).catch( e => {
  //    console.log(e);
  //  });
  //
  }


  /**
   * Create a graph in Trueno backend storage.
   * @param graph
   */
  addGraph(graph) {

    /* Graph params */
    let graphParams =  {'name': graph.id, 'strategy':'SimpleStrategy', 'replicationFactor': 3};
    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject)=>{
      /* Execute Create graph Query */
      self._conn.execute(q.build(Components.GRAPH, Operations.CREATE, graphParams)).then( result => {

        /* graph keyspace created, now use it */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name}));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_GRAPH_TABLE));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_VERTEX_TABLE));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_EDGE_TABLE));

      }).then( result => {

        let g = new GraphMap(graph);
        let q = self._session.inserto(g);

        console.log('addGraph: [' + q + ']');

        return self._conn.execute(q);

      }).then( result => {

        /* try to disconnect */
        console.log("Creating graph successful");

        /* resolving main promise */
        resolve();

      }).catch( e => {
        console.log(e);

        /* rejecting promise */
        reject(e);
      });

    });

  };


  /**
   * Update a graph in Trueno backend storage.
   * @param graph
   */
  updateGraph(graph) {

    let g = new GraphMap(graph);
    let q = this._session.updato(graph);
    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* execute update query */
      self._conn.execute(q).then( result => {

        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    });

  };


  /**
   * Remove a graph in Trueno backend storage.
   * @param graph
   */
  removeGraph(graph) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      self._conn.execute(q.build(Components.GRAPH, Operations.DELETE, {'keyspace' : graph.id})).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })

  };


  /**
   * Add a vertex to a graph G in Trueno backend storage.
   * @param vertex
   */
  addVertex(vertex) {

    vertex.graphid = this._name;
    let v = new VertexMap(vertex);
    let q = this._session.inserto(v);
    /* This instance object reference */
    let self = this;

    console.log('addVertex: [' + q + ']');

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* execute insert query */
      self._conn.execute(q).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    });

  };


  /**
   * Update a vertex from a graph G in Trueno backend storage.
   * @param vertex
   * @returns {Promise}
   */
  updateVertex(vertex) {

    vertex.graphid = this._name;
    let v = new VertexMap(vertex);
    let q = this._session.updato(v);
    /* This instance object reference */
    let self = this;

    console.log('addVertex: [' + q + ']');

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* execute insert query */
      self._conn.execute(q).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    });

  };


  /**
   * Remove a vertex from a graph G in Trueno backend storage.
   * @param vertex
   */
  removeVertex(vertex) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      self._conn.execute(q.build(Components.VERTEX, Operations.DELETE, {keyspace : vertex.graphid, node : vertex.id})).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })

  };


  /**
   * Add an edge to a graph G in Trueno backend storage.
   * @param edge
   */
  addEdge(edge) {

    edge.graphid = this._name;
    let e = new EdgeMap(edge);
    let q = this._session.inserto(e);
    /* This instance object reference */
    let self = this;

    console.log('addEdge: [' + q + ']');

    /* returning the method promise */
    return new Promise((resolve, reject) => {
      self._conn.execute(q).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    });

  };


  /**
   * Update an edge from a graph G in Trueno backend storage.
   * @param edge
   * @returns {Promise}
   */
  updateEdge(edge) {

    edge.graphid = this._name;
    let e = new EdgeMap(edge);
    let q = this._session.updato(e);
    /* This instance object reference */
    let self = this;

    console.log('updateEdge: [' + q + ']');

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* execute insert query */
      self._conn.execute(q).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    });

  };


  /**
   * Remove an edge from a graph G in Trueno backend storage.
   * @param edge
   */
  removeEdge(edge) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      self._conn.execute(q.build(Components.EDGE, Operations.DELETE, {keyspace : edge.graphid, fromid : edge.from, toid : edge.to})).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };


  // TODO: getGraph
  // TODO: getGraphList
  // TODO: getVertex
  // TODO: getVertexlist
  // TODO: getEdges
  // TODO: getEdgesList

}


/* exporting the module */
module.exports = TruenoGraphSimple;
