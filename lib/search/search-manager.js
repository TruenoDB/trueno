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

    /* utilities */
    this._utils = {};
    this._utils.mappings = {};
    this._utils.filters = {};
    /* Importing filters and joins */
    this._filters = require('./templates/filters.json');
    this._InOut_Template = require('./templates/vertices-neighbors.json');
    this._InOut_Edges_Template = require('./templates/edges-neighbors.json');
    this._InOut_Edges_Template_IN = require('./templates/edges-neighbors-in.json');

  }//constructor

  /**
   * Create a elasticSearch connector and init the search manager
   * @return {promise} The promise with the initialization results.
   */
  init() {

    /* This instance object reference */
    let self = this;
    /* instantiate the search client */
    this._search = new Search();
    /* Initializing and returning promise */
    return this._search.init();
  }//init

  /**
   * Insert the component, update will be done if id is provided
   * and only for existing fields
   * @param {Component} obj -> Object from Client
   * @param {String} idx    -> Index
   * @param {String} type   -> Type of Index (v,e)
   * @return {promise}      -> The promise with the results.
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
            /* Removing graph id if present */
            if (obj.id) {
              delete obj.id;
            }
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
   * Insert the component, update will be done if id is provided
   * and only for existing fields
   * @param {String} obj    -> Object from Client
   * @param {String} idx    -> Index
   * @param {String} type   -> Type of Index (v,e)
   * @return {promise}      -> The promise with the results.
   */
  persist(obj, idx, type) {

    let self = this;

    return new Promise((resolve, reject) => {

      if (!Number.isInteger(obj.id) && type != 'g') {
        reject('All vertices and edges must have an integer id');
      }

      self._search.index(obj, idx, type).then((result)=> {
        resolve(result);
      }, (error)=> {
        reject(error);
      });
    });
  }//persist

  /**
   * Perform bulk operation(index and deletes) all at once.
   * @param {Array} b - A collection of the operation for the bulk.
   * @return {promise} The promise with the results.
   */
  bulk(b, idx) {

    let self = this;

    return new Promise((resolve, reject) => {

      /* build bulk operations array */
      let bulkOp = self.buildBulk(b, reject);

      /* apply bulk operations */
      self._search.bulk(bulkOp, idx).then((result)=> {
        resolve(result);
      }, (error)=> {
        reject(error);
      });
    });
  }

  /**
   * Delete a document with the provided id.
   * @param {Component} obj     -> Object from Client
   * @param {Bodybuilder} ftr   -> Client's Filter
   * @param {String} idx        -> Index
   * @param {String} type       -> Type of Index (v,e)
   * @return {promise}          -> The promise with the results.
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

    if (filters) {

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

    }//if

    return oFilter;

  }//buildFilter

  /**
   * Build the bulk operations.
   * @param {Array) b  -> The bulk operations array.
   * @return {promise} -> The promise with the results.
   */
  buildBulk(b, reject) {

    /* the bulk operations array */
    let operations = [];
    var arrOperations = [];

    /* for each operation build the bulk corresponding operation */
    b.forEach((e)=> {
      /* content to be constructed according to the operation */
      let meta = {};
      switch (e.op) {
        case 'ex_persist':
            
            meta = {"index": {"_type": e.content.type}};
            /* setting id if present */
            if (!Number.isInteger(e.content.obj.id)) {
                reject('All vertices and edges must have an integer id');
                return;
            }
            /* setting id if present */
            meta.index._id = e.content.obj.id;
            /* adding meta */
            operations.push(meta);
            /* adding content */
            operations.push(e.content.obj);
            /* adding operations */
            arrOperations.push(["index",e.content.type,e.content.obj.id.toString(),
                                JSON.stringify(e.content.obj)]);

            break;
        case 'ex_destroy':
            meta = {"delete": {"_type": e.content.type, _id: e.content.obj.id}};
            /* adding meta */
            operations.push(meta);
            /* I use this 2d array - adding operations */
            arrOperations.push(["delete",e.content.type,e.content.obj.id.toString()]);
            break;
        }
    });

    return arrOperations;
  }

  /**
   * Executes SQL query and return results.
   * @param q  - The sql query filter.
   * @return {promise} -> The promise with the results.
   */
  sql(q) {

    let self = this;

    return new Promise((resolve, reject) => {
      self._search.sql(q).then((results) => {
        resolve(results);
      }, (error) => {
        logger.error('Error executing sql ', error.message, error.query);
        reject(error);
      })
    });

  }//fetch

  /**
   * Return components matching a query.
   * @param {Bodybuilder} ftr -> Client's Filter
   * @param {String} idx      -> Index
   * @param {String} type     -> Type of Index (v,e)
   * @param {boolean} mask    -> Mask the error (don't log it)
   * @return {promise}        -> The promise with the results.
   */
  fetch(ftr, idx, type, mask) {

    let self = this;
    let flag = mask || false;

    return new Promise((resolve, reject) => {
      let filter = self.buildFilter(ftr);
      self._search.search(filter, idx, type).then((result) => {
        resolve(result);
      }, (error) => {
        if (!flag) logger.error('Fetching Data from Index error', error);
        reject(error);
      })
    });

  }//fetch

  /**
   * The neighbourhood of a vertex v in a graph G is the induced subgraph of G
   * consisting of all vertices adjacent to v.
   * @param {Long} id                  -> Component id
   * @param {Bodybuilder} ftr   -> Filter from client
   * @param {Bodybuilder} sFtr  -> Secondary filter (still don't used)
   * @param {string} dir        -> Direction Outgoing=out, Incoming=in
   * @param {string} idx        -> Index
   * @param {string} type       -> Type of Index (v,e)
   * @return {promise}          -> The promise with the results.
   */
  neighbors(id, ftr, sFtr, dir, idx, type) {

    let self = this;
    /* Builds coordinated search query to be used with the join method */
    let filter = self._buildCoordinatedSearchQuery(id, ftr, sFtr, dir, idx, type);
    /* loging filter */
    console.log(JSON.stringify(filter));
    /* Log the filter */
    logger.debug(JSON.stringify(filter));

    return new Promise((resolve, reject) => {

      self._search.join(filter, idx, type).then((result) => {
        resolve(result);
      }, (error) => {
        logger.error('Coordinated Search Error', error);
        reject(error);
      })
    });

  }//neighbors

  /** This siren-join plugin introduces two new search actions,
   * _coordinate_search that replaces the _search action
   * This method builds a query following Filter Join properties of siren-join
   * @param {Long} id           -> Component id
   * @param {Bodybuilder} ftr   -> Filter from client
   * @param {Bodybuilder} sFtr  -> Secondary filter
   * @param {String} dir        -> Direction Outgoing=out, Incoming=in
   * @param {String} idx        -> Index
   * @param {String} type       -> Type of Index (g,v,e)
   * @returns {json}            -> Modified Coordinated Search Query
   * @private
   */
  _buildCoordinatedSearchQuery(id, ftr, sFtr, dir, idx, type) {

    let self = this;

    /* Coordinated Search Query/Filter */
    let csFilter = null;

    if (type == 'v') {

      csFilter = JSON.parse(JSON.stringify(self._InOut_Template));

      /* direction logic */
      let edgeEndpoint, edgeFrom;

      /* Setting the index */
      csFilter.query.filtered.filter.filterjoin.id.indices[0] = idx;
      if (dir === Enums.dirEdge.OUTGOING) {
        /* Setting the foreign key */
        edgeEndpoint = Enums.edgeEndPoint.TARGET;
        edgeFrom = 'source';
      }
      else {
        /* Setting the foreign key */
        edgeEndpoint = Enums.edgeEndPoint.SOURCE;
        edgeFrom = 'target';
      }

      /* Setting the foreign key */
      csFilter.query.filtered.filter.filterjoin.id.path = edgeEndpoint;
      /* Setting the value of vertex.id as first index filter - all e with source id */
      let innerFtr = {ftr: 'AND', type: 'term', prop: edgeFrom, val: id};
      /* validate that filter is not null */
      let innerFtrArr = (sFtr) ? sFtr : [];
      /* insert filter */
      innerFtrArr.unshift(innerFtr);
      /* build the query */
      let innerQuery = self.buildFilter(innerFtrArr).build();
      /* assign filter */
      csFilter.query.filtered.filter.filterjoin.id.query = innerQuery;


    } else if (dir == Enums.dirEdge.OUTGOING) {
      csFilter = JSON.parse(JSON.stringify(self._InOut_Edges_Template));
      /* Setting the index */
      csFilter.query.filtered.filter.filterjoin.source.indices[0] = idx;
      csFilter.query.filtered.filter.filterjoin.source.query.term = {"source": id};
    }
    else if (dir == Enums.dirEdge.INCOMING) {
      csFilter = JSON.parse(JSON.stringify(self._InOut_Edges_Template_IN));
      /* Setting the index */
      csFilter.query.filtered.filter.filterjoin.target.indices[0] = idx;
      csFilter.query.filtered.filter.filterjoin.target.query.term = {"target": id};
    }

    /* Building client's filter */
    let builtFilter = self.buildFilter(ftr).build();

    /* Assigning client's filter, validate when ftr is null if so [MATCH_ALL] */
    if (ftr) {
      csFilter.query.filtered.query = builtFilter.query;
    }

    return csFilter;

  }//buildCoordinatedSearchQuery

  /**
   * Get the number of documents for the cluster, index, type, or a query.
   * @param {Bodybuilder} ftr   -> Client's Filter
   * @param {String} idx        -> Index
   * @param {String} type       -> Type of Index (v,e)
   * @return {promise}          -> The promise with the results.
   */
  count(ftr, idx, type) {

    let self = this;

    return new Promise((resolve, reject) => {
      let filter = self.buildFilter(ftr);
      self._search.count(filter, idx, type).then((result) => {
        resolve(result);
      }, (error) => {
        logger.error('Counting Data from Index error', error);
        reject(error);
      })
    });

  }//count

  /**
   * Fetchs the vertices attached to a determined edge e
   * @param {Long} id       -> edge identifier
   * @param {String} idx    -> Index
   * @return {promise}      -> The promise with the results.
   */
  vertices(id, idx) {

    let self = this;

    return new Promise((resolve, reject) => {

      /* return vertices attached to is edge */
      let filter = self._filters.edge;
      filter.query.filtered.filter.term.id = id;

      self._search.search(filter, idx, 'e', true).then((edges) => {
        /* If found */
        if (edges.length > 0) {

          /* build vertices filter */
          let evFilter = self._filters.edgeVertices;
          evFilter.query.filtered.filter.bool.should[0].term.id = edges[0]._source.source;
          evFilter.query.filtered.filter.bool.should[1].term.id = edges[0]._source.target;

          /* fetch vertices */
          self._search.search(evFilter, idx, 'v', true).then((vertices) => {
            /* return source and target */
            let results = {source: null, target: null};
            /* Set source and target */
            vertices.forEach((v)=> {
              if (v._source.id == edges[0]._source.source) {
                results.source = v._source;
              } else if (v._source.id == edges[0]._source.target) {
                results.target = v._source;
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
          reject('Edge with id: ' + id + ' not found');
        }
      }, (error) => {
        logger.error('Fetching edge(' + id + ') error', error);
        reject(error);
      })
    });

  }//vertices

}//class

/* Exporting the module */
module.exports = SearchManager;
