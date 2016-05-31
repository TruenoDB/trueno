"use strict";

/**
 * @author ebarsallo
 * Entity class that represent a vertex.
 * @module dato/vertex
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');
const utils = require('./../utils');
const Edge = require('./edge');

// FIXME
// Use types to represent data type, to reduce storage on C*

// FIXME
// Create a table to manage atributes, label, etc. Usually (commonly) attributes are the same for the edges/vertex of
// a graph; so there's no need to storage the name/key over an over. By doing this, it will be possible to manage the
// types, and apply validations.

/** Entity class: Vertex */
class Vertex {


  /**
   * Create an instance of a vertex entity.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    // FIXME
    // Use of UUID instead. Vertex identifier should be responsability of user, we could have a surrogate key (provided
    // by user), but this has to elaborated in order to make it work.
    //
    // See:
    // https://issues.apache.org/jira/browse/CASSANDRA-9200 for a link to a LWT implementation of a ORACLE-like
    // sequence (the possibility to include this feature in C* was discarded)
    this._id = param.id;

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
  get id() {
    return this._id;
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


  /**
   *
   * @param vertexj
   * @returns {Edge|exports|module.exports}
     */
  addEdge(vertexj) {
    return new Edge({vertexi: this, vertexj: vertexj});
  }


}


/* exporting the module */
module.exports = Vertex;
