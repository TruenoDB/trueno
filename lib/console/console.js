"use strict";

/**
 * @author Console for TruenoDB
 * This module servers as an entry point for the console.
 * @module core/console/console-entry
 * @see core/trueno-console
 */

const vorpal = require('vorpal')();
const Actions = require('./actions');

/** The console class */
class Console {

  /**
   * Create a ConsoleEntry Object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Set command line arguments */
    this._host = param.host || 'localhost';
    this._port = param.port || 8000;

  }

  /**
   * Initializes and launch the console.
   */
  init() {

    /* New Actions Instance */
    let actions = new Actions({vorpal: vorpal});

    /* Setup action array */
    let actionsArray = [
      {
        cmd: 'clear',
        action: actions.clear.bind(actions),
        options: [['-a, --all', 'Clear all at once'], ['-o, --other', 'Other command']],
        desc: 'Clear the console.'
      },
      {
        cmd: 'create graph <graphName>',
        action: actions.createGraph.bind(actions),
        options: [['-d, --dynamic', 'Set graph as dynamic'], ['-d, --directed', 'Set the graph as directed']],
        desc: 'Creates a new graph in the database.'
      }
    ]

    /* Delimiter and show CLI console */
    vorpal.delimiter('trueno ○-○').show();

    /* RPL mode command. Here we bind a function (RPL) to an Vorpal object
     in order to use this object inside the RPL function. */
    vorpal
    .mode('repl')
    .delimiter('repl>')
    .action(actions.REPL.bind(actions));

    /* Add all other console commands */
    actionsArray.forEach((command)=> {
      let c = vorpal.command(command.cmd);
      c.description(command.desc);
      c.action(command.action);

      /* Set options, opt[0] are the flags, opt[1] is the description of the flag */
      command.options.forEach((opt)=>{
        c.option(opt[0],opt[1]);
      });

    });

  }
}

/* exporting the module */
module.exports = Console;
