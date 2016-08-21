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
    this._search = new Search();

    /** Index Name */
    this._index = param.index;

    /** Component Type */
    this._componentType = param.type;

    this._builtFilter = null;

    //console.log("SearchManager " + this._index + " " + Enums.filterType.EXISTS);

  }//constructor

  /**
   * Insert the component, update will be done if id is provided and only for existing fields
   * @return {promise} The promise with the results.
   */
  insert(){

    let self = this;

    /* Init the search */
    self._search.init().then( (host) => {

      return self._search.indexExists(self._index);

    }, (error)=> {

      console.log(error);

    }).then((exist)=> {

      if (exist) {

        return Promise.all([self._search.deleteIndex(self._index), self._search.initIndex(self._index)]);

      } else {

        return self._search.initIndex(self._index);

      }

    }).then( (results) => {

      var promises = [];

      promises.push(self._search.insert('1', self._index, 'vertex'));

      promises.push(self._search.insert('2', self._index, 'edge'));

      return Promise.all(promises);

    }).then( (results) => {

      console.log("done with creation");

    });


  }

  /**
   * Update the component. id is required.
   * @return {promise} The promise with the results.
   */
  update(){

    let self = this;

    /* Init the search */
    self._search.init().then( (host) => {

      return self._search.indexExists(self._index);

    }, (error)=> {

      console.log(error);

    }).then( (exist) => {

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
  delete()
  {
    let self = this;

    /* Init the search */
    self._search.init().then( (host) => {

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

    }).then( (results)=> {

      console.log("done with deletion");

    }, (err)=> {

      console.log(err);

    });

  }//delete


  /**
   * Build filter from parameters received in external-api.js
   * @return desired built index.
   */
  buildFilter(filter){

    let self = this;

    let oFilter = self._search.filterFactory();

    for (var item in filter) {

      if (Object.prototype.hasOwnProperty.call(filter,item)){

        var filterRule = filter[item];

        switch (filterRule.type){

          /* Filter Type term */
          case Enums.filterType.TERM:

            console.log(Enums.filterType.TERM);
            /* filter - BodyBuilder */
            if(filterRule.ftr === 'AND')
              oFilter = oFilter.filter(filterRule.type, filterRule.prop, filterRule.val);
            else
              oFilter = oFilter.orFilter(filterRule.type, filterRule.prop, filterRule.val);

            break;

          /* Filter Type exists */
          case Enums.filterType.EXISTS:

            console.log(filterRule.type);
            /* filter - BodyBuilder */
            if(filterRule.ftr === 'AND')
              oFilter = oFilter.filter(filterRule.type, filterRule.prop);
            else
              oFilter = oFilter.orFilter(filterRule.type, filterRule.prop);

            break;

          /* Filter Type missing */
          case Enums.filterType.MISSING:

            console.log(filterRule.type);
            /* filter - BodyBuilder */
            if(filterRule.ftr === 'AND')
              oFilter = oFilter.filter(filterRule.type, filterRule.prop);
            else
              oFilter = oFilter.orFilter(filterRule.type, filterRule.prop);

            break;

          /* Filter Type prefix */
          case Enums.filterType.PREFIX:

            console.log(Enums.filterType.PREFIX);
            /* filter - BodyBuilder */
            if(filterRule.ftr === 'AND')
              oFilter = oFilter.filter(filterRule.type, filterRule.prop, filterRule.val);
            else
              oFilter = oFilter.orFilter(filterRule.type, filterRule.prop, filterRule.val);

            break;

          /* Filter Type regexp */
          case Enums.filterType.REGEXP:

            console.log(Enums.filterType.REGEXP);
            /* filter - BodyBuilder */
            if(filterRule.ftr === 'AND')
              oFilter = oFilter.filter(filterRule.type, filterRule.prop, filterRule.val);
            else
              oFilter = oFilter.orFilter(filterRule.type, filterRule.prop, filterRule.val);

            break;

          /* Filter Type wildcard */
          case Enums.filterType.WILDCARD:

            console.log(Enums.filterType.WILDCARD);
            /* filter - BodyBuilder */
            if(filterRule.ftr === 'AND')
              oFilter = oFilter.filter(filterRule.type, filterRule.prop, filterRule.val);
            else
              oFilter = oFilter.orFilter(filterRule.type, filterRule.prop, filterRule.val);

            break;

          /* Filter Type size */
          case Enums.filterType.SIZE:

            console.log(Enums.filterType.SIZE);
            /* filter - BodyBuilder */
            //oFilter = oFilter.limit(filterRule.val);

            break;

          /* Filter Type range */
          case Enums.filterType.RANGE:

            console.log(Enums.filterType.RANGE);
            /* filter - BodyBuilder */
            if(filterRule.ftr === 'AND')
              oFilter = oFilter.filter(filterRule.type, filterRule.prop, filterRule.op, filterRule.val);
            else
              oFilter = oFilter.orFilter(filterRule.type, filterRule.prop, filterRule.op, filterRule.val);

            break;

        }//switch

      }//if

    }//for

    self._builtFilter = oFilter.build();

  }//buildFilter


  /**
   * Fetch requested components to client.
   */
  fetch(){

    let self = this;

    let componentType = '';

    switch(self._componentType) {

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
