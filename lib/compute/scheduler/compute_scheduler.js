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
const Promise = require("bluebird");

//Local Libraries
var Enums = require("../enum/enums");
var config = require("../config/config.json");
var Dependencies = require("../algorithms/dependencies");
var PageRank = require("../algorithms/pagerank");
var ConnectedComponents = require("../algorithms/connected_components");
var StronglyConnectedComponents = require("../algorithms/strongly_connected_components");
var TriangleCounting = require("../algorithms/triangle_counting");
var ShortestPaths = require("../algorithms/shortest_paths");
var Algorithm = require("../algorithms/algorithm");
var GraphAlgorithms = require("../algorithms/graph-algorithms");

/**
 * @constructor
 *
 */
function ComputeScheduler(options) {

  let self = this;

  if (options === null) {
    throw new Error(Enums.errorMessages.optionsNotDefined);
  }

  /* Spark Job Server Address */
  self._sparkJobServer =  options.defaultSparkJobServer ||
                          config.sparkJobServer.defaultSparkJobServer;

  /* Spark Job Server Port */
  self._sparkJobServerPort =  options.defaultPort ||
                              config.sparkJobServer.defaultPort;
  /* Set of Requested jobs */
  self._requestedJobs = [];

  /* Reference to Dependencies Algorithm */
  self._objDependencies = null;

  /* Current jobId */
  self._jobId = null;

  /* Job Requests */
  self._jobRequests = {};

  /* Algorithms object */
  self._objAlgorithms = null;
  self._objAlgorithms = new Algorithm(options);

}//ComputeScheduler Constructor

/**
 * Instantiating Compute Classes (for Spark Job Server)
 *
 * @param job this contains the type of algorithm and parameters associated to the algorithm
 * (job type)
 * @return the status of the job from the Spark Job Server.
 */
ComputeScheduler.prototype._ex_compute = function(job) {

  let self = this;

  let objJobParameters = job.parameters;
  objJobParameters.vertices    = Enums.parameters.vertices;
  objJobParameters.edges       = Enums.parameters.edges;
  objJobParameters.vertexId    = Enums.parameters.vertexId;
  objJobParameters.source      = Enums.parameters.source;
  objJobParameters.target      = Enums.parameters.target;
  objJobParameters.comp        = Enums.parameters.compute;

  return new Promise((resolve, reject)=> {

    //console.log(job.algorithmType);

    switch (job.algorithmType) {

      case Enums.algorithmType.DEPENDENCIES:

        /* New Instance of Dependencies Test Algorithm */
        self._objDependencies = new Dependencies();

        self._objDependencies.run(job.parameters).then(function (jobId) {
          /* Resolve promise using jobId received from Spark Job Server */
          resolve(jobId);
        });

        break;

      /* Get new PageRank instance */
      case Enums.algorithmType.PAGE_RANK:
        /* PageRank personalized parameters */

        //pagerankParameters.persisted = Enums.parameters.persisted;

        /* Instance of PageRank Algorithm */
        self._objAlgorithms.setAlgorithm(job.algorithmType);

        /* Promise based Dynamic Version of PageRank */
        /* Request a job of type PageRank and receives a jobId */
        /* JobId will be used to keep track of the submitted jobs */
        /* Keeping status of jobs will help in Web UI */
        self._objAlgorithms.run(objJobParameters).then(function (jobId) {

          /* Obtaining the PageRank JobId from the promise */
          self._jobId = jobId;

          self._jobRequests[jobId] = {};
          self._jobRequests[jobId].algorithmType = Enums.algorithmType.PAGE_RANK;

          /* Resolve promise using jobId received from Spark Job Server */
          resolve(jobId);

        });

        break;

      /* Get new Connected Components instance */
      case Enums.algorithmType.CONNECTED_COMPONENTS:
        /* Instance of CC Algorithm */
        self._objAlgorithms.setAlgorithm(job.algorithmType);

        /* Promise based Dynamic Version of ConnectedComponents */
        /* Request a job of type ConnectedComponents and receives a jobId */
        self._objAlgorithms.run(objJobParameters).then(function (jobId) {

          /* Obtaining the ConnectedComponents JobId from the promise */
          self._jobId = jobId;

          self._jobRequests[jobId] = {};
          self._jobRequests[jobId].algorithmType = Enums.algorithmType.CONNECTED_COMPONENTS;

          /* Resolve promise using jobId received from Spark Job Server */
          resolve(jobId);

        });

        break;

      /* Get new Triangle Counting instance */
      case Enums.algorithmType.TRIANGLE_COUNTING:

        /* Instance of TriangleCounting Algorithm */
        self._objAlgorithms.setAlgorithm(job.algorithmType);

        /* Promise based Dynamic Version of ConnectedComponents */
        /* Request a job of type ConnectedComponents and receives a jobId */
        self._objAlgorithms.run(objJobParameters).then(function (jobId) {

          /* Obtaining the ConnectedComponents JobId from the promise */
          self._jobId = jobId;

          self._jobRequests[jobId] = {};
          self._jobRequests[jobId].algorithmType = Enums.algorithmType.TRIANGLE_COUNTING;

          /* Resolve promise using jobId received from Spark Job Server */
          resolve(jobId);

        });

        break;

      /* Algorithm not recognized */
      default:
        throw new Error(Enums.errorMessages.computeSchedulerAlgorithmNotRecognized);

    }//switch

  });

};//_ex_compute

/**
 * Instantiating Compute Classes (for Spark Job Server)
 *
 * @param jobId this contains the JobID obtained from compute() call
 * @return the status of the job from the Spark Job Server.
 */
ComputeScheduler.prototype._jobStatus = function(jobId) {

  let self = this;

  self._jobRequests[jobId].status = self._objPageRank._jobStatusRequest(jobId);

  return self._jobRequests[jobId].status;

};//_jobStatus

/**
 * Exposed method to obtain the status of already submitted Job
 *
 * @param jobId this contains the JobID obtained from compute() call
 * @return the status of the job from the Spark Job Server.
 */
ComputeScheduler.prototype._ex_computeJobStatus = function(jobId) {

  let self = this;

  /* Create new Promise with the spark job request (status) */
  return new Promise( function(resolve, reject) {

    resolve(self._objAlgorithms._jobStatusRequest(jobId));

  });

};//_ex_computeJobStatus

/**
 * Exposed method to obtain the status of already submitted Job
 *
 * @param jobId this contains the JobID obtained from compute() call
 * @return the result of the job from the Spark Job Server when is FINISHED.
 */
ComputeScheduler.prototype._ex_computeJobResult = function(jobId) {

  let self = this;

  /* Create new Promise with the spark job request (status) */
  return new Promise( function(resolve, reject) {

    resolve(self._objAlgorithms._ex_jobResultRequest(jobId,self._jobRequests[jobId].algorithmType));

  });

};//_ex_computeJobStatus

/**
 * Establish the current jobId (taken from the Spark Job Server)
 *
 * @return Return the current _jobId.
 */
ComputeScheduler.prototype._getJobId = function() {

  return this._jobId;

};//_getJobId

/**
* Keep Track of Jobs
* @param jobId this contains the JobID obtained from compute() call
* @param algorithmType type of algorithm
* @param status of the job
*/
ComputeScheduler.prototype._trackJobId = function(jobId, algorithmType, status) {

  let self = this;

  /* Keeping track of all requested jobs */
  self._jobRequests[self._jobId] = {};
  self._jobRequests[self._jobId].status = status;
  self._jobRequests[self._jobId].algorithmType  = algorithmType;

};//_trackJobId


ComputeScheduler.prototype._ex_getComputeAlgorithms = function() {

  return new Promise((resolve, reject)=> {
    resolve(GraphAlgorithms)
  });

};//_ex_getComputeAlgorithms

/* Exporting module */
module.exports = ComputeScheduler;

