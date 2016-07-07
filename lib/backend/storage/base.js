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
    this._keyspace = null;

    this._schema = new Map();
  }

  get name() {

    return (this._keyspace || this.graphid) + '.' + this._name;
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


    let pairs = [];
    let fields = this._entity._internal.modified;

    //console.log('flush() ==> ', fields);

    for (var i = 0; i < fields.length; i++) {
      //console.log('flush() ==> [',i,'] ', fields[i][0]);
      let x = this._schema.get(fields[i][0]);
      if (x) pairs.push({ id: fields[i][0], map : x});
    }

    //this._entity._internal.modified.forEach((val, key) => {
    //  let x = this._schema.get(key);
    //  if (x) pairs.push({ id: key, map : x});
    //});

    return pairs;


    //return this._entity.flush();
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
