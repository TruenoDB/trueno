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

const Enums = require('../../core/enum/backend');
const Components = Enums.Components;

/** The edge backend storage mapping class */
class Edge extends Base {


  constructor(entity) {

    super(entity);
    this._name = 'EDGES';
    this._component = Components.EDGE;

    /* table schema */
    this.setSchema('id', 'id');
    this.setSchema('fromv', 'source', true);
    this.setSchema('tov', 'target', true);
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

    /* FIXME. Temporal edge identifier */
    return this._entity._property._id || (this._entity._property._source * 1000000 + this._entity._property._target);
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
   * @override
   * @returns {string|obj|*|Object}
   */
  get cqldelete() {

    return q.build(this._component, Operations.DELETE,
      {
        keyspace : (this._keyspace || this.graphid),
        source   : (this.source),
        target   : (this.target)
      });

  }

  /**
   * Returns predicate (based on the rowkeys) to update the storage.
   * @param {boolean} isprepared - Indicates if the predicate resulted is going to be used for a prepared statement.
   * @returns {string}
   */
  getPredicate(isprepared) {

    isprepared = isprepared || false;

    if (isprepared) {
      return {col :'FROMV = ? AND TOV = ?', val : [`${this.source}`, `${this.target}`]}
    } else {
      return `FROMV = ${this.source} AND TOV = ${this.target}`;
    };
  }

}


/* exporting the module */
module.exports = Edge;
