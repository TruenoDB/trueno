"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Component's backend storage mapping super class
 * @module lib/backend/dato/base
 * @see module:core/data_structure
 */

/** Import modules */
const fs = require('fs');

/** super class */
class Base {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(entity) {

    this._entity = entity || null;
    this._name = '';

    this._schema = new Map();
  }


  get name() {

    return this._name;
  }

  get graphid() {

    return this._entity.graphid;
  }

  get schema() {
    return this._schema;
  }


  /**
   *
   * @returns {object}
   */
  flush() {

    return this._entity.flush();
  }


  /**
   *
   * @param id
   * @param map
   */
  setSchema(id, map) {
    this._schema.set(id, map);
  }


}


/* exporting the module */
module.exports = Base;
