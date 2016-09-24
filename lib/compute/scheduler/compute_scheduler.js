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

  /* Reference to PageRank Algorithm */
  self._objPageRank = null;

  /* Reference to ConnectedComponents Algorithm */
  self._objConnectedComponents = null;

  /* Reference to StronglyConnectedComponents Algorithm */
  self._objStronglyConnectedComponents = null;

  /* Reference to TriangleCounting Algorithm */
  self._objTriangleCounting = null;

  /* Reference to ShortestPaths Algorithm */
  self._objShortestPaths = null;

  /* Current jobId */
  self._jobId = null;

  /* Job Requests */
  self._jobRequests = {};

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

  return new Promise((resolve, reject)=> {

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
        // let pagerankParameters = {
        //   graph: job.algorithm.graph,
        //   TOL:   job.algorithm.TOL,
        //   alpha: job.algorithm.resetProb
        // };
        let pagerankParameters = job.parameters;
            pagerankParameters.vertices = Enums.parameters.vertices;
            pagerankParameters.edges = Enums.parameters.edges;
            pagerankParameters.vertexId = Enums.parameters.vertexId;
            pagerankParameters.source = Enums.parameters.source;
            pagerankParameters.target = Enums.parameters.target;

        /* New Instance of PageRank Algorithm */
        self._objPageRank = new PageRank(pagerankParameters);

        /* Promise based Dynamic Version of PageRank */
        /* Request a job of type PageRank and receives a jobId */
        /* JobId will be used to keep track of the submitted jobs */
        /* Keeping status of jobs will help in Web UI */
        self._objPageRank.run(pagerankParameters).then(function (jobId) {

          /* Obtaining the PageRank JobId from the promise */
          self._jobId = jobId;

          /* Resolve promise using jobId received from Spark Job Server */
          resolve(jobId);

        });

        break;

      /* Get new Connected Components instance */
      case Enums.algorithmType.CONNECTED_COMPONENTS:

        /* Connected Components personalized parameters */
        let connectedComponentsParameters = {
          graph: job.algorithm.graph
        };

        /* New Instance of ConnectedComponents Algorithm */
        self._objConnectedComponents = new
          ConnectedComponents(connectedComponentsParameters);

        /* Promise based Dynamic Version of ConnectedComponents */
        /* Request a job of type ConnectedComponents and receives a jobId */
        /* JobId will be used to keep track of the submitted jobs */
        /* Keeping status of jobs will help in Web UI */
        self._objConnectedComponents.run().then(function(jobId){

          /* Obtaining the ConnectedComponents JobId from the promise */
          self._jobId = jobId;

          /* Keeping track of all requested jobs */
          self._trackJobId(
            self._jobId,
            Enums.algorithmType.CONNECTED_COMPONENTS,
            self._objConnectedComponents._status
          );

          /* Resolve promise using jobId received from Spark Job Server */
          resolve(jobId);

        });

        break;

      /* Get new Triangle Counting instance */
      case Enums.algorithmType.TRIANGLE_COUNTING:

        /* Triangle Counting personalized parameters */
        let triangleCountingParameters = {
          graph: job.algorithm.graph
        };

        /* New Instance of ConnectedComponents Algorithm */
        self._objTriangleCounting = new
                                    TriangleCounting(triangleCountingParameters);

        /* Promise based Dynamic Version of TriangleCounting */
        /* Request a job of type ConnectedComponents and receives a jobId */
        /* JobId will be used to keep track of the submitted jobs */
        /* Keeping status of jobs will help in Web UI */
        self._objTriangleCounting.run().then(function(jobId){

          /* Obtaining the ConnectedComponents JobId from the promise */
          self._jobId = jobId;

          /* Keeping track of all requested jobs */
          self._trackJobId(
            self._jobId,
            Enums.algorithmType.TRIANGLE_COUNTING,
            self._objTriangleCounting._status
          );

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

    //resolve(self._objDependencies._jobStatusRequest(jobId));
    resolve(self._objPageRank._jobStatusRequest(jobId));

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

    //resolve(self._objDependencies._ex_jobResultRequest(jobId));
    resolve(self._objPageRank._ex_jobResultRequest(jobId));

  }).catch( err => {

    /* Error in Promise */
    console.log("Error: " + err);

    /* Rejecting Promise with err */
    reject(err);

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

/* Exporting module */
module.exports = ComputeScheduler;

