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
 * Strongly Connected Components class.
 * @module lib/compute/algorithms/strongly_connected_components
 * @see module:core/api/external-api
 */

//External Libraries
var request = require('superagent');

//Local Libraries
var Enums = require("./../enum/enums");
var config = require("./../config/config.json");
const Algorithm = require("./algorithm");

/** The Page Rank class */
class StronglyConnectedComponents extends Algorithm {

  /**
   * Create a StronglyConnectedComponents object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Invoke super constructor */
    super(param);

    /* The graph in which the algorithm will run. */
    this._property._graph = param.graph || Enums.connectedComponents.graph;
    /* The max number of iterations. */
    this._property._maxIterations = param.graph || Enums.connectedComponents.maxIterations;

  }

  /** Generates StronglyConnectedComponents Request
   * Compute the connected component membership of each vertex and return a graph with the vertex
   * value containing the lowest vertex id in the connected component containing that vertex.
   *
   * @param graph the graph for which to compute the connected components
   * @param maxIterations the maximum number of iterations to run for
   * @return a graph with vertex attributes containing the smallest vertex in each
   *         connected component
   */
  run(){//graph, maxIterations) {

    let self = this;

    let strRequest = self._createHTTPRequestString(Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS);

    request.post(strRequest)
      .set(Enums.jobServerRequest.contentType, Enums.jobServerRequest.contentTypeValue)
      .send({ input: {string: config.schema} })
      .end(function(err, res){
        if (err || !res.ok) {
          throw new Error(self._generateErrorMessage(Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS,
            Enums.errorMessages.jobServerRequest));
        }
        else{
          self._status = Enums.jobStatus.STARTED;
          self._requestedJobs.push(res.body.result.jobId);
          self._setupTimer(res.body.result.jobId, Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS);
        }//else
      });

    return strRequest;
  };//run

  /*<<<<<<<<<<<<<<<<<<<<<<<<<<<< GETTERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  get maxIterations() {
    return this._property._maxIterations;
  }

  /*************************** SETTERS ************************************/

  set maxIterations(value) {
    this._property._maxIterations = value;
  }

}

/* Exporting the module */
module.exports = StronglyConnectedComponents;
