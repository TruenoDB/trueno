"use strict";

/**
 * @author ebarsallo
 * This module decription
 * @module dato/edge
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');
const utils = require('./../utils');


/** Description of the class */
class Edge {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._fromv = param.vertexi.id;
    this._tov   = param.vertexj.id;

    // properties
    this._graphname  = param.graph || '';
    this._computed   = new Map();
    this._attributes = new Map();
    this._metadata   = new Map();
  }


  /**
   * getter: identifier
   * @returns {*|string}
   */
  get fromv() {
    return this._fromv;
  }


  /**
   *
   * @returns {*}
   */
  get tov() {
    return this._tov;
  }


  /**
   *
   * @returns {string}
   */
  get graphname() {
    return this._graphname;
  };


  /**
   *
   * @param name{string}
   */
  set graphname(name) {
    this._graphname = name;
  };


  /**
   * getter: vertex partition
   * @returns {*}
   */
  get partition() {
    return this._partition;
  }


  /**
   * setter: partition
   * @param num
   */
  set partition(num) {
    this._partition = num;
  }


  // TODO: create attribute class


  /**
   *
   * @returns {Array}
   */
  get attributes() {
    return ( this._attributes.size > 0 ) ? utils.maptoString ( this._attributes ): null ;
  }

  /**
   * Set or modify an attribute associated to a vertex.
   * @param name
   * @param value
   */
  setAttribute(name, value) {
    // FIXME: assuming a text type always.
    this._attributes.set(name, { type: 'text', value: value });
  }

  /**
   * Remove an attribute associated to a vertex.
   * @param name
   */
  removeAttribute(name) {
    this._attributes.delete(name);
  }


  /**
   *
   * @returns {*|boolean}
   */
  get computed() {
    return ( this._computed.size > 0 ) ? utils.maptoString ( this._computed ): null ;
  }


  /**
   *
   * @returns {*}
   */
  get metadata() {
    return ( this._metadata.size > 0 ) ? utils.maptoString ( this._metadata ): null ;
  }


  /**
   * Set or modify an attribute associated to a vertex.
   * @param name
   * @param value
   */
  setMetada(name, value) {
    // FIXME: assuming a text type always.
    this._metadata.set(name, { type: 'text', value: value });
  }


  /**
   * Remove an attribute associated to a vertex.
   * @param name
   */
  removeMetada(name) {
    this._metadata.delete(name);
  }


}


/* exporting the module */
module.exports = Edge;
