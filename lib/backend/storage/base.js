"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Component's backend storage mapping super class
 * @module lib/backend/dato/base
 * @see module:core/data_structure
 */

/** Import modules */
const Schema = require('./schema');

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

    this._schema = new Schema();
  }

  /**
   * Returns the name of the table mapped to the component. The name includes the keyspace which enclosed the table.
   * @returns {string}  keyspace.table
   */
  get name() {

    return (this._keyspace || this.graphid) + '.' + this._name;
  }

  /**
   * Returns the graph id associated to the component.
   * @returns {*}
   */
  get graphid() {

    return this._entity.graphid;
  }

  get schema() {
    return this._schema.toMap();
  }


  /**
   * Returns the fields modified in the object. Used to update only the fields modified.
   * @returns {Array of Objects {id, map}}. <b>id</b> represents the idenfifier of the field in the backend,
   * while <b>map</b> represents the idenfitier of the field in the JS component.
   */
  flush() {

    let pairs = [];

    /* Check if there's a tracking of modified fields */
    if (this.hasOwnProperty("_entity._internal.modified")) {

      /* If there is a track of which fields have been modified, only those fields are returned */
      let fields = this._entity._internal.modified;

      for (var i = 0; i < fields.length; i++) {
        let x = this._schema.get(fields[i][0]);
        if (x) pairs.push({ id: fields[i][0], map : x});
      }

    } else {

      /* If there is no track of which fields have been modified, then get the entire schema is returned */
      pairs = this._schema.toArray(false);

    }

    return pairs;

  }


  /**
   * Set the schema for the component class.
   * @param id
   * @param map
   */
  setSchema(id, map, key) {
    this._schema.set(id, map, key);
  }


}


/* exporting the module */
module.exports = Base;
