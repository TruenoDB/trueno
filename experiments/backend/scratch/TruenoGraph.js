"use strict";

/**
 * @author ebarsallo
 * This module decription
 * @module backend/ThursterGraph
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');
const config = require('./conf/config.json'),
  hostnames = config['hostnames'];

const connection = require('./cassandra-connection');
const queryBuilder = require('./queryBuilder');
const Enums = require('./enums');


/* query builder */
var q = new queryBuilder();
var Components = Enums.Components;
var Operations = Enums.Operations;


// FIXME
// Oversimplification. ThrusterGraph is used as an interface to connect to the C* backend, which
// should not be the case

// FIXME
// Avoid SQL inyection. Validate every value against the type expected.

/** Description of the class */
class TruenoGraph {


  // FIXME
  // callback style for function/class/methods.

  /**
   * Create a TruenoGraph object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    let hosts = param.hostnames || hostnames;
    let name  = param.graph;

    this._conn = new connection({hosts: [hosts]});
    this._conn.connect().then( result => {

    }).catch( e => {
      console.log(e);
    })

    this._name = name;

  };


  /**
   *
   */
  close() {

    this._conn.disconnect().then ( result => {

    }).catch( e => {
      console.log(e);
    });

  }


  /**
   *
   * @param graph
   */
  addGraph(graph) {

    /* Graph params */
    let graphParams =  {'name': graph, 'strategy':'SimpleStrategy', 'replicationFactor': 3};

    /* Execute Create graph Query */
    this._conn.execute(q.build(Components.GRAPH, Operations.CREATE, graphParams)).then( result => {

      /* graph keyspace created, now use it */
      /* execute query and return promise */
      return this._conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name}));

    }).then( result => {

      /* already using the graph keyspace, now create the graph tables */
      /* execute query and return promise */
      return this._conn.execute(q.build(Components.GRAPH, Operations.CREATE_GRAPH_TABLE));

    }).then( result => {

      /* already using the graph keyspace, now create the graph tables */
      /* execute query and return promise */
      return this._conn.execute(q.build(Components.GRAPH, Operations.CREATE_VERTEX_TABLE));

    }).then( result => {

      /* already using the graph keyspace, now create the graph tables */
      /* execute query and return promise */
      return this._conn.execute(q.build(Components.GRAPH, Operations.CREATE_EDGE_TABLE));

    }).then( result => {

      /* try to disconnect */
      console.log("Creating graph successful");

    }).catch( e => {
      console.log(e);
    });

  };


  /**
   *
   * @param graph
   */
  removeGraph(graph) {

  };


  /**
   * Add a vertex to a graph G.
   * @param vertex
   */
  addVertex(vertex) {

    /* Graph Params */
    var graphParams =  {
      'keyspace'    : this._name,
      'id'          : vertex.id,
      'partition'   : vertex.partition  || 1,
      'computed'    : vertex.computed   || '{}',
      'attributes'  : vertex.attributes || '{}',
      'metadata'    : vertex.metadata   || '{}'
    };

    console.log('addVertex: [' + q.build(Components.VERTEX, Operations.INSERT, graphParams) + ']');

    this._conn.execute(q.build(Components.VERTEX, Operations.INSERT, graphParams)).then( result => {

    }).catch( e => {

      console.log(e);
    })

  };

  /**
   *
   * @param vertex
   */
  removeVertex(vertex) {

    this._conn.execute(q.build(Components.VERTEX, Operations.DELETE, {node: vertex.id})).then( result => {

    }).catch( e => {

      console.log(e);
    })

  };


  /**
   *
   * @param edge
   */
  addEdge(edge) {

    /* Graph Params */
    var graphParams =  {
      'keyspace'    : this._name,
      'fromv'       : edge.fromv,
      'tov'         : edge.tov,
      'computed'    : edge.computed   || '{}',
      'attributes'  : edge.attributes || '{}',
      'metadata'    : edge.metadata   || '{}'
    };

    console.log('addEdge: [' + q.build(Components.EDGE, Operations.INSERT, graphParams) + ']');

    this._conn.execute(q.build(Components.EDGE, Operations.INSERT, graphParams)).then( result => {

    }).catch( e => {

      console.log(e);
    })

  };


  // FIXME
  // It's a better idea to have this remove edge as part of edge entity
  /**
   *
   * @param edge
   */
  removeEdge(edge) {

  };


  import(myfile) {

  }


  listAllNodes() {

  }


  listNeighborsbyNode() {

  }

}


/* exporting the module */
module.exports = TruenoGraph;
