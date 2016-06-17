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
 * Shortest Paths class.
 * @module lib/compute/algorithms/shortest_paths
 * @see module:core/api/external-api
 */

//External Libraries
var request = require('superagent');

//Local Libraries
var Enums = require("./../enum/enums");
var config = require("./../config/config.json");
const Algorithm = require("./algorithm");

/** TheShortestPaths class */
class ShortestPaths extends Algorithm {

  /**
   * Create a ShortestPaths object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Instance super constructor */
    super(param);

    /* The graph in which the algorithm will run. */
    this._property._graph = param.graph || config.schema;

  }

  /**
   * Computes shortest paths to the given set of landmark vertices, returning a graph where each
   * vertex attribute is a map containing the shortest-path distance to each reachable landmark.
   */
  run(){//graph) {

    let self = this;

    let strRequest = self._createHTTPRequestString(Enums.algorithmType.SHORTEST_PATHS);

    request.post(strRequest)
      .set(Enums.jobServerRequest.contentType, Enums.jobServerRequest.contentTypeValue)
      .send({ input: {string: config.schema} })
      .end(function(err, res){
        if (err || !res.ok) {
          throw new Error(self._generateErrorMessage(Enums.algorithmType.SHORTEST_PATHS,
            Enums.errorMessages.jobServerRequest));
        }
        else{
          self._status = Enums.jobStatus.STARTED;
          self._requestedJobs.push(res.body.result.jobId);
          self._setupTimer(res.body.result.jobId, Enums.algorithmType.SHORTEST_PATHS);
        }//else
      });

    return strRequest;
  };//run

}//ShortestPaths Class

/* Exporting the module */
module.exports = ShortestPaths;


