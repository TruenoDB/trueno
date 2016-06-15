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
 * @author Servio Palacios
 * PageRank class.
 * @module lib/compute/algorithms/pagerank
 * @see module:core/api/external-api
 */

//External Libraries
var request = require('superagent');

//Local Libraries
var Enums = require("./../enum/enums");
var config = require("./../config/config.json");
const Algorithm = require("./algorithm");

/** The Page Rank class */
class PageRank extends Algorithm {
  /**
   * Create a PageRank object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Invoke super constructor */
    super(param);

    /* The graph in which the algorithm will run. */
    this._property._graph = param.graph || Enums.pageRank.graph;
    /* The tolerance allowed at convergence (smaller => more accurate). */
    this._property._TOL = param.TOL || Enums.pageRank.TOL;
    /* The random reset probability (alpha) (typically 0.15) */
    this._property._resetProbability = param.alpha || Enums.pageRank.resetProb;

    request._status = "";

    /* Preventing new properties from being added to it
    and marking all existing properties as non-configurable */
    Object.seal(this);
  }

  /**
   * Run a dynamic version of PageRank returning a graph with vertex attributes containing the
   * PageRank and edge attributes containing the normalized edge weight.
   *
   * @param graph the graph on which to compute PageRank
   * @param tol the tolerance allowed at convergence (smaller => more accurate).
   * @param resetProb the random reset probability (alpha)
   *
   * @return the graph containing with each vertex containing the PageRank and each edge
   *         containing the normalized weight.
   */
  run(){ //*graph, tol, resetProb) {

    let self = this;

    let strRequest = self._createHTTPRequestString(Enums.algorithmType.PAGE_RANK);
    let jobId = "";

    console.log(strRequest);

    /*request.post(strRequest)
      .set(Enums.jobServerRequest.contentType, Enums.jobServerRequest.contentTypeValue)
      .send({ input: {string: config.schema} })*/
    request.post(strRequest)
      .set("Content-Type", "application/json")
      .send({ input: {string: 'gnutella'} }) //config.schema
      .end(function(err, res){
        if (err || !res.ok) {
          console.log("Error: " + err);

          //throw new Error(self._generateErrorMessage(Enums.algorithmType.PAGE_RANK,
          //                Enums.errorMessages.jobServerRequest));
        }
        else{
          self._status = Enums.jobStatus.STARTED;
          jobId = res.body.result.jobId;
          self._requestedJobs.push(res.body.result.jobId);
          self._setupTimer(res.body.result.jobId, Enums.algorithmType.PAGE_RANK);
        }//else
      });

    return jobId;
  };//run

  /*<<<<<<<<<<<<<<<<<<<<<<<<<<<< GETTERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  get TOL() {
    return this._property._TOL;
  }

  get resetProbability() {
    return this._property._resetProbability;
  }

  get alpha() {
    return this._property._resetProbability;
  }

  /*************************** SETTERS ************************************/

  set TOL(value) {
    this._property._TOL = value;
  }

  set resetProbability(value) {
    this._property._resetProbability = value;
  }

  set alpha(value) {
    this._property._resetProbability = value;
  }

}

/* Exporting the module */
module.exports = PageRank;

