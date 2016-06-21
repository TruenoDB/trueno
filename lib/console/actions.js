"use strict";

/**
 * @author Miguel Rivera Mediavilla
 * This module provides all actions required by the database console.
 * @module lib/console/actions
 * @see lib/console/console-entry
 */

let TruenoJS = require('../core/api/external-driver');

let Edge = require('../core/data_structures/edge');
let Graph = require('../core/data_structures/graph');
let Vertex = require('../core/data_structures/vertex');

/* graph */
let __graph = null;
let __graphName = null;


/** Actions class - Parses the values sent by the trueno console and communicates commands to the socket server. */
class Actions {

  constructor(param = {}) {

    this._vorpal = param._vorpal;
    this._driver = null;
  }

  /**
   * Spawns a REPL console as a child of the trueno console.
   * @param command Container for commands executed in the REPL environment.
   * @param callback
   */
  static REPL(command, callback) {

    /* Try to evaluate the command */
    try {
      eval(command);
    } catch (e) {
      console.log("Invalid command, please try again.", e.message);
    }

    /* Returning again */
    callback();
  }

  /**
   * Connects the console to the JavaScript driver.
   * @param command Actions received from vorpal console
   * @param callback
   */
  connect(command, callback) {
    if(command.options.host) {
      if(command.options.port) {
        this._driver = new TruenoJS(command.options.host, command.options.port);
      }
      this._driver = new TruenoJS(command.options.host);
    }
    else {
      this._driver = new TruenoJS();
    }

    this._driver.connect(()=>{
      console.log("Console connected to driver.");
    }, ()=>{
      console.log("Console disconnected from driver.");
    });

    callback();
  }

  /**
   * Disconnects the console from the JavaScript driver.
   * @param command Actions received from vorpal console
   * @param callback
   */
  disconnect(command, callback) {

    callback();
  }

  /**
   * Clears the trueno console.
   * @param command Actions received from vorpal console
   * @param callback
   */
  clear(command, callback) {
    /* clear the screen (this is the Vorpal object */
    process.stdout.write("\u001B[2J\u001B[0;0f");
    /* Returning again */
    callback();
  }

  /**
   * Directive to load a graph into the current session. It allows the user to issue vertex and edge manipulation
   * commands that will have effect on the loaded graph.
   * @param command Commands and options received from trueno console
   * @param callback
   */
  loadGraph(command, callback) {

    let g = new Graph({id : command.graphName});
    g.name = command.graphName;

    /* load graph in memory */
    this._driver.getGraph(g).then(msg => {
      if (msg._payload.code == 0) {

        __graph = msg._payload.result;
        __graphName = command.graphName;
        process.stdout.write("\ndone.\n");
      }
    });

    callback();
  }

  /**
   * Directive to create a new graph in the database.
   * @param command Commands and options received from trueno console
   * @param callback
   */
  createGraph(command, callback) {

    /* create a graph */
    if (command.options.directed) {
      process.stdout.write("Graph is directed\n");
    }

    if (command.options.dynamic) {
      process.stdout.write("Graph is dynamic\n");
    }

    let g = new Graph({id : command.graphName});
    g.name = command.graphName;
    g.directed =  command.options.directed || false;
    g.dynamic = command.options.dynamic || false;

    this._driver.createGraph(g);

    callback();

  }

