"use strict";

/**
 * @author Victor O. Santos Uceta
 * Elastic Search class.
 * @module lib/search/search-client
 */

/** Import modules */
const elasticsearch = require('elasticsearch');
const Bodybuilder = require('bodybuilder');
const Promise = require('bluebird');

/** The search indexing class */
class Search {

  /**
   * Create a search object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {
    /* Exposing host and port */
    this._host = param.host || global.config.local.host;
    this._port = param.port || global.config.components.elasticsearch.configFlags['http.port'];
    this._client = null;
    /* Importing Search Utilities */
    this._mappings = require('./templates/mappings.json');

  }

  /**
   * Initialize the search module, this will connect to the indexing search engine.
   * @return {promise} The promise with the connection result.
   */
  init() {

    /* This instance object reference */
    let self = this;

    return new Promise((resolve, reject)=> {
      self._client = new elasticsearch.Client({
        host: self._host + ':' + self._port,
      });

      /* Set elastic search SQL method */
      self._client.sql = self._sqlCall;
      /* Set elastic search SQL method */
      self._client.join = self._joinCall;

      /* trying ping the search engine */
      self._client.ping({
        requestTimeout: 10000
      }, (error)=> {
        if (error) {
          reject(error);
        } else {
          /* Resolve sync promise */
          resolve(self._host + ':' + self._port);
        }
      });
    });
  }

  /**
   * Create index with the provided name and add mapping.
   * @param {string} idx - The index name to be created.
   * @return {promise} The promise with the true/false result.
   */
  initIndex(idx) {
    /* This instance object reference */
    return this._client.indices.create({
      index: idx,
      body: {mappings: this._mappings}
    })
  }

  /**
   * Check if index exist.
   * @param {string} idx - The index name to be created.
   * @return {promise} The promise with the true/false result.
   */
  indexExists(idx) {

    return this._client.indices.exists({
      index: idx
    })
  }

  /**
   * Deletes provided index.
   * @param  {string} idx - The index name to be created.
   * @return {promise} The promise with the true/false result.
   */
  deleteIndex(idx) {
    return this._client.indices.delete({
      index: idx
    });
  }

  /**
   * List all indexes in the engine.
   * @return {promise} The promise with the indexes list.
   */
  listIndexes() {
    return this._client.indices.getAliases();
  }

  /**
   * Instantiate a new Bodybuilder object.
   * @return {Bodybuilder} A new bodybuilder object instance
   */
  filterFactory() {
    return new Bodybuilder();
  }

  /**
   * Index the component, update will be done if id is provided and only for existing fields, new fields need to use
   * the update function.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {promise} The promise with the results.
   */
  index(c, index, type) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let obj = self._buildObject(c, index, type);

      /* execute search */
      self._client.index(obj).then((response)=> {

        resolve(response);

      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * Perform bulk operation(index and deletes) all at once.
   * @param {Array} b - A collection of the operation for the bulk.
   * @return {promise} The promise with the results.
   */
  bulk(b, index) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let obj = self._buildBulkObject(b, index);

      /* execute search */
      self._client.bulk(obj).then((response)=> {

        resolve(response);

      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * Delete a document with the provided id.
   * @param {component} c - The document to be deleted, must contain id, type, and index.
   * @return {promise} The promise with the results.
   */
  delete(c, index, type) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let obj = self._buildObject(c, index, type);

      /* execute search */
      self._client.delete(obj).then((response)=> {

        resolve(response);

      }, (error) => {

        reject(error);
      });
    });
  }

  /**
   * Delete a document with the provided id.
   * @param {component} c - The document to be deleted, must contain id, type, and index.
   * @return {promise} The promise with the results.
   */
  deleteByFilter(f, index, type) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let q = self._buildQueryFilter(f, index, type)

      /* execute search */
      self._client.delete(q).then((response)=> {

        resolve(response);

      }, (error) => {

        reject(error);
      });
    });
  }

  /**
   * Search the elastic search engine for matching results.
   * @param {Bodybuilder} f - The filter containing the query.
   * @param index
   * @param type
   * @param filterPrebuilded
   * @return {promise} The promise with the results.
   */
  search(f, index, type, filterPrebuilded) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let q = self._buildQueryFilter(f, index, type, filterPrebuilded)

      /* execute search */
      self._client.search(q).then((response)=> {

        resolve(response.hits.hits);

      }, (error) => {

        reject(error);
      });
    });
  }

  /**
   * Use the sql query to fetch results from the engine.
   * @param {Bodybuilder} f - The filter containing the query.
   * @return {promise} The promise with the results.
   */
  sql(q) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* execute search */
      self._client.sql(q).then((response)=> {

        resolve(response.hits.hits);

      }, (error) => {

        reject(error);
      });
    });
  }

  /**
   * Join across indexes or in the same index to get results.
   * @param {Object} f - The filter containing the query.
   * @return {promise} The promise with the results.
   */
  join(f, index, type) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* execute coordinated search */
      self._client.join(f, index, type).then((response)=> {

        resolve(response.hits.hits);

      }, (error) => {

        reject(error);
      });
    });
  }

  /**
   * Count the elastic search engine matching results.
   * @param {Bodybuilder} f - The filter containing the query.
   * @return {promise} The promise with the counter.
   */
  count(f, index, type) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let q = self._buildQueryFilter(f);

      /* execute search */
      self._client.count(q).then((response)=> {

        resolve(response);

      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * Builds the search query with the provided component information.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {string} The query string for the elasticsearch engine.
   */
  _sqlCall(q) {

    var self = this;

    var params = {
      method: "POST",
      path: "/_sql",
      query: {"sql": q}
    };

    return new Promise((resolve, reject) => {
      self.transport.request(params, (err, results)=> {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Builds the join call with the provided component information.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {Promise} The promise with the join
   */
  _joinCall(f, index, type) {

    var self = this;

    var params = {
      method: "POST",
      path: index+"/"+type+"/_coordinate_search",
      body: f
    };

    return new Promise((resolve, reject) => {
      self.transport.request(params, (err, results)=> {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * query with the provided component information.
   * @param {Array} b - The operations array.
   * @return {string} The bulk request object for the elasticsearch engines.
   */
  _buildBulkObject(b, index) {

    let obj = {
      index: index,
      body: b
    };

    return obj;
  }

  /**
   * Builds the search query with the provided component information.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {string} The query string for the elasticsearch engine.
   */
  _buildQueryFilter(f, index, type, prebuilded) {

    let obj = {
      index: index,
      type: type,
      //fields: [],
      body: (prebuilded) ? f : f.build()
    };

    return obj;
  }

  /**
   * Builds the object to be inserted/updated and indexed in the elasticsearch engine.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {object} The elasticsearch object parameter.
   */
  _buildObject(c, index, type, isUpdate) {

    /* instantiate the object */
    let obj = {
      index: index,
      type: type
    };
    /* if the id is present, assign */
    if (c.hasOwnProperty('id')) {
      if (c.id) {
        obj.id = c.id;
      }
      else {
        delete c.id;
      }
    }
    /* check if update */
    if (isUpdate) {
      obj.body = {doc: c};
    } else {
      obj.body = c;
    }
    /* return object parameter */
    return obj;
  }
}

/* exporting the module */
module.exports = Search;
