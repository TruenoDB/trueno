"use strict";

/**
 * @author Miguel Rivera Mediavilla
 * This module provides all actions required by the database console.
 * @module lib/console/actions
 * @see module:lib/console/console-entry
 */

/** Import modules */
//TODO: Here you should import the API module.

/** Description of the class */
class Actions {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._vorpal = param._vorpal;
  }

  /**
   * Class function description.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */
   REPL(command, callback) {

    /* Try to evaluate the command */
    try{
      eval(command);
    }catch (e) {
      console.log("Invalid command, please try again.", e.message);
    }

    /* Returning again */
    callback();
  }
  /**
   * Class function description.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */
   clear(command, callback) {
    /* clear the screen (this is the Vorpal object */
    process.stdout.write ("\u001B[2J\u001B[0;0f");
    /* Returning again */
    callback();
  }
}


/* exporting the module */
module.exports = Actions;