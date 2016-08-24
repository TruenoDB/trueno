"use strict";

/*
 ________                                                 _______   _______
 /        |                                               /       \ /       \
 $$$$$$$$/______   __    __   ______   _______    ______  $$$$$$$  |$$$$$$$  |
 $$ | /      \ /  |  /  | /      \ /       \  /      \ $$ |  $$ |$$ |__$$ |
 $$ |/$$$$$$  |$$ |  $$ |/$$$$$$  |$$$$$$$  |/$$$$$$  |$$ |  $$ |$$    $$<
 $$ |$$ |  $$/ $$ |  $$ |$$    $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$$$$$$  |
 $$ |$$ |      $$ \__$$ |$$$$$$$$/ $$ |  $$ |$$ \__$$ |$$ |__$$ |$$ |__$$ |
 $$ |$$ |      $$    $$/ $$       |$$ |  $$ |$$    $$/ $$    $$/ $$    $$/
 $$/ $$/        $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$/  $$$$$$$/  $$$$$$$/
 */

/** In God we trust
 * @author Victor Santos, Servio Palacios
 * @date_creation 2016.08.19.
 * @module lib/search/search-manager.js
 * @description Elastic Search Super Class
 *
 */

const Search = require('./search-client');
const Promise = require('bluebird');

//Local Libraries
var Enums = require("./enum/enums");

/** The search indexing super class */
class SearchManager {

  /**
   * Create a search object.
   * @param {object} [param={}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /** New instance of Elastic Search Indexing Class */
    this._search = null;

    this._host = param.host || 'http://localhost';

    this._port = param.port || 8004;

  }//constructor

  /**
   * Create a elasticSearch connector and init the search manager
   * @return {promise} The promise with the initialization results.
   */
  init() {

    /* This instance object reference */
    let self = this;
    /* instantiate the search client */
    this._search = new Search({host: this._host, port: this._port});
    /* Initializing and returning promise */
    return this._search.init();
  }//init

  /**
   * Insert the component, update will be done if id is provided and only for existing fields
   * @return {promise} The promise with the results.
   */
  createGraph(obj, idx, type) {

    let self = this;

    return new Promise((resolve, reject) => {
      self._search.indexExists(idx).then((exist)=> {
        if (exist) {
          reject("Graph with label '" + idx + "' already exists", idx);
        } else {
          self._search.initIndex(idx).then((result)=> {
            logger.info('Graph Index for ' + idx + ' created:', result);
            return self._search.index(obj, idx, type);
          }, (error)=> {
            logger.error('Graph creation error', error);
            reject(error);
          }).then((result)=> {
            logger.info("Graph Index for '" + idx + "' body created:", result);
            resolve(result);
          }, (error)=> {
            logger.error('Graph body creation error', error);
            reject(error);
          });
        }
      }, (error)=> {
        logger.error('Graph verification error', error);
        reject(error);
      });
    });

  }//createGraph

  /**
   * Insert the component, update will be done if id is provided and only for existing fields
   * @return {promise} The promise with the results.
   */
  persist(obj, idx, type) {

    let self = this;

    return new Promise((resolve, reject) => {
      self._search.index(obj, idx, type).then((result)=> {
        resolve(result);
      }, (error)=> {
        reject(error);
      });
    });
  }//persist

  /**
   * Delete a document with the provided id.
   * @return {promise} The promise with the results.
   */
  destroy(obj, ftr, idx, type) {

    let self = this;
    /* if id is present, delete that component */
    if (type == 'g') {
      return self._search.deleteIndex(idx);
      /* if id is present, delete that component */
    } else if (obj) {
      return self._search.delete(obj, idx, type);
      /* if id is present, delete that component */
    } else if (ftr) {
      let f = self.buildFilter(ftr);
      return self._search.deleteByFilter(f, idx, type);
    } else {
      return new Promise((resolve, reject)=> {
        reject(new Error('No filter or id for deletion provided'));
      });
    }
  }//destroy

  /**
   * Build filter from parameters received in external-api.js
   * @param {Array} filters - Array of filter rules to be build.
   * @return {Bodybuilder} - The filter object.
   */
  buildFilter(filters) {

    /* The bodybuilder filter instance */
    let oFilter = this._search.filterFactory();

    filters.forEach((filterRule) => {

      /* The filter function(not, and or) */
      let filterFnc;
      /* determining the filter function */
      switch (filterRule.ftr) {
        case 'AND':
          filterFnc = 'filter';
          break;
        case 'OR':
          filterFnc = 'orFilter';
          break;
        case 'NOT':
          filterFnc = 'notFilter';
          break;
      }

      switch (filterRule.type) {
        /* Three parameter filters */
        case Enums.filterType.TERM:
        case Enums.filterType.PREFIX:
        case Enums.filterType.REGEXP:
        case Enums.filterType.WILDCARD:
          /* executing the and|or|not filter(filterFnc) with the term, prefix, regexp, or wildcard filters */
          oFilter = oFilter[filterFnc](filterRule.type, filterRule.prop, filterRule.val);
          break;
        case Enums.filterType.EXISTS:
          /* executing the and|or|not filter(filterFnc) with the exists or missing filters */
          oFilter = oFilter[filterFnc](filterRule.type, 'field', filterRule.prop);
          break;
        case Enums.filterType.SIZE:
          /* executing the size limit filter */
          oFilter = oFilter.size(filterRule.val);
          break;
        case Enums.filterType.RANGE:
          let range = {};
          range[filterRule.op] = filterRule.val;
          oFilter = oFilter[filterFnc](filterRule.type, filterRule.prop, range);
      }
    });

    return oFilter;

  }//buildFilter

  /**
   * Fetch requested components to client.
   * @return {promise} The promise with the results.
   */
  fetch(ftr, idx, type) {

    let self = this;

    return new Promise((resolve, reject) => {
      let filter = self.buildFilter(ftr);
      self._search.search(filter, idx, type).then((result) => {
        resolve(result);
      }, (error) => {
        logger.error('Fetching Data from Index error', error);
        reject(error);
      })
    });

  }//fetch

  /**
   * Fetch requested components to client.
   * @return {promise} The promise with the results.
   */
  vertices(id, idx) {

    let self = this;

    return new Promise((resolve, reject) => {

      /* return vertices attached to is edge */
      let filter = self._search.filterFactory().filter('term', 'id', id)
        .filter('term', 'id', id);

      self._search.search(filter, idx, 'e').then((edges) => {

        /* If found */
        if (edges.length > 0) {
          /* build vertices filter */
          let eFilter = self._search.filterFactory()
            .filter('term', 'id', edges[0]._source.source)
            .orFilter('term', 'id', edges[0]._source.target);

          /* fetch vertices */
          self._search.search(eFilter, idx, 'v').then((vertices) => {
              /* return source and target */
              let results = {source: null, target: null};
              /* Set source and target */
              vertices.forEach((v)=>{
                if(v._source.id == edges[0]._source.source){
                  results.source = edges[0]._source;
                }else if(v._source.id == edges[0]._source.target){
                  results.target = edges[0]._source;
                }
              });
            /* return results */
            resolve(results);
          }, (error) => {
            logger.error('Fetching vertices from edge(' + id + ') error', error);
            reject(error);
          })

        } else {
          /* not found */
          reject(new Error('Edge with id: ' + id + ' not found'));
        }
      }, (error) => {
        logger.error('Fetching edge(' + id + ') error', error);
        reject(error);
      })
    });

  }//fetch

}//class

/* Exporting the module */
module.exports = SearchManager;
