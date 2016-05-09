const Promise = require("bluebird");
const _ = require('lodash');
const fs = require('fs');
const Connection = require('./cassandraConnection');

/* command line arguments */
var args = process.argv.slice(2);

/* Reading and creating compiled templates */
const useTmplt = fs.readFileSync("./query_templates/general_use.qryt", 'utf8');
const createGraphTmplt = fs.readFileSync("./query_templates/graph_create.qryt", 'utf8');
const deleteGraphTmplt =  fs.readFileSync("./query_templates/graph_delete.qryt", 'utf8');
const createGraphEdgeTable= fs.readFileSync("./query_templates/graph_create_edge_table.qryt", 'utf8');
const createGraphGraphTable= fs.readFileSync("./query_templates/graph_create_graph_table.qryt", 'utf8');
const createGraphVertexTable= fs.readFileSync("./query_templates/graph_create_vertex_table.qryt", 'utf8');

/*  Compile templates */
const useCompiled = _.template(useTmplt);
const createGraphCompiled = _.template(createGraphTmplt);
const deleteGraphCompiled = _.template(deleteGraphTmplt);

/* creating connection */
var conn = new Connection({hosts:['localhost']});
/* Connect */
conn.connect().then(function(){

	/* Graph Params */
	var graphParams =  {'name': args[1], 'strategy':'SimpleStrategy', 'replicationFactor' : 3};

	/* Executing CRUD */
	switch(args[0]){

		case 'create':
			
			let createGraphQuery = createGraphCompiled(graphParams);

			/* Execute Create graph Query */
			conn.execute(createGraphQuery).then( result => {
				/* graph keyspace created, now use it */
				let q = useCompiled({name:graphParams.name});
				/* execute query and return promise */
				return conn.execute(q);

			}).then(result => {
				/* already using the graph keyspace, now create the graph tables */
				let q = createGraphGraphTable;
				/* execute query and return promise */
				return conn.execute(q);

			}).then(result => {
				/* already using the graph keyspace, now create the graph tables */
				let q = createGraphVertexTable;
				/* execute query and return promise */
				return conn.execute(q);

			}).then(result => {
				/* already using the graph keyspace, now create the graph tables */
				let q = createGraphEdgeTable;
				/* execute query and return promise */
				return conn.execute(q);

			}).then( result => {
				
				/* try to disconnect */
				return conn.disconnect();

			}).then( result => {
				
				/* try to disconnect */
				console.log("Creating graph successful");

			}).catch(e => {
			  	console.log(e); 
			});

			break;
		case 'delete':

			let deleteGraphQuery = deleteGraphCompiled(graphParams);

			/* Execute Create graph Query */
			conn.execute(deleteGraphQuery).then(result =>{
				/* try to disconnect */
				return conn.disconnect();

			}).then( result => {
				/* disconnection successful */
				console.log("Deleting graph successful");

			}).catch( result => {
			  	console.log(e); 
			});

			break;

		case 'insert':

			break;
	}

});