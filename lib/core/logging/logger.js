"use strict";

/**
 * @author Victor O. Santos Uceta
 * Logging class.
 * @module lib/core/logging/logger
 * @see
 */


/** Import modules */
const winston = require('winston');
const fs = require('fs');

/** Description of the class */
class Logger {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Path variable */
    let path = __dirname + '/../../../logs/';

    /* create directory if does not exist */
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    /* Display Debug messages if present */
    this._debug = param.debug;

    /* adding transports */
    let transports = [
        new winston.transports.File({
          name: 'info-file',
          level: 'info',
          filename: path + 'info-logs.log',
          handleExceptions: true,
          json: true,
          maxsize: 5242880, //5MB
          maxFiles: 5,
          colorize: false
        }),
        new winston.transports.File({
          name: 'error-file',
          level: 'error',
          filename:  path + 'error-logs.log',
          handleExceptions: true,
          json: true,
          maxsize: 5242880, //5MB
          maxFiles: 5,
          colorize: false
        }),
        new winston.transports.Console({
          name: 'debug-console',
          level: 'debug',
          handleExceptions: true,
          json: false,
          colorize: true
        })
    ];

    /* If debug is present, add debug file to transports */
    if (this._debug) {
      transports.push(
        new winston.transports.File({
          name: 'debug-file',
          level: 'debug',
          filename:  path + 'debug-logs.log',
          handleExceptions: true,
          json: true,
          maxsize: 5242880, //5MB
          maxFiles: 5,
          colorize: false
        })
      );
    }

    /* The logger */
    this._logger = new winston.Logger({
      transports: transports,
      exitOnError: true
    });

  }

  /**
   * Logging info method.
   * @param {arguments} anonymous - The logging message and metadata.
   */
  info() {
    /* logging with anonymous arguments */
    this._logger.info.apply(this._logger, arguments);
  }

  /**
   * Logging error method.
   * @param {arguments} anonymous - The logging message and metadata.
   */
  error() {
    /* logging with anonymous arguments */
    this._logger.error.apply(this._logger, arguments);
  }

  /**
   * Logging debug method.
   * @param {arguments} anonymous - The logging message and metadata.
   */
  debug() {
    /* logging with anonymous arguments */
    /* If debug flag is present, display display in console*/
    if (this._debug) {
      this._logger.debug.apply(this._logger, arguments);
    }
  }

  /**
   * Start/stop profile logging method.
   * @param {arguments} anonymous - The profiling registry name and metadata.
   */
  profile() {
    /* profiling with anonymous arguments */
    this._logger.profile(name);
  }

}


/* exporting the module */
module.exports = Logger;