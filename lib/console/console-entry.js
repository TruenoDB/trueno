"use strict";

/**
 * @author Console for TruenoDB
 * This module description
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

const vorpal = require('vorpal')();
const Actions = require('./actions');

/* New Actions Instance */
let actions = new Actions({vorpal: vorpal});

/* Delimiter and show CLI console */
vorpal.delimiter('trueno ○-○').show();

/* RPL mode command. Here we bind a function (RPL) to an Vorpal object
  in order to use this object inside the RPL function. */
vorpal
.mode('repl')
.delimiter('repl>')
.action(actions.REPL.bind(actions));

/* The CLI clear screen command. */
vorpal
.command('clear')
.action(actions.clear.bind(actions));