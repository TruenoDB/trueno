"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * This module decription
 * @module lib/backend/session-util
 * @see module:path/referencedModuleName
 */

/** Import modules */
const _ = require('lodash');
const fs = require('fs');


/** Basic controller access class */
class SessionUtil {

  /**
   * FIXME: This has to be an static class.
   */
  constructor() {

    // FIXME: Move this to dato classes (entities mapping)
    // generic sql statements for CRUD operations.
    this._cql = {
      select : _.template('SELECT <%= columns %> <%= keyspace %>.<%= table %> WHERE <%= predicate %>;'),
      insert : _.template('INSERT INTO <%= keyspace %>.<%= table %> (<%= columns %>) VALUES (<%= values %>);'),
      update : _.template('UPDATE <%= keyspace %>.<%= table %> SET <%= columns %> WHERE <%= predicate %>;'),
      delete : _.template('DELETE <%= keyspace %>.<%= table %> WHERE <%= predicate %>;')
    }

  };


  /*======================== CRUD =======================*/

  selecto(entitymap) {

    let cols  = '';
    //let vals  = '';
    let first = true;

    // TODO: do some validations (eg. ?)

    let pairs = entitymap._entity.fields;
    pairs.forEach((val, key) => {
      if (!first) {
        cols += ',';
        //vals += ',';
      }
      else {
        first = false;
      }

      cols += key;
      //vals += entitymap[val];
    });


    let params = {
      'keyspace'  : entitymap.graphid,
      'table'     : entitymap.name,
      'columns'   : cols,
      'predicate' : entitymap.getPredicate()
    }
    return this._cql.insert(params);
  }

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
      'predicate' : entitymap.getPredicate()
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
module.exports = SessionUtil;
