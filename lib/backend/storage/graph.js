"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Class that maps the <b>Graph</b> entity with the backend storage.
 * @module lib/backend/dato/graph
 * @see module:core/data_structures/graph
 */

/** Import modules */
const ROOT = require('../../core/enum/backend').Constant.ROOT_KEYSPACE;
const utils = require('../util/conv');
const Base = require('./base');


/** The graph backend storage mapping class */
class Graph extends Base {


  constructor(entity){

    super(entity);
    this._name = 'GRAPH';
    this._keyspace = ROOT;

    /* table schema */
    this.setSchema('id', 'id');
    this.setSchema('attributes', 'attributes');
    this.setSchema('computed', 'computed');
    this.setSchema('meta', 'meta');
  }


  /**
   * Returns graph identifier.
   * @returns {long}
   */
  get id() {

    return `'${this._entity._property._id}'`;
  }


  /**
   * Returns attributes associated to the entity.
   * @returns {string}
   */
  get attributes() {

    return utils.objtoString(this._entity._property._attributes);
  }


  /**
   * Returns computed data associated to the entity.
   * @returns {*}
   */
  get computed() {

    return utils.objobjtoString(this._entity._property._computed);
  }


  /**
   * Returns metadata associated to the entity.
   * @returns {string}
   */
  get meta() {

    return utils.objtoString(this._entity._property._meta);
  }

  /**
   * Returns predicate (based on the rowkeys) to update the storage.
   * @returns {*}
   */
  getPredicate() {

    return `ID = ${this.id}`;
  }

}


/* exporting the module */
module.exports = Graph;
