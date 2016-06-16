"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Basic enumerations for backend
 * @module lib/core/enum/backend
 * @see lib/backend
 */

/** Description of the class */
function BackendEnums()  {

  this.Constant = {
    ROOT_KEYSPACE : 'system_trueno'
  };


  this.Components = {
    GENERAL: '_general',
    GRAPH:  '_graph',
    VERTEX: '_vertex',
    EDGE:   '_edge'
  };

  this.Operations = {
    USE:   'use',
    CLEAR: 'clear',
    CREATE: 'create',
    CREATE_GRAPH_TABLE:  'create_graph_table',
    CREATE_VERTEX_TABLE: 'create_vertex_table',
    CREATE_EDGE_TABLE:   'create_edge_table',

    IMPORT: 'import',

    GET: 'get',
    GETALL: 'getall',

    DROP: 'drop',

    DELETE: 'delete',
    INSERT: 'insert',
    SELECT: 'select',
    UPDATE: 'update',
    LIST:   'list',
    LIST_NEIGHBORS: 'neighbors'
  };
}


/* exporting the module */
module.exports = Object.freeze(new BackendEnums());