  /**
   * Directive to add a new vertex/edge to a graph in the database.
   * @param command Commands and options received from trueno console.
   * @param callback
   */
  add(command, callback) {

    let graphid = (command.graphName) ? command.graphName : __graphName;
    if (!graphid) {
      process.stdout.write("\n\tMissing graph argument\n");

      callback();
      return;
    }

    if (command.entity == 'vertex') {

      /* add a vertex */
      try {

        let vid = (command.options.name) ? command.options.name : null;
        let att = (command.options.attrib) ? JSON.parse (command.options.attrib) : null;
        let com = (command.options.computed) ? JSON.parse (command.options.computed) : null;
        let met = (command.options.metadata) ? JSON.parse (command.options.metadata) : null;

        /* rpc call */
        let v = new Vertex({id : vid, attributes : att, computed : com, meta : met, graphid : graphid});
        this._driver.createVertex(v).then(msg => {

          //process.stdout.write("\tdone.\n");
        });

      } catch (e) {

        //console.log(e);
        process.stdout.write("\n\tInput does not match the required format.\n");

        callback();
        return;

      }

    } else if (command.entity == 'edge') {

      /* add an edge */
      try {

        let fid = (command.options.from) ? command.options.from : null;
        let tid = (command.options.to) ? command.options.to : null;
        let att = (command.options.attrib) ? JSON.parse (command.options.attrib) : null;
        let com = (command.options.computed) ? JSON.parse (command.options.computed) : null;
        let met = (command.options.metadata) ? JSON.parse (command.options.metadata) : null;

        /* rpc call */
        let e = new Edge({from : fid, to : tid, attributes : att, computed : com, meta : met, graphid : graphid});
        this._driver.createEdge(e).then(msg => {

          //process.stdout.write("\tdone.\n");
        });

      } catch (e) {

        //console.log(e);
        process.stdout.write("\n\tInput does not match the required format.\n");

        callback();
        return;

      }

    }

    callback();

  }

  /**
   * Directive to delete a vertex/edge from a graph in the database.
   * @param command Commands and options received from trueno console.
   * @param callback
   */
  del(command, callback) {

    if (command.entity == 'vertex') {

      /* delete a vertex */
      let vid = (command.options.name) ? command.options.name : null;
      let graphid = (command.graphName) ? command.graphName : __graphName;

      if (!graphid) {
        process.stdout.write("\n\tMissing graph argument\n");

        callback();
        return;
      }

      /* rpc call */
      let v = new Vertex({id : vid, graphid : graphid});
      this._driver.deleteVertex(v).then(msg => {

        //process.stdout.write("\tdone.\n");
      });

    } else if (command.entity == 'edge') {

      /* delete an edge */
      let fid = (command.options.from) ? command.options.from : null;
      let tid = (command.options.to) ? command.options.to : null;

      /* rpc call */
      let e = new Edge({from : fid, to : tid, graphid : command.graphName});
      this._driver.deleteEdge(e).then(msg => {

        //process.stdout.write("\tdone.\n");
      });

    }

    callback();

  }

  /**
   * Directive to delete a graph from the database.
   * @param command Commands and options received from trueno console
   * @param callback
   */
  deleteGraph(command, callback) {

    let g = new Graph({id : command.graphName});

    // FIXME: Just for testing purpose (check how promise is handle)
    this._driver.deleteGraph(g).then(msg => {

      console.log("\n", msg);
    });

    callback();
  }

  /**
   * Directive to list a graph in the database or list vertices / edges of a graph.
   * @param command Commands and options received from trueno console
   * @param callback
   */
  listGraph(command, callback) {

    let graphid = (command.graphName) ? command.graphName : __graphName;

    if (command.options.vertice) {

      /* List of vertices */
      if (!graphid) {
        process.stdout.write("\n\tMissing required argument to retrieve vertices: graphName\n");

        callback();
        return;
      }

      let vid = (command.options.vertice === true) ? null : command.options.vertices;
      let v = new Vertex({id: vid, graphid: graphid});
      this._driver.getVertexList(v).then(list => {

        console.log("\nList of vertices: " + list.length);
        for (var i=0; i<list.length; i++) {
          let v = list[i];
          console.log("{");
          console.log("  id:         ", v.id);
          console.log("  attributes: ", v.attributes);
          console.log("  computed:   ", v.computed);
          console.log("  metadata:   ", v.meta);
          console.log("}");
        };

      }).catch(e => {
        console.log(e);
      });

    } else if (command.options.edge) {

      /* List of edges */
      if (!graphid) {
        process.stdout.write("\n\tMissing required argument to retrieve edges: graphName\n");

        callback();
        return;
      }

      let vid = (command.options.edge === true) ? null : command.options.edge;
      let e = new Edge({from: vid, graphid: graphid});
      this._driver.getEdgeList(e).then(list => {

        console.log("\nList of edges: " + list.length);
        for (var i=0; i<list.length; i++) {
          let e = list[i];
          console.log("{");
          console.log("  from:       ", e.from);
          console.log("  to:         ", e.to);
          console.log("  attributes: ", e.attributes);
          console.log("  computed:   ", e.computed);
          console.log("  metadata:   ", e.meta);
          console.log("}");
        };

      });

    } else {

      /* List of graphs*/
      this._driver.getGraphList().then(list => {

        /* list of graphs */
        console.log("\nList of graph: " + list.length);
        for (var i=0; i<list.length; i++) {
          let g = list[i];
          process.stdout.write(`${g.graphid} : directed: ${g.directed} dynamic: ${g.dynamic} multi: ${g.multi} \n`);
        }

      });
    }

    callback();
  }

