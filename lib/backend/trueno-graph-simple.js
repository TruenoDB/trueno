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

const Promise = require("bluebird");
const Enums = require('../core/enum/backend');

const SessionUtil = require('./trueno-session-util');
const VertexMap = require('./storage/vertex');
const EdgeMap = require('./storage/edge');
const GraphMap = require('./storage/graph');

// temporal
const conv = require('./util/conv');
const Graph = require('../core/data_structures/graph');
const Vertex = require('../core/data_structures/vertex');
const Edge = require('../core/data_structures/edge');

/* query builder */
const ROOT_KEYSPACE = Enums.Constant.ROOT_KEYSPACE;
const queryBuilder = require('./query-builder');
var q = new queryBuilder();
var Components = Enums.Components;
var Operations = Enums.Operations;


// FIXME: Avoid SQL inyection. Validate every value against the type expected.
// FIXME: Move connection properties to SessionUtil. SessionUtil should be an static class.
// FIXME: C* structs => create a keyspace named: system_trueno and put graph table in there.
// FIXME: Replace ForEach() unless a callback is really needed. https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead

/** Trueno Graph basic implementation */
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
   * Create a graph in Trueno storage backend (C*). The API creates the following structures:
   * <ul>
   *     <li><b>${GRAPH_NAME}</b> keyspace, to store vertices and edges information.</li>
   *     <li><b>TRUENO_TUPLE</b> tuple type, which describe the basic data type used by Trueno to store fields in the
   *     system.</li>
   *     <li><b>${GRAPH_NAME}.VERTICES</b> to store info related to vertices.</li>
   *     <li><b>${GRAPH_NAME}.EDGES</b> to store info related to edges.</li>
   * </ul>
   * @param graph
   */
  addGraph(graph) {

    /* Graph params */
    let graphParams =  {'name': graph._property._id, 'strategy':'SimpleStrategy', 'replicationFactor': 3};
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

        return self._conn.execute('CREATE TYPE ' + graphParams.name + '.trueno_tuple ( type TEXT, value TEXT)');

      }).then( result => {

        /* already using the graph keyspace, now create the vertex table */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_VERTEX_TABLE, {keyspace : graphParams.name}));

      }).then( result => {

        /* already using the graph keyspace, now create the edge table */
        /* execute query and return promise */
        return self._conn.execute(q.build(Components.GRAPH, Operations.CREATE_EDGE_TABLE, {keyspace : graphParams.name}));

      }).then( result => {

        /* already using graph keyspace, and vertex/edge table has been created */
        /* update graph properties */
        graph.graphid = ROOT_KEYSPACE;
        let g = new GraphMap(graph);
        let q = self._session.inserto(g);

        return self._conn.execute(q);

      }).then( result => {

        /* Creating graph successful */
        /* resolving main promise */
        resolve();

      }).catch( e => {
        console.log('addGraph [', graphParams.name, ']: ', e);

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
    let q = this._session.updato(g);

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
   * Remove a graph in Trueno storage backend.
   * @param graph
   */
  removeGraph(graph) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* cql query to execute on the storage backend */
      let query = q.build(Components.GRAPH, Operations.DELETE,
        {
          'keyspace' : ROOT_KEYSPACE,
          'id'       : graph._property._id
        });

      /* remove graph record from C* table */
      self._conn.execute(query).then(result => {

        /* cql */
        let query = q.build(Components.GRAPH, Operations.DROP,
          {
            'keyspace' : graph._property._id
          });

        /* drop keyspace from C* */
        return self._conn.execute(query);

      }).then(result => {

        /* resolving main promise */
        resolve();

      }).catch(e => {

        console.log(e);

        /* rejecting promise */
        reject(e);
      });
    });

  }

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
    let q = this._session.updato(v, true);

    /* This instance object reference */
    let self = this;

    //console.log('updateVertex: [' + q + ']');

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* execute insert query */
      self._conn.execute(q.query, q.params, { prepare: true}).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    });

  };

  /**
   * Remove a vertex from a graph G in Trueno storage backend.
   * @param vertex
   */
  removeVertex(vertex) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* cql query to execute on the storage backend */
      let query = q.build(Components.VERTEX, Operations.DELETE,
        {
          keyspace : vertex._property._graphid,
          id       : vertex._property._id
        });

      console.log(query);
      self._conn.execute(query).then( result => {
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
   * Update an edge from a graph G in Trueno storage backend.
   * @param edge
   * @returns {Promise}
   */
  updateEdge(edge) {

    edge.graphid = this._name;
    let e = new EdgeMap(edge);
    let q = this._session.updato(e);
    /* This instance object reference */
    let self = this;

    //console.log('updateEdge: [' + q + ']');

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
   * Remove an edge from a graph G in Trueno storage backend.
   * @param edge
   */
  removeEdge(edge) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      /* cql query to execute on storage backend */
      let query = q.build(Components.EDGE, Operations.DELETE,
        {
          keyspace : edge._property._graphid,
          source   : edge._property._source,
          target   : edge._property._target
        });

      self._conn.execute(query).then( result => {
        resolve();
      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };

  getGraph(graph) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      self._conn.execute(q.build(Components.GRAPH, Operations.GET,
        {
          keyspace : ROOT_KEYSPACE,
          id       : self._name
        })).then( result => {
        console.log('query: ', q.build(Components.GRAPH, Operations.GET, {keyspace : ROOT_KEYSPACE, id :self._name}));

        /* setting properties to vertex, if a row was returned */
        if ( result.rows.length > 0 ) {

          let g = new Graph({id: self._name});
          let o = result.rows[0];

          g._property._computed = o.computed;
          g._property._attributes = conv.datatoObject(o.attributes);
          g._property._meta = conv.datatoObject(o.meta);

          //console.log('graph => ', g);

          resolve(g);
        }

      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };

  getGraphList() {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      self._conn.execute(q.build(Components.GRAPH, Operations.GETALL,
        {
          keyspace : ROOT_KEYSPACE
        })).then( result => {
        //console.log('result => ', result);

        /* setting properties to vertex, if a row was returned */
        if ( result.rows.length > 0 ) {

          let list = [];
          //console.log('rows ==> ', result.rows[1]);
          for (var i=0; i < result.rows.length; i++) {

            let o = result.rows[i];
            let g = new Graph({id: o.id});

            g._property._computed = o.computed;
            g._property._attributes = conv.datatoObject(o.attributes);
            g._property._meta = conv.datatoMap(o.meta);

            list.push(g);
          }
          //console.log('graph list => ', list);

          resolve(list);
        }

      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };

  getVertex(vertex) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      let query = q.build(Components.VERTEX, Operations.GET,
        {
          keyspace : self._name,
          id       : vertex._property._id
        });

      console.log(query);

      self._conn.execute(query).then( result => {

        /* setting properties to vertex, if a row was returned */
        if ( result.rows.length > 0 ) {

          let v = new Vertex({id: vertex._property._id, graphid: vertex._property._graphid});
          let o = result.rows[0];

          // FIXME: Should not be neccesary to do the explicting casting (overhead)
          v.partition = o.partition;
          v._property._comp = conv.datatoObjectObject(o.computed);
          v._property._prop = conv.datatoObject(o.attributes);
          v._property._meta = conv.datatoObject(o.meta);

          //console.log('c*     => ', o);
          console.log('vertex => ', v);

          resolve(v);
        }

      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };

  getVertexList(vertex) {

    /* This instance object reference */
    let self = this;

    vertex.graphid = this._name;
    let v = new VertexMap(vertex);
    let q = this._session.selecto(v);

    console.log('query: ', q);

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      self._conn.execute(q).then( result => {
        //console.log('result => ', result);

        /* setting properties to vertex, if a row was returned */
        if ( result.rows.length > 0 ) {

          let list = [];
          //console.log('rows ==> ', result.rows[1]);
          for (var i=0; i < result.rows.length; i++) {

            let v = new Vertex();
            let o = result.rows[i];

            // FIXME: Should not be neccesary to do the explicting casting (overhead)
            v.partition = o.partition;
            v._property._computed = conv.datatoObjectObject(o.computed);
            v._property._attributes = conv.datatoObject(o.attributes);
            v._property._meta = conv.datatoObject(o.meta);

            v._property._id = o.id;
            v._property._graphid = self._name;

            list.push(v);
          }

          //console.log("list ===>", list);
          resolve(list);
        }

      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };

  getEdge(edge) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      let query = q.build(Components.EDGE, Operations.GET,
          {
            keyspace : self._name,
            id       : edge._property._id
          });

      console.log(query);
      self._conn.execute(query).then( result => {

        /* setting properties to vertex, if a row was returned */
        if ( result.rows.length > 0 ) {

          console.log('result => ', result.rows[0]);

          let o = result.rows[0];
          let e = new Edge({from: o.fromv, to: o.tov, graphid: self._name});

          // FIXME: Implement a method to populate the component.
          e._property._comp = conv.datatoObjectObject(o.computed);
          e._property._prop = conv.datatoObject(o.attributes);
          e._property._meta = conv.datatoObject(o.meta);

          e._property._id = o.id;
          e._property._partition = o.partition;
          e._property._graphid = self._name;

          console.log('edge => ', e);

          resolve(e);
        }

      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };

  getEdgeList(edge) {

    /* This instance object reference */
    let self = this;

    edge.graphid = this._name;
    let e = new EdgeMap(edge);
    let q = this._session.selecto(e);

    console.log('query: ', q);

    /* returning the method promise */
    return new Promise((resolve, reject) => {

      self._conn.execute(q).then( result => {

        /* setting properties to vertex, if a row was returned */
        if ( result.rows.length > 0 ) {

          //console.log('result => ', result.rows[0]);

          let list = [];
          //console.log('rows ==> ', result.rows[1]);
          for (var i=0; i < result.rows.length; i++) {

            let e = new Edge({});
            let o = result.rows[i];

            e._property._computed = conv.datatoObjectObject(o.computed);
            e._property._attributes = conv.datatoObject(o.attributes);
            e._property._meta = conv.datatoObject(o.meta);

            e._property._to = o.tov;
            e._property._from = o.fromv;
            e._property._partition = o.partition;
            e._property._graphid = self._name;

            list.push(e);
          }

          //console.log('edge => ', e);
          resolve(list);
        }

      }).catch( e => {

        console.log(e);
        reject(e);
      })
    })
  };

  /*============================= NEW API =============================*/

  getCQL(obj, type, action) {

    /* mapping entity */
    let o;

    /* Depending of obj type, instantiate the corresponding mapping entity */
    switch (type) {
      case 'e':
        o = new EdgeMap(obj);
        break;

      case 'v':
        o = new VertexMap(obj);
        break;
    }

    /* return corresponding cql statement according to the action */
    if (action == 'ex_persist') {
      return this._session.updato(o, true);
    } else if (action == 'ex_destroy') {
      return o.cqldelete();
    }
  }

  batch(queries) {

    /* This instance object reference */
    let self = this;

    /* returning the method promise */
    return self._conn.batch(queries, { prepare: true});
  }

}


/* exporting the module */
module.exports = TruenoGraphSimple;
