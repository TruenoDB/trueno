"use strict";

/**
 * @author Miguel Rivera Mediavilla
 * This module provides all actions required by the database console.
 * @module lib/console/actions
 * @see lib/console/console-entry
 */

let TruenoJS = require('../core/api/external-driver');
let Graph = require('../core/data_structures/graph');

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

    console.log("Graph name: " + command.graphName + "\n");

    let g = new Graph({id : command.graphName});
    g.name = command.graphName;

    // FIXME: Just for testing purpose (check how promise is handle)
    this._driver.getGraph(g).then(msg => {
      if (msg._payload.code == 0) {

        let graph = msg._payload.result;
        process.stdout.write("\ngraph:\n");
        console.log(graph);
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

    this._driver.getGraphList().then(msg => {

      // FIXME Just for test purpose.
      /* list of graphs */
      if (msg._payload.code == 0) {
        let list = msg._payload.result;

        process.stdout.write("\nList of graphs: " + list.length + "\n");
        for (var i=0; i<list.length; i++) {
          process.stdout.write(list[i]._property._graphid + "\n");
        }
      }

    });

    callback();
  }

  /**
   * Directive to modify a graph or a part of a graph.
   * @param command Commands and options received from trueno console
   * @param callback
   */
  updateGraph(command, callback) {

    let g = new Graph({id : command.graphName});

    console.log('command.graphName => ', command.graphName);

    // FIXME Just for test purpose.
    g.directed = true;
    this._driver.updateGraph(g).then(msg => {

      console.log('\n',msg);
    } );

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
