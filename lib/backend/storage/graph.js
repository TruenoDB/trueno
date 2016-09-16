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

const Enums = require('../../core/enum/backend');
const Components = Enums.Components;


/** The graph backend storage mapping class */
class Graph extends Base {


  constructor(entity){

    super(entity);
    this._name = 'GRAPH';
    this._keyspace = ROOT;
    this._component = Components.GRAPH;

    /* table schema (C*, component, isprimarykey) */
    this.setSchema('id', 'id', true);
    this.setSchema('prop', 'attributes');
    this.setSchema('comp', 'computed');
    this.setSchema('meta', 'meta');
  }

  /*============================= GETTERS ============================*/

  /**
   * Returns graph identifier.
   * @returns {String}
   */
  get id() {

    return `'${this._entity._property._id}'`;
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
module.exports = Graph;
