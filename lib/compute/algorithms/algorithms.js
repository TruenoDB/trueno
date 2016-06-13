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

//Local Libraries
var Enums = require("./../enum/enums");
var config = require("./../config/config.json");

var counter = 1;
var algorithmResult = {};

/** Algorithm super class */
class Algorithm {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The internal id of the algorithm */
    this._id = param.id || null;
    /* Algorithm fields */
    this._algorithm = param.algorithm || {};

    /* Algorithm's properties */
    this._property = {};

    this._sparkJobServer = param.defaultSparkJobServer || config.sparkJobServer.defaultSparkJobServer;
    this._sparkJobServerPort = param.defaultPort || config.sparkJobServer.defaultPort ;
  }

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

    /* validating the algorithm type */
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
  _validateAlgorithmType =  function(algorithmType) {

    var response = true;

    switch(algorithmType) {
      case Enums.algorithmType.PAGE_RANK:
        break;
      case Enums.algorithmType.CONNECTED_COMPONENTS:
        break;
      case Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS:
        break;
      case Enums.algorithmType.TRIANGLE_COUNTING:
        break;
      case Enums.algorithmType.SHORTEST_PATHS:
        break;

      default:
        response = false;
        throw new Error('Algorithm type not recognized');
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
  _createHTTPRequestString =  function(algorithmType) {

    let self = this;

    self._validateAlgorithmType(algorithmType);

    let strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=";

    if(algorithmType === Enums.algorithmType.PAGE_RANK){
      strRequest += config.algorithmsPublishedJob + "&classPath=" + config.pageRankClassPath;
    }

    if(algorithmType === Enums.algorithmType.CONNECTED_COMPONENTS){
      strRequest += config.algorithmsPublishedJob + "&classPath=" + config.connectedComponentsClassPath;
    }

    if(algorithmType === Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS){
      strRequest += config.algorithmsPublishedJob + "&classPath=" + config.stronglyConnectedComponentsClassPath;
    }

    if(algorithmType === Enums.algorithmType.TRIANGLE_COUNTING){
      strRequest += config.algorithmsPublishedJob + "&classPath=" + config.triangleCountingClassPath;
    }

    if(algorithmType === Enums.algorithmType.SHORTEST_PATHS){
      strRequest += config.algorithmsPublishedJob + "&classPath=" + config.shortestPathsClassPath;
    }

    return strRequest;
  };

  /**
   * Creating HTTP Status Request for Spark Job Server
   *
   * @param jobId is the Spark Job Server generated JobId
   * @return the url containing the correct call to the Spark Job Server.
   */
  _createHTTPStatusRequestString =  function(jobId) {

    let self = this;

    let strRequest = "http://" + self._sparkJobServer + ":" +
                      self._sparkJobServerPort + "/jobs/"+ jobId;

    return strRequest;
  };

  /**
   * Monitoring Job Status via timers
   *
   * @param jobId is the Spark Job Server generated JobId
   * @param algorithmType is the type of algorithm that will be run on top of graph
   * @return the url containing the correct call to the Spark Job Server.
   */
  _setupTimer = function(jobId, algorithmType) {
    let self = this;

    //if( typeof jobId !== 'undefined' )
    if (jobId == null){
      throw new Error(self._generateErrorMessage(algorithmType,
                Enums.errorMessages.jobIDParameterNotIncluded));
    }

    var interval = setInterval(function () {

      var strRequest = self._createHTTPStatusRequestString(jobId);

      //It worked when I change this to GET method request
      request
        .get(strRequest)
        .end(function(err, res){
          let data = res.body;

          if(data.status === Enums.jobStatus.FINISHED){
            self._status = Enums.jobStatus.FINISHED;
            clearInterval(interval);

            //Results table
            /*if(algorithmType === Enums.algorithmType.PAGE_RANK){

              var result = data.result;

            }*/
          }
          else if(data.status === Enums.jobStatus.RUNNING){
            self._status = Enums.jobStatus.RUNNING;
          }
          else if(data.status === Enums.jobStatus.ERROR){
            self._status = Enums.jobStatus.ERROR;
            counter = 0;
            clearInterval(interval);
          }

          algorithmResult = data.result;

        });

    }, 200);

  };

  /**
   * Generating Standard Error Messages for Algorithms
   *
   * @param algorithmType is the type of algorithm that will be run on top of graph
   * @param errorMessage Error Message from Personalized Enumerations
   * @return the formatted error message for Algorithm Class.
   */
  _generateErrorMessage = function(algorithmType, errorMessage){

    let strErrorMessage =  "[" + algorithmType + "] -> " + errorMessage;
    return strErrorMessage;

  };

}//Class algorithm

/* exporting the module */
module.exports = Algorithm;
