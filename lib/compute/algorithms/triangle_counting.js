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
 * Triangle Counting class.
 * @module lib/compute/algorithms/triangle_counting
 * @see module:core/api/external-api
 */

//External Libraries
var request = require('superagent');

//Local Libraries
var Enums = require("./../enum/enums");
var config = require("./../config/config.json");
const Algorithm = require("./algorithm");

/** The Page Rank class */
class TriangleCounting extends Algorithm {
  /**
   * Create a TriangleCounting object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* Invoke super constructor */
    super(param);

    /* The graph in which the algorithm will run. */
    this._property._graph = param.graph || config.schema;

    /* Preventing new properties from being added to it
     and marking all existing properties as non-configurable */
    Object.seal(this);
  }

  /**
   * Compute the number of triangles passing through each vertex.
   * @from TriangleCount.scala
   *
   * The algorithm is relatively straightforward and can be computed in three steps:
   *
   * <ul>
   * <li> Compute the set of neighbors for each vertex</li>
   * <li> For each edge compute the intersection of the sets and send the count to both vertices.</li>
   * <li> Compute the sum at each vertex and divide by two since each triangle is counted twice.</li>
   * </ul>
   *
   * There are two implementations.  The default `TriangleCount.run` implementation first removes
   * self cycles and canonicalizes the graph to ensure that the following conditions hold:
   * <ul>
   * <li> There are no self edges</li>
   * <li> All edges are oriented src > dst</li>
   * <li> There are no duplicate edges</li>
   * </ul>
   * However, the canonicalization procedure is costly as it requires repartitioning the graph.
   * If the input data is already in "canonical form" with self cycles removed then the
   * `TriangleCount.runPreCanonicalized` should be used instead.
   *
   * {{{
 * val canonicalGraph = graph.mapEdges(e => 1).removeSelfEdges().canonicalizeEdges()
 * val counts = TriangleCount.runPreCanonicalized(canonicalGraph).vertices
 * }}}
   *
   */
  run(){//graph) {

    let self = this;

    //counter = 1;

    let strRequest = self._createHTTPRequestString(Enums.algorithmType.TRIANGLE_COUNTING);

    request.post(strRequest)
      .set(Enums.jobServerRequest.contentType, Enums.jobServerRequest.contentTypeValue)
      .send({ input: {string: config.schema} })
      .end(function(err, res){
        if (err || !res.ok) {
          throw new Error(self._generateErrorMessage(Enums.algorithmType.TRIANGLE_COUNTING,
            Enums.errorMessages.jobServerRequest));
        }
        else{
          self._status = Enums.jobStatus.STARTED;
          self._requestedJobs.push(res.body.result.jobId);
          self._setupTimer(res.body.result.jobId, Enums.algorithmType.TRIANGLE_COUNTING);
        }//else
      });

    return strRequest;
  };//run

  /*<<<<<<<<<<<<<<<<<<<<<<<<<<<< GETTERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /*get maxIterations() {
    return this._property._maxIterations;
  }*/

  /*************************** SETTERS ************************************/

  /*set maxIterations(value) {
    this._property._maxIterations = value;
  }*/

}

/* Exporting the module */
module.exports = TriangleCounting;

