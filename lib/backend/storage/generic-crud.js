"use strict";

/**
 * @author ebarsallo
 * Basic controller access class to perform CRUD operations.
 * @module lib/backend/dato/basic-controller
 * @see module:path/referencedModuleName
 */

/** Import modules */
const _ = require('lodash');
const fs = require('fs');
const utils = require('../util/tools');

// FIXME: Change name to SessionUtil
/** Basic controller access class */
class GenericCRUD {

    /**
     * Create a template object.
     * @param {object} [param= {}] - Parameter with default value of object {}.
     */
    constructor(param = {}) {

      // setting properties
      this._keyspace  = param.keyspace  || '';
      this._table     = param.table     || '';
      this._schema    = param.schema    || {};
      this._predicate = param.predicate || '';

      // generic sql statements for CRUD operations.
      this._cql = {
        insert : _.template('INSERT INTO <%= keyspace %>.<%= table %> (<%= columns %>) VALUES <%= values %>'),
        update : _.template('UPDATE <%= keyspace %>.<%= table %> SET (<%= columns %>) WHERE <%= predicate %>'),
        delete : _.template('DELETE <%= keyspace %>.<%= table %> WHERE <%= predicate %>')
      }

    };


  /*======================== CRUD =======================*/

  /**
   * Returns Generic insert statement.
   * @returns {string}
   */
  inserto(entitymap) {

    let cols  = '';
    let vals  = '';
    let first = true;

    // TODO: do some validations (eg. ?)

    let pairs = entitymap._entity.fields;
    pairs.forEach((val, key) => {
      if (!first) {
        cols += ',';
        vals += ',';
      }
      else {
        first = false;
      }

      cols += key;
      vals += entitymap[val];
    });


    let params = {
      'keyspace'  : entitymap.graphid,
      'table'     : entitymap.name,
      'columns'   : cols,
      'values'    : vals
    }
    return this._cql.insert(params);
  }


  /**
   * Generic update statement.
   * @returns {string}
   */
  updato(entitymap) {

    let cols  = '';
    let first = true;

    //console.log('static:  ',  entity.attributes);
    //console.log('dynamic: ', [entity.attributes]);

    // TODO: do some validations (eg. exists predicate?)
    let pairs = entitymap.flush()
    for (var i in pairs) {
      if (!first) { cols += ',' } else first = false;
      //let value = entity[pairs[i].map];

      cols += pairs[i].id + ' = ' + entitymap[pairs[i].map];
    }

    let params = {
      'keyspace'  : entitymap.graphid,
      'table'     : entitymap.name,
      'columns'   : cols,
      'predicate' : entitymap.predicate
    }
    return this._cql.update(params);
  }

  /**
   * Generic
   * @returns {string}
   */
  deleto() {

  }

  // TODO: implement CRUD operations based on prepared statement cql.


}


/* exporting the module */
module.exports = GenericCRUD;
