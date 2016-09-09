"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Class that maps the <b>Edge</b> entity with the backend storage.
 * @module lib/backend/dato/edge
 * @see module:core/data_structures/edge
 */

/** Import modules */
const utils = require('../util/conv');
const Base = require('./base');


/** The edge backend storage mapping class */
class Edge extends Base {


  constructor(entity) {

    super(entity);
    this._name = 'EDGES';

    /* table schema */
    this.setSchema('id', 'id', true);
    this.setSchema('fromv', 'source');
    this.setSchema('tov', 'target');
    this.setSchema('attributes', 'attributes');
    this.setSchema('computed', 'computed');
    this.setSchema('meta', 'meta');
  }

  /*============================= GETTERS ============================*/

  /**
   * Returns the edge identifier.
   * @returns {long}
   */
  get id() {

    return this._entity._property._id;
  }

  /**
   * Returns starting vertex identifier of the edge.
   * @returns {long}
   */
  get source() {

    return this._entity._property._source;
  }

  /**
   * Return ending vertex partition.
   * @returns {integer}
   */
  get target() {

    return this._entity._property._target;
  }

  /**
   * Returns attributes associated to the entity.
   * @returns {string}
   */
  get attributes() {

    return utils.objtoString(this._entity._property._prop);
  }

  /**
   * Returns computed data associated to the entity.
   * @returns {*}
   */
  get computed() {

    return utils.objobjtoString(this._entity._property._comp);
  }

  /**
   * Returns metadata associated to the entity.
   * @returns {string}
   */
  get meta() {

    return utils.objtoString(this._entity._property._meta);
  }

  /*============================ OPERATIONS ==========================*/

  /**
   * Returns predicate (based on the rowkeys) to update the storage.
   * @returns {string}
   */
  getPredicate() {

    return `id = ${this.id}`;
  }

}


/* exporting the module */
module.exports = Edge;
