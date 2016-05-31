"use strict";

/**
 * @author Miguel Rivera Mediavilla
 * This module provides all actions required by the database console.
 * @module lib/console/actions
 * @see lib/console/console-entry
 */

let TRUENOJS = require('trueno-javascript-driver');

/** Actions class - Parses the values sent by the trueno console and communicates commands to the socket server. */
class Actions {

    constructor(param = {}) {

        this._vorpal = param._vorpal;
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
     * Directive to create a new graph in the database.
     * @param command Commands and options received from trueno console
     * @param callback
     */
    createGraph(command, callback) {
        if (command.options.directed) {
            process.stdout.write("directed\n");
        }

        if (command.options.dynamic) {
            process.stdout.write("dynamic\n");
        }

        process.stdout.write("graph name " + command.graphName + "\n");

        callback();
    }

    /**
     * Directive to delete a graph from the database.
     * @param command Commands and options received from trueno console
     * @param callback
     */
    deleteGraph(command, callback) {
        
        callback();
    }

    /**
     * Directive to list a graph in the database or list vertices / edges of a graph.
     * @param command Commands and options received from trueno console
     * @param callback
     */
    listGraph(command, callback) {
        
        callback();
    }

    /**
     * Directive to modify a graph or a part of a graph.
     * @param command Commands and options received from trueno console
     * @param callback
     */
    updateGraph(command, callback) {
        
        callback();
    }

    /**
     * Directive to return the console the current status of the database cluster.
     * @param command Commands and options received from trueno console
     * @param callback
     */
    showStatus(command, callback) {
        process.stdout.write("Status Response.\n");

        callback();
    }
}


/* exporting the module */
module.exports = Actions;