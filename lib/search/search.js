"use strict";


/** Import modules */
const elasticsearch = require('elasticsearch');

/** The search indexing class */
class Search {

  /**
   * Create a search object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {
    /* Exposing host and port */
    this._host = param.host || 'http://localhost';
    this._port = param.port || 8004;
    this._client = null;
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
       log: 'trace'
      });
      /* trying ping the search engine */
      self._client.ping({
        requestTimeout: 10000
      }, (error)=> {
        if (error) {
          //logger.error('Elasticsearch cluster is down!', error);
          reject(error);
        } else {
          //logger.info('Elasticsearch ping successful');
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
    let self = this;

    return this._client.indices.create({
      index: idx
    });
  }

  /**
   * Check if index exist.
   * @param {string} idx - The index name to be created.
   * @return {promise} The promise with the true/false result.
   */
  indexExists(idx) {
    return this._client.indices.exists({
      index: idx
    });
  }

  /**
   * Deletes provided index.
   * @param {string} idx - The index name to be created.
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
   * Insert/update and index the component, upate will be done if no id is provided.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {promise} The promise with the results.
   */
  put(c) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let obj = self._buildObject(c);

      /* execute search */
      self._client.index(obj).then((response)=> {

        resolve(response);

      }, (error) => {
        reject(error.message);
      });
    });
  }

  /**
   * Search the elastic search engine for matching results.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {promise} The promise with the results.
   */
  search(c) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let q = self._buildQuery(c);

      /* execute search */
      self._client.search(q).then((response)=> {

        resolve(response.hits.hits);

      }, (error) => {

        reject(error.message);
      });
    });
  }

  /**
   * Count the elastic search engine matching results.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {promise} The promise with the counter.
   */
  count(c) {

    /* This instance object reference */
    let self = this;

    /* Promise for the search results */
    return new Promise((resolve, reject)=> {

      /* Building the query */
      let q = self._buildQuery(c);

      /* execute search */
      self._client.count(q).then((response)=> {

        resolve(response);

      }, (error) => {
        reject(error.message);
      });
    });
  }

  /**
   * Builds the search query with the provided component information.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {string} The query string for the elasticsearch engine.
   */
  _buildQuery(c) {

    return c;
  }

  /**
   * Builds the object to be inserted/updated and indexed in the elasticsearch engine.
   * @param {component} c - The graph component, can be a graph, edge, or vertex.
   * @return {object} The elasticsearch object parameter.
   */
  _buildObject(c) {

    return c;

  }


}


/* exporting the module */
module.exports = Search;