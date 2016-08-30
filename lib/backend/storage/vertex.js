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


/** The vertex backend storage mapping class */
class Vertex extends Base {


  constructor(entity){

    super(entity);
    this._name = 'VERTICES';

    /* table schema */
    this.setSchema('id', 'id', true);
    this.setSchema('partition', 'partition');
    this.setSchema('attributes', 'attributes');
    this.setSchema('computed', 'computed');
    this.setSchema('meta', 'meta');
  }


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

    return utils.objtoString(this._entity._property._attributes);
  }


  /**
   * Returns computed data associated to the entity.
   * @returns {string}
   */
  get computed() {

    //console.log("conputed ==> ", this._entity._property._computed);
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
module.exports = Vertex;
