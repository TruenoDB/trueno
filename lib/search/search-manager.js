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

    console.log("SearchManager " + this._index);

  }

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
          promises.push(s.delete({id: id}, self._index, 'vertex'));
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

}

/* Exporting the module */
module.exports = SearchManager;
