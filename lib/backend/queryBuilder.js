"use strict";

/**
 * @author Victor O. Santos Uceta
 * Query Builder module with template engine.
 * @module backend/queryBuilder
 * @see module:backend/query
 */

/** Import modules */
const fs = require('fs');
const _ = require('lodash');
const tmpltIdx = require('./query_templates/index');

/** block level variable for singleton class */
let instance = null;

const Components = {
    GENERAL: '_general',
    GRAPH: '_graph',
    VERTEX: '_vertex',
    EDGE: '_edge',
};

const Operations = {
	CLEAR: 'clear'
	CREATE_GRAPH_TABLE: 'create_graph_table',
	CREATE_VERTEX_TABLE: 'create_vertex_table',
	CREATE_EDGE_TABLE: 'create_edge_table',
	DELETE: 'delete',
	INSERT: 'insert',
	SELECT: 'select',
	UPDATE: 'update',
	USE: 'use'
};

/** block level variable for singleton class */
let instance = null;

/** Description of the class */
class QueryBuilder {
    
    /**
     * Create a singleton query builder object.
     */
	constructor(){

		/* check if already instantiated */
		if(!instance){
              instance = this;
        }

		/* Read all templates and synchronously */
		this._general: {
			use: _.template(fs.readFileSync(tmpltIdx.general.use)),
		};
		this._graph: {
			create: _.template(fs.readFileSync(tmpltIdx.graph.create)),
			create_graph_table: _.template(fs.readFileSync(tmpltIdx.graph.create_graph_table)),
			create_vertex_table: _.template(fs.readFileSync(tmpltIdx.graph.create_vertex_table)),
			create_edge_table: _.template(fs.readFileSync(tmpltIdx.graph.create_edge_table)),
			delete: _.template(fs.readFileSync(tmpltIdx.graph.delete)),
			select: _.template(fs.readFileSync(tmpltIdx.graph.select)),
			update: _.template(fs.readFileSync(tmpltIdx.graph.update)),
			clear:  _.template(fs.readFileSync(tmpltIdx.graph.clear))
		};
		this._vertex: {
			select: _.template(fs.readFileSync(tmpltIdx.vertex.select)),
			insert: _.template(fs.readFileSync(tmpltIdx.vertex.insert)),
			update: _.template(fs.readFileSync(tmpltIdx.vertex.update)),
			delete: _.template(fs.readFileSync(tmpltIdx.vertex.delete)),
			clear: _.template(fs.readFileSync(tmpltIdx.vertex.clear))
		};
		this._edge: {
			select: _.template(fs.readFileSync(tmpltIdx.edge.select)),
			insert: _.template(fs.readFileSync(tmpltIdx.edge.insert)),
			update: _.template(fs.readFileSync(tmpltIdx.edge.update)),
			delete: _.template(fs.readFileSync(tmpltIdx.edge.delete)),
			clear: _.template(fs.readFileSync(tmpltIdx.edge.clear))
		}
	}
    /**
     * Get the component enumerator.
     * @return {enum} An inmutable component object enumerator.
     */
	static get Components(){
		return Components;
	}
    /**
     * Get the operations enumerator.
     * @return {enum} An inmutable operations object enumerator.
     */
	static get Operations(){
		return Operations;
	}
    /**
     * Build a query given the component(general, graph, vertex, or edge).
     * @param {string} component - A string indicating the component for the query.
     * @param {string} operation - A string indicating the operation for the component.
     * @param {object} bindings - An object for the query parameter binding.
     * @return {string} A valid cql query.
     */
	build(component, operation, bindings) {

		/* If component or operation are invalid, throw error */
		if(! this.[component] ||  !this.[component][operation]){
			throw new Error('Provided component or operation ivalid. Component:' 
				+ component + ', Operation: '+ operation); 
		}

		
	}
	 /**
     * Build a batch query with a given query list.
     * @param {array} [queries=[]] - An array containing all queries to be executed inside the batch.
     * @return {string} A valid cql batch query.
     */
	buildBatch(queries = []) {
		

	}
}


/* exporting the module */
module.exports = QueryBuilder;