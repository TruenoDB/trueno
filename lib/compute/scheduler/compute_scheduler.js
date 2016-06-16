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
 * @date_creation 2016.06.13.
 * @module lib/compute/scheduler/compute_scheduler.js
 * @description Spark Job Scheduler
 *
 */

//External Libraries

//Local Libraries
var Enums = require("../enum/enums");
var config = require("../config/config.json");
var Algorithm = require("../algorithms/algorithm");
var PageRank = require("../algorithms/pagerank");
var ConnectedComponents = require("../algorithms/connected_components");
var StronglyConnectedComponents = require("../algorithms/strongly_connected_components");
var TriangleCounting = require("../algorithms/triangle_counting");
var ShortestPaths = require("../algorithms/shortest_paths");

/**
 * @constructor
 *
 */
function ComputeScheduler(options) {

  let self = this;

  if(typeof options === "undefined"){
    throw new Error(Enums.errorMessages.optionsNotDefined);
  }

  self._sparkJobServer = options.defaultSparkJobServer || config.sparkJobServer.defaultSparkJobServer;
  self._sparkJobServerPort = options.defaultPort || config.sparkJobServer.defaultPort;
  self._requestedJobs = [];
  self._objPageRank = null;
  self._jobId = null;

}//ComputeScheduler Constructor

/**
 * Instantiating Compute Classes (for Spark Job Server)
 *
 * @param job this contains the type of algorithm and parameters associated to the algorithm
 * (job type)
 * @return the status of the job from the Spark Job Server.
 */
ComputeScheduler.prototype._compute = function(job) {

  let self = this;
  let jobId;

  switch(job.algorithmType) {
    case Enums.algorithmType.PAGE_RANK:
      /* Get new PageRank instance */
      console.log(Enums.algorithmType.PAGE_RANK);
      let pagerankParameters = {
                                graph:  job.algorithm.property.graph,
                                TOL:    job.algorithm.property.TOL,
                                alpha:  job.algorithm.property.resetProb
                               };


      self._objPageRank = new PageRank(pagerankParameters);
      jobId = self._objPageRank.run();
      break;

    case Enums.algorithmType.CONNECTED_COMPONENTS:
      /* Get new ConnectedComponents instance */
      let connectedComponentsParameters = {
        graph:  job.algorithm.property.graph,
        TOL:    job.algorithm.property.maxIterations
      };
      let objConnectedComponents = new
          ConnectedComponents(connectedComponentsParameters);
      objConnectedComponents.run();
      break;

    case Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS:
      /* Get new Strongly ConnectedComponents instance */
      let stronglyConnectedComponentsParameters = {
        graph:  job.algorithm.property.graph,
        TOL:    job.algorithm.property.maxIterations
      };
      let objStronglyConnectedComponents = new
          StronglyConnectedComponents(stronglyConnectedComponentsParameters);
      objStronglyConnectedComponents.run();
      break;

    case Enums.algorithmType.TRIANGLE_COUNTING:
      /* Get new Triangle Counting instance */
      let triangleCountingParameters = {
        graph:   job.algorithm.property.graph
      };
      let objTriangleCounting = new
          TriangleCounting(triangleCountingParameters);
      objTriangleCounting.run();
      break;

    case Enums.algorithmType.SHORTEST_PATHS:
      /* Get new Shortest Paths instance */
      let shortestPathsParameters = {
        graph:   job.algorithm.property.graph
      };
      let objShortestPaths = new
          ShortestPaths(shortestPathsParameters);
      objShortestPaths.run();
      break;

    default:
      throw new Error(Enums.errorMessages.computeSchedulerAlgorithmNotRecognized);
  }//switch

};

/**
 * Instantiating Compute Classes (for Spark Job Server) // Using Promises
 *
 * @param job this contains the type of algorithm and parameters associated to the algorithm
 * (job type)
 * @return the status of the job from the Spark Job Server.
 */
ComputeScheduler.prototype._compute_promise = function(job) {

  let self = this;

  switch(job.algorithmType) {
    case Enums.algorithmType.PAGE_RANK:

      /* Get new PageRank instance */
      console.log(Enums.algorithmType.PAGE_RANK);
      let pagerankParameters = {
        graph:  job.algorithm.property.graph,
        TOL:    job.algorithm.property.TOL,
        alpha:  job.algorithm.property.resetProb
      };

      self._objPageRank = new PageRank(pagerankParameters);

      self._objPageRank.run_promise().then(()=>{
        /* Obtaining the PageRank JobId from the promise */
        console.log("Request Sent -> JobId [" + self._objPageRank._id + "]");
        self._jobId = self._objPageRank._id;

      },(err)=>{
        /* Error in Promise */
        console.log("Error: " + err);
      });
      break;

    default:
      throw new Error(Enums.errorMessages.computeSchedulerAlgorithmNotRecognized);
  }//switch

};

/**
 * Instantiating Compute Classes (for Spark Job Server)
 *
 * @param jobId this contains the JobID obtained from compute() call
 * @return the status of the job from the Spark Job Server.
 */
ComputeScheduler.prototype._jobStatus = function(jobId) {

  return this._objPageRank._jobStatusRequest(jobId);
};

/* Return the current _jobId */
ComputeScheduler.prototype._getJobId = function() {
  return this._jobId;
};

/* Exporting module */
module.exports = ComputeScheduler;

