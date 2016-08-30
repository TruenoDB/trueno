"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Class that represent the schema of a entity or Trueno component. Basically, the class map a class with the
 * physical storage (C*). Each component's field is mapped with their corresponding physical column in C*.
 * @module lib/backend/dato/schema
 * @see module:core/data_structure
 */


/** Description of the class */
class Schema {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

  }

  /**
   * Set the mapping for a field.
   * @param {String} id - Physical column that represent the field in the backing storage.
   * @param {String} map - Logical mapping of the field (id) in the component class.
   * @param {boolean} key - <b>True</b> if the field is part of the primary key of the component. <b>False</b>
   * otherwise.
   */
  set(id, map, key) {

    this[id] = {};
    this[id].map = map;
    this[id].key = key || false;

  }

  /**
   * Get the corresponding mapping of a physical column.
   * @param {String} id - Physical column that represent the field.
   * @returns {String} map
   */
  get(id) {

    return this[id].map;
  }

  /**
   * Converts the schema in an array of pairs (id, map)
   * @param {boolean} [exclude] - If <b>true</b> all fields are exported; otherwise, primary key fields are excluded.
   */
  toArray(exclude) {

    exclude = exclude || false;

    let self = this;
    let pairs = [];
    Object.keys(self).map((k) => {
      if (!self[k].key || exclude) pairs.push({id: k, map: self[k].map})
    });

    return pairs;
  }

}


/* exporting the module */
module.exports = Schema;