  /**
   * Directive to modify a graph or a part of a graph.
   * Not used for now.
   * @param command Commands and options received from trueno console
   * @param callback
   */
  updateGraph(command, callback) {

    let g = new Graph({id : command.graphName});

    g.directed = true;
    this._driver.updateGraph(g).then(msg => {

      //console.log('\n',msg);
    } );

    callback();
  }

  /**
   * Directive to update a vertex/edge to a graph in the database.
   * @param command Commands and options received from trueno console.
   * @param callback
   */
  update(command, callback) {

    let graphid = (command.graphName) ? command.graphName : __graphName;
    if (!graphid) {
      process.stdout.write("\n\tMissing graph argument\n");

      callback();
      return;
    }

    if (command.entity == 'vertex') {

      /* update a vertex */
      try {

        let vid = (command.options.name) ? command.options.name : null;
        let att = (command.options.attrib) ? JSON.parse (command.options.attrib) : null;
        let com = (command.options.computed) ? JSON.parse (command.options.computed) : null;
        let met = (command.options.metadata) ? JSON.parse (command.options.metadata) : null;

        /* rpc call */
        let vertex = new Vertex({id : vid, graphid : graphid});
        //this._driver.getVertex(v).then(vertex => {
        //
        //  if (vertex instanceof Vertex) {

            vertex.clear();
            if (att) vertex.attributes = att;
            if (com) vertex.computed = com;
            if (met) vertex.meta = met;

            this._driver.updateVertex(vertex).then(msg => {
              process.stdout.write("\tdone.\n");
            });
        //  }
        //});

      } catch (e) {

        console.log(e);
        process.stdout.write("\n\tInput does not match the required format.\n");

        callback();
        return;

      }

    } else if (command.entity == 'edge') {

      /* add an edge */
      try {

        let fid = (command.options.from) ? command.options.from : null;
        let tid = (command.options.to) ? command.options.to : null;
        let att = (command.options.attrib) ? JSON.parse (command.options.attrib) : null;
        let com = (command.options.computed) ? JSON.parse (command.options.computed) : null;
        let met = (command.options.metadata) ? JSON.parse (command.options.metadata) : null;

        /* rpc call */
        let edge = new Edge({from : fid, to : tid, graphid : graphid});
        //this._driver.getVertex(e).then(edge => {
        //
        //  if (edge instanceof Edge) {

            edge.clear();
            if (att) edge.attributes = att;
            if (com) edge.computed = com;
            if (met) edge.meta = met;

            this._driver.updateEdge(edge).then(msg => {
              //process.stdout.write("\tdone.\n");
            });
        //  }
        //});

      } catch (e) {

        console.log(e);
        process.stdout.write("\n\tInput does not match the required format.\n");

        callback();
        return;

      }

    }

    callback();

  }

  /**
   * Directive to return the console the current status of the database cluster.
   * @param command Commands and options received from trueno console
   * @param callback
   */
  showStatus(command, callback) {
    console.log("Status Response.\n");

    callback();
  }
}


/* exporting the module */
module.exports = Actions;
