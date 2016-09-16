"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Class that maps the <b>Vertex</b> entity with the backend storage.
 * @module lib/backend/dato/vertex
 * @see module:core/data_structures/vertex
 */

/** Import modules */
const utils = require('../util/conv');
const Base = require('./base');

const Enums = require('../../core/enum/backend');
const Components = Enums.Components;


/** The vertex backend storage mapping class */
class Vertex extends Base {


  constructor(entity){

    super(entity);
    this._name = 'VERTICES';
    this._component = Components.VERTEX;

    /* table schema */
    this.setSchema('id', 'id', true);
    this.setSchema('partition', 'partition');
    this.setSchema('attributes', 'attributes');
    this.setSchema('computed', 'computed');
    this.setSchema('meta', 'meta');
  }

  /*============================= GETTERS ============================*/

  /**
   * Returns vertex identifier.
   * @returns {long}
   */
  get id() {

    return this._entity._property._id;
  }

  /**
   * Return vertex partition.
   * @returns {integer}
   */
  get partition() {

    return this._entity._property._partition;
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
   * @returns {string}
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
   * @param {boolean} isprepared - Indicates if the predicate resulted is going to be used for a prepared statement.
   * @returns {*}
   */
  getPredicate(isprepared) {

    isprepared = isprepared || false;

    if (isprepared) {
      return {col :'ID = ?', val : [`${this.id}`]}
    } else {
      return `ID = ${this.id}`;
    };
  }

}


/* exporting the module */
module.exports = Vertex;
