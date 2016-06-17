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
    this.setSchema('fromv', 'from');
    this.setSchema('tov', 'to');
    this.setSchema('attributes', 'attributes');
    this.setSchema('computed', 'computed');
    this.setSchema('meta', 'meta');
  }


  /**
   * Returns starting vertex identifier of the edge.
   * @returns {long}
   */
  get from() {

    return this._entity._property._from;
  }


  /**
   * Return ending vertex partition.
   * @returns {integer}
   */
  get to() {

    return this._entity._property._to;
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
   * @returns {string}
   */
  getPredicate() {

    return `fromv = ${this.from} AND tov = ${this.to}`;
  }

}


/* exporting the module */
module.exports = Edge;
