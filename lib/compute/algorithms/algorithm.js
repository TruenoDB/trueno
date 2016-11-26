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

/**
 * @author Servio Palacios
 * Graph Algorithm super class.
 * @module lib/compute/Algorithm
 *
 */

//External Libraries
var request = require('superagent');
var spark_job_request = require('superagent');
const Promise = require("bluebird");

//Local Libraries
var Enums = require("./../enum/enums");
var config = require("./../config/config.json");

/** Algorithm super class */
class Algorithm {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    let self = this;

    /* The internal id of the algorithm */
    self._id = param.id || null;

    /* Algorithm fields */
    self._algorithm = param.algorithm || Enums.algorithmType.PAGE_RANK;

    /* Algorithm's properties */
    self._property = {};

    /* Spark Job Server Address */
    self._sparkJobServer = param.defaultSparkJobServer ||
                           config.sparkJobServer.defaultSparkJobServer;

    /* Spark Job Server Port */
    self._sparkJobServerPort = param.defaultPort ||
                               config.sparkJobServer.defaultPort ;

    /* The type of algorithm */
    self._property._algorithmType = Enums.algorithmType.PAGE_RANK;

  }//Constructor

  /*<<<<<<<<<<<<<<<<<<<<<<<<<<<< GETTERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  get id() {
    return this._id;
  }

  get status() {
    return this._status;
  }

  /******************************** SETTERS ***********************************/

  set id(value) {
    this._id = value;
  }

  set status(value) {
    this._status = value;
  }

  /*+++++++++++++++++++++++++++++++ Algorithms +++++++++++++++++++++++++++++++*/

  setAlgorithm(algorithmType) {

    /* Validating the algorithm type */
    this._validateAlgorithmType(algorithmType);

    this._algorithm = algorithmType;

  }

  getAlgorithm() {

    return this._algorithm;

  }

  removeAlgorithm() {

    this._algorithm = Enums.algorithmType.NONE;

  }

  /*|||||||||||||||||||||||||||||||||| VALIDATION ||||||||||||||||||||||||||||||*/

  /**
   * Validating Algorithm Type
   *
   * @param algorithmType is the type of algorithm that will be run on top of graph
   * @return boolean flag establishing success of the call.
   */
  _validateAlgorithmType(algorithmType) {

    let response = true;

    switch(algorithmType) {

      /* Dependencies Algorithm with Scala Source Dependencies.scala */
      case Enums.algorithmType.DEPENDENCIES:
        break;

      /* PageRank Algorithm with Scala Source PR.scala */
      case Enums.algorithmType.PAGE_RANK:
        break;

      /* Connected Components Algorithm with ... */
      /* Scala Source ConnectedComponents.scala */
      case Enums.algorithmType.CONNECTED_COMPONENTS:
        break;

      /* Strongly Connected Components Algorithm with ... */
      /* Scala Source StronglyConnectedComponents.scala */
      case Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS:
        break;

      /* Triangle Counting Algorithm with ... */
      /* Scala Source TriangleCounting.scala */
      case Enums.algorithmType.TRIANGLE_COUNTING:
        break;

      /* Shortest Paths Algorithm with ... */
      /* Scala Source ShortestPaths.scala */
      case Enums.algorithmType.SHORTEST_PATHS:
        break;

      /* Algorithm not recognized */
      default:
        response = false;
        throw new Error(Enums.errorMessages.computeSchedulerAlgorithmNotRecognized);

    }//switch

    return response;

  };

  /*################################ TOOLS ######################################*/

  /**
   * Creating HTTP Request for Spark Job Server
   *
   * @param algorithmType is the type of algorithm that will be run on top of graph
   * @return the url containing the correct call to the Spark Job Server.
   */
  _createHTTPRequestString(algorithmType) {

    let self = this;

    /* Validating received parameter */
    self._validateAlgorithmType(algorithmType);

    /* Building Required Spark Job Server Request Format */
    let strRequest = Enums.jobServerRequest.requestType +
                     self._sparkJobServer               + ":" +
                     self._sparkJobServerPort           +
                     Enums.jobServerRequest.jobsAppName;

    /* Determining the Algorithm Type to be used */
    switch(algorithmType) {

      /* PageRank Algorithm with Scala Source PR.scala */
      case Enums.algorithmType.DEPENDENCIES:
        strRequest += config.algorithmsPublishedJob +
                      Enums.jobServerRequest.classPath +
                      config.DependenciesClassPath;
        break;

      /* PageRank Algorithm with Scala Source PR.scala */
      case Enums.algorithmType.PAGE_RANK:
        strRequest += config.algorithmsPublishedJob +
                      Enums.jobServerRequest.classPath +
                      config.pageRankClassPath;
        break;

      /* Connected Components Algorithm with ... */
      /* Scala Source ConnectedComponents.scala */
      case Enums.algorithmType.CONNECTED_COMPONENTS:
        strRequest += config.algorithmsPublishedJob +
                      Enums.jobServerRequest.classPath +
                      config.connectedComponentsClassPath;
        break;

      /* Strongly Connected Components Algorithm with ... */
      /* Scala Source StronglyConnectedComponents.scala */
      case Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS:
        strRequest += config.algorithmsPublishedJob +
                      Enums.jobServerRequest.classPath +
                      config.stronglyConnectedComponentsClassPath;
        break;

      /* Triangle Counting Algorithm with ... */
      /* Scala Source TriangleCounting.scala */
      case Enums.algorithmType.TRIANGLE_COUNTING:
        strRequest += config.algorithmsPublishedJob +
                      Enums.jobServerRequest.classPath +
                      config.triangleCountingClassPath;
        break;

      /* Shortest Paths Algorithm with ... */
      /* Scala Source ShortestPaths.scala */
      case Enums.algorithmType.SHORTEST_PATHS:
        strRequest += config.algorithmsPublishedJob +
                      Enums.jobServerRequest.classPath +
                      config.shortestPathsClassPath;
        break;

      /* Default Algorithm is PageRank (PR.scala)) */
      default:
        strRequest += config.algorithmsPublishedJob +
                      Enums.jobServerRequest.classPath +
                      config.DependenciesClassPath;
    }//switch

    return strRequest;
  };

  /**
   * Creating HTTP Status Request for Spark Job Server
   *
   * @param jobId is the Spark Job Server generated JobId
   * @return the url containing the correct call to the Spark Job Server.
   */
  _createHTTPStatusRequestString(jobId) {

    let self = this;

    /* Uses the Spark Job Server address and port to build ... */
    /* final HTTP request string to be used on the Spark Job Server */
    let strRequest =  Enums.jobServerRequest.requestType  +
                      self._sparkJobServer                + ":" +
                      self._sparkJobServerPort            +
                      Enums.jobServerRequest.jobsURL      +
                      jobId;

    return strRequest;
  };

  /**
   * Monitoring Job Status Request
   *
   * @param jobId is the Spark Job Server generated JobId
   * @return The status of the Spark Job Server.
   */
  _jobStatusRequest(jobId) {

    /* This instance object reference */
    let self = this;

    /* Validates jobId */
    if (jobId == null) {
      console.log(Enums.errorMessages.jobIDParameterNotIncluded);
    }

    /* Creates HTTP String Request to be used */
    var strRequest = self._createHTTPStatusRequestString(jobId);

    /* The actual request using the HTTP Request String */
    request
      .get(strRequest)
      .end(function(err, res){

        let data = res.body;

        switch(data.status) {

          /* Job has finished, look for result */
          case Enums.jobStatus.FINISHED:
            self._status = Enums.jobStatus.FINISHED;
            break;

          /* Job is still running */
          case Enums.jobStatus.RUNNING:
            self._status = Enums.jobStatus.RUNNING;
            break;

          /* Job has failed, verify request or Job Server Status */
          case Enums.jobStatus.ERROR:
            self._status = Enums.jobStatus.ERROR;
            break;

          default:
            self._status = Enums.jobStatus.NONE;

        }//switch

      });

      return self._status;

    };

  /**
   * Obtaining Result from Job Status Request
   *
   * @param jobId is the Spark Job Server generated JobId
   * @return The result of the Spark Job Server.
   */
  _ex_jobResultRequest(jobId, algorithmType) {

    /* This instance object reference */
    let self = this;
    /* Result from Spark-JobServer */
    self._result = {};

    /* Validates jobId */
    if (jobId == null) {
      console.log(Enums.errorMessages.jobIDParameterNotIncluded);
    }

    /* Creates HTTP String Request to be used */
    var strRequest = self._createHTTPStatusRequestString(jobId);

    /* Promisification */
    Promise.promisifyAll(spark_job_request);

    /* Create new Promise with the spark job request */
    return new Promise( function(resolve, reject) {

      /* The actual request using the HTTP Request String */
      request
        .get(strRequest)
        .end(function(err, res){

          let data = res.body;

          switch(data.status) {

            /* Job has finished, look for result */
            case Enums.jobStatus.FINISHED:
              self._status = Enums.jobStatus.FINISHED;
              self._result = data;

              /* Select Top 10 Ranks */
              if(algorithmType == Enums.algorithmType.PAGE_RANK){
                var ranks = data.result;
                ranks.sort(function(a, b){return b[1]-a[1]});
                ranks.slice(1,10);
                self._result.result = ranks.slice(1,10);
              }

              /* Resolving with result */
              resolve(self._result);
              break;

            /* Job is still running */
            case Enums.jobStatus.RUNNING:
              self._status = Enums.jobStatus.RUNNING;
              throw new Error(Enums.errorMessages.jobStatusMustBeFinished);
              break;

            /* Job has failed, verify request or Job Server Status */
            case Enums.jobStatus.ERROR:
              self._status = Enums.jobStatus.ERROR;
              throw new Error(Enums.errorMessages.jobStatusMustBeFinished);
              break;

            default:
              self._status = Enums.jobStatus.NONE;
              throw new Error(Enums.errorMessages.jobStatusMustBeFinished);

          }//switch

        });

    });//Promise

  };

  /**
   * Generating Standard Error Messages for Algorithms
   *
   * @param algorithmType is the type of algorithm that will be run on the graph
   * @param errorMessage Error Message from Personalized Enumerations
   * @return the formatted error message for Algorithm Class.
   */
  _generateErrorMessage(algorithmType, errorMessage){
    let strErrorMessage =  "[" + algorithmType + "] -> " + errorMessage;
    return strErrorMessage;
  };

  /**
   * Run a dynamic version of PageRank returning a graph with vertex attributes containing the
   * PageRank and edge attributes containing the normalized edge weight.
   *
   * @return the graph containing with each vertex containing the PageRank and each edge
   *         containing the normalized weight.
   */
  run(parameters){
    /* This instance object reference */
    let self = this;
    /* Generating HTTP Request String using Algorithm Type */
    let strRequest = self._createHTTPRequestString(self._algorithm);

    return self._sparkJobRequest(strRequest,parameters);
  };//run

  /**
   * Run the actual dynamic version of PageRank request on the Job Server
   * @param strRequest HTTP Request String for Job Server
   *
   * @return the graph containing with each vertex containing the PageRank and each edge
   *         containing the normalized weight.
   */
  _sparkJobRequest(strRequest,parameters) {

    let self = this;

    /* Promisification */
    Promise.promisifyAll(spark_job_request);

    /* Create new Promise with the spark job request */
    return new Promise( function(resolve, reject) {

      /* Generating Job Server Request */
      spark_job_request.post(strRequest)
        .set(Enums.jobServerRequest.contentType, Enums.jobServerRequest.contentTypeValue)
        .send(parameters)
        .end(function(err, res){

          if (err || !res.ok) {
            console.log("[verify]: Trueno Compute Server (port 8090) and algorithms.");
          }
          else {
            /* Set status to STARTED in the beginning */
            self._status = Enums.jobStatus.STARTED;
            /* Obtain the Current Job Server Returned JobId */
            self._id = res.body.result.jobId;
            /* Resolving with jobId */
            resolve(self._id);
          }//else

        });
    });//Promise

  };//_sparkJobRequest

}//Class algorithm

/* exporting the module */
module.exports = Algorithm;
