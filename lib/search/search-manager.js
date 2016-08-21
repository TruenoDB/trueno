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
  }

  /**
   * Insert the component, update will be done if id is provided and only for existing fields
   * @return {promise} The promise with the results.
   */
  insert() {

    let self = this;

    /* Init the search */
    self._search.init().then((host) => {

      return self._search.indexExists(self._index);

    }, (error)=> {

      console.log(error);

    }).then((exist)=> {

      if (exist) {

        return Promise.all([self._search.deleteIndex(self._index), self._search.initIndex(self._index)]);

      } else {

        return self._search.initIndex(self._index);

      }

    }).then((results) => {

      var promises = [];

      promises.push(self._search.insert('1', self._index, 'vertex'));

      promises.push(self._search.insert('2', self._index, 'edge'));

      return Promise.all(promises);

    }).then((results) => {

      console.log("done with creation");

    });


  }

  /**
   * Update the component. id is required.
   * @return {promise} The promise with the results.
   */
  update() {

    let self = this;

    /* Init the search */
    self._search.init().then((host) => {

      return self._search.indexExists(self._index);

    }, (error)=> {

      console.log(error);

    }).then((exist) => {

      var promises = [];

      if (exist) {

        console.log("index exists");
        //promises.push(self._search.update(v, self._index, 'vertex'));

      } else {

        console.log("This index does not exist");

      }

      return Promise.all(promises);

    }).then((results)=> {

      console.log("done with update");

    }, (err)=> {

      console.log(err);

    });

  }

  /**
   * Delete a document with the provided id.
   * @return {promise} The promise with the results.
   */
  delete() {
    let self = this;

    /* Init the search */
    self._search.init().then((host) => {

      return self._search.indexExists(self._index);

    }, (error)=> {

      console.log(error);

    }).then((exist)=> {

      var promises = [];

      if (exist) {

        /* Look up all documents in the index and delete those */
        /* Delete all values with these ids */
        /*
         promises.push(self._search.delete({id: id}, self._index, 'vertex'));
         */

      } else {

        console.log("This index does not exist");

      }

      return Promise.all(promises);

    }).then((results)=> {

      console.log("done with deletion");

    }, (err)=> {

      console.log(err);

    });

  }//delete


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
        case Enums.filterType.MISSING:
          /* executing the and|or|not filter(filterFnc) with the rexists or missing filters */
          oFilter = oFilter[filterFnc](filterRule.type, filterRule.prop);
          break;
        case Enums.filterType.SIZE:
          /* executing the size limit filter */
          oFilter = oFilter.size(filterRule.val);
          break;
        case Enums.filterType.RANGE:
          oFilter = oFilter[filterFnc](filterRule.type, filterRule.prop, filterRule.op, filterRule.val);
      }
    });

    return oFilter;

  }//buildFilter


  /**
   * Fetch requested components to client.
   */
  fetch() {

    let self = this;

    let componentType = '';

    switch (self._componentType) {

      case 'g':
        componentType = 'graph';
        break;

      case 'v':
        componentType = 'vertex';
        break;

      case 'e':
        componentType = 'edge';
        break;

    }//switch

    return self._search.search(self._builtFilter, self._index, componentType);

  }//fetch

}//class

/* Exporting the module */
module.exports = SearchManager;
