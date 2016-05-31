"use strict";

/**
 * @author Victor O. Santos Uceta, ebarsallo
 * Sample that show how to use the basic operations.
 * @module backend/basic-sample
 * @see module:path/referencedModuleName
 */

/** Import modules */
const Promise = require('bluebird');
const fs = require('fs');
const connection = require('./cassandraConnection');
const queryBuilder = require('./queryBuilder');
const Enums = require('./enums');

/* command line arguments */
var args = process.argv.slice(2);

/* create connection */
var hostnames = '192.168.46.131'
var conn = new connection({hosts: [hostnames]});

/* query builder */
var q = new queryBuilder();
var Components = Enums.Components;
var Operations = Enums.Operations;

//console.log (q.build(Components.GRAPH, Operations.CREATE_GRAPH_TABLE));


/* connect */
conn.connect().then(function() {

  /* Graph Params */
  var graphParams =  {'name': args[1], 'strategy':'SimpleStrategy', 'replicationFactor' : 3};

  /* Executing operations */
  switch(args[0]){

    /* create graph structure */
    case 'create':

      /* Execute Create graph Query */
      conn.execute(q.build(Components.GRAPH, Operations.CREATE, graphParams)).then( result => {

        /* graph keyspace created, now use it */
        /* execute query and return promise */
        return conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name}));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return conn.execute(q.build(Components.GRAPH, Operations.CREATE_GRAPH_TABLE));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return conn.execute(q.build(Components.GRAPH, Operations.CREATE_VERTEX_TABLE));

      }).then( result => {

        /* already using the graph keyspace, now create the graph tables */
        /* execute query and return promise */
        return conn.execute(q.build(Components.GRAPH, Operations.CREATE_EDGE_TABLE));

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

      /* Execute Create graph Query */
      conn.execute(q.build(Components.GRAPH, Operations.DELETE, graphParams)).then( result =>{

        /* try to disconnect */
        return conn.disconnect();

      }).then( result => {
        /* disconnection successful */
        console.log("Deleting graph successful");

      }).catch( e => {
        console.log(e);
      });

      break;

    case 'insert':
      break;

    case 'import':

      // TOFIX:
      // COPY is not supported. Temporary solution: can be done using a batch scripts (eg. python, with interface
      // to CQL).

      ///* change to specified keyspace, and return promise */
      //conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name})).then( result =>{
      //
      //  /* execute COPY to import data and return promise */
      //  return conn.execute(q.build(Components.GRAPH, Operations.IMPORT, {filename: args[2]}))
      //
      //}).then( result => {
      //
      //  /* try to disconnect */
      //  return conn.disconnect();
      //
      //}).then( result => {
      //
      //  /* disconnection successful */
      //  console.log("Deleting graph successful");
      //
      //}).catch( e => {
      //
      //  console.log(e);
      //});


      break;

    case 'add' :

      /* change to specified keyspace, and return promise */
      conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name})).then( result =>{

        /* execute command to retrieve nodes and return promise */
        return conn.execute(q.build(Components.VERTEX, Operations.LIST))

      }).then( result => {

        let vertices = result.rows;

        console.log('First 10 vertices');
        for (var i = 0; i < vertices.length; i++) {
          if (i >= 10) break;
          console.log(vertices[i]);
        }

        /* try to disconnect */
        return conn.disconnect();

      }).then( result => {


      }).catch( e => {

        console.log(e);
      });

      break;

    case 'list':

      /* change to specified keyspace, and return promise */
      conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name})).then( result =>{

        /* execute command to retrieve nodes and return promise */
        return conn.execute(q.build(Components.VERTEX, Operations.LIST))

      }).then( result => {

        let vertices = result.rows;

        console.log('First 10 vertices');
        for (var i = 0; i < vertices.length; i++) {
          if (i >= 10) break;
          console.log(vertices[i]);
        }

        /* try to disconnect */
        return conn.disconnect();

      }).then( result => {


      }).catch( e => {

        console.log(e);
      });

      break;

    case 'neighbors':

      /* change to specified keyspace, and return promise */
      conn.execute(q.build(Components.GENERAL, Operations.USE, {name:graphParams.name})).then( result =>{

        /* execute command to retrieve neighbors and return promise */
        return conn.execute(q.build(Components.VERTEX, Operations.LIST_NEIGHBORS, {node: args[2]}))

      }).then( result => {

        console.log(result.rows[0]);

        /* try to disconnect */
        return conn.disconnect();

      }).then( result => {


      }).catch( e => {

        console.log(e);
      });

      break;

  }

});

