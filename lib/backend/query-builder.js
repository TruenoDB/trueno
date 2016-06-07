"use strict";

/**
 * @author Victor O. Santos Uceta
 * Query Builder module with template engine.
 * @module lib/backend/queryBuilder
 * @see module:backend/query
 */


/** Import modules */
const fs = require('fs');
const _ = require('lodash');
const templateIndex = require('./query_templates/index');

/** block level variable for singleton class */
let instance = null;

//const Components = {
//  GENERAL: '_general',
//  GRAPH: '_graph',
//  VERTEX: '_vertex',
//  sEDGE: '_edge'
//};
//
//const Operations = {
//  USE: 'use',
//  CLEAR: 'clear',
//  CREATE: 'create',
//  CREATE_GRAPH_TABLE: 'create_graph_table',
//  CREATE_VERTEX_TABLE: 'create_vertex_table',
//  CREATE_EDGE_TABLE: 'create_edge_table',
//
//  IMPORT: 'import',
//
//  DELETE: 'delete',
//  INSERT: 'insert',
//  SELECT: 'select',
//  UPDATE: 'update',
//  LIST: 'list',
//  LIST_NEIGHBORS: 'neighbors'
//};

const Enums = require('../core/enum/backend'),
  Components = Enums.Components,
  Operations = Enums.Operations;

//var Components = Enums.Components;
//var Operations = Enums.Operations;

/** block level variable for singleton class */
//let instance = null;

/** Description of the class */
class QueryBuilder {


  /**
   * Create a singleton query builder object.
   */
  constructor() {

    /* check if already instantiated */
    if (!instance) {
      instance = this;
    };

    /* Read all templates and synchronously */
    this._general = {
      use: _.template(fs.readFileSync(templateIndex.general.use))
    };

    /* graph */
    this._graph = {
      create: _.template(fs.readFileSync(templateIndex.graph.create)),
      create_graph_table: _.template(fs.readFileSync(templateIndex.graph.create_graph_table)),
      create_vertex_table: _.template(fs.readFileSync(templateIndex.graph.create_vertex_table)),
      create_edge_table: _.template(fs.readFileSync(templateIndex.graph.create_edge_table)),

      import: _.template(fs.readFileSync(templateIndex.graph.import)),

      //clear:  _.template(fs.readFileSync(templateIndex.graph.clear)),
      //select: _.template(fs.readFileSync(templateIndex.graph.select)),
      //update: _.template(fs.readFileSync(templateIndex.graph.update)),
      delete: _.template(fs.readFileSync(templateIndex.graph.delete))
    };

    /* vertex */
    this._vertex = {
      //clear:  _.template(fs.readFileSync(templateIndex.vertex.clear)),
      //select: _.template(fs.readFileSync(templateIndex.vertex.select)),
      //insert: _.template(fs.readFileSync(templateIndex.vertex.insert)),
      //update: _.template(fs.readFileSync(templateIndex.vertex.update)),
      delete: _.template(fs.readFileSync(templateIndex.vertex.delete)),

      "list": _.template(fs.readFileSync(templateIndex.vertex.list)),
      "neighbors": _.template(fs.readFileSync(templateIndex.vertex.neighbors))
    };

    /* edge */
    this._edge = {
      //clear:  _.template(fs.readFileSync(templateIndex.edge.clear)),
      //select: _.template(fs.readFileSync(templateIndex.edge.select)),
      //insert: _.template(fs.readFileSync(templateIndex.edge.insert)),
      //update: _.template(fs.readFileSync(templateIndex.edge.update)),
      delete: _.template(fs.readFileSync(templateIndex.edge.delete))
    };

  };


  /**
   * Get the component enumerator.
   * @return {enum} An inmutable component object enumerator.
   */
  static get Components() {
    return Components;
  }


  /**
   * Get the operations enumerator.
   * @return {enum} An inmutable operations object enumerator.
   */
  static get Operations() {
    return Operations;
  }


  /**
   * Build a query given the component(general, graph, vertex, or edge).
   * @param {string} component - A string indicating the component for the query.
   * @param {string} operation - A string indicating the operation for the component.
   * @param {object} bindings  - An object for the query parameter binding.
   * @return {string} A valid cql query.
   */
  build(component, operation, bindings) {

    /* If component or operation are invalid, throw error */
    if (!this[component] || !this[component][operation]) {
      throw new Error('Provided component or operation invalid. Component:'
        + component + ', Operation: ' + operation);
    }

    return this[component][operation](bindings);

  }


  /**
   * Build a batch query with a given query list.
   * @param {array} [queries=[]] - An array containing all queries to be executed inside the batch.
   * @return {string} A valid cql batch query.
   */
  buildBatch(queries = []) {
    // TODO: implement buildBatch query feature
  }

}


/* exporting the module */
module.exports = QueryBuilder;
