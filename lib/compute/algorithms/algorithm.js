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
    this._algorithm = param.algorithm || Enums.algorithmType.PAGE_RANK;

    /* Algorithm's properties */
    this._property = {};

    this._sparkJobServer = param.defaultSparkJobServer ||
                           config.sparkJobServer.defaultSparkJobServer;
    this._sparkJobServerPort = param.defaultPort ||
                               config.sparkJobServer.defaultPort ;
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
  _validateAlgorithmType(algorithmType) {

    let response = true;

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
  _createHTTPRequestString(algorithmType) {

    let self = this;

    self._validateAlgorithmType(algorithmType);

    let strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=";

    switch(algorithmType) {
      case Enums.algorithmType.PAGE_RANK:
        strRequest += config.algorithmsPublishedJob + "&classPath=" +
                      config.pageRankClassPath;
        break;

      case Enums.algorithmType.CONNECTED_COMPONENTS:
        strRequest += config.algorithmsPublishedJob + "&classPath=" +
                      config.connectedComponentsClassPath;
        break;

      case Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS:
        strRequest += config.algorithmsPublishedJob + "&classPath=" +
                      config.stronglyConnectedComponentsClassPath;
        break;

      case Enums.algorithmType.TRIANGLE_COUNTING:
        strRequest += config.algorithmsPublishedJob + "&classPath=" +
                      config.triangleCountingClassPath;
        break;

      case Enums.algorithmType.SHORTEST_PATHS:
        strRequest += config.algorithmsPublishedJob + "&classPath=" +
                      config.shortestPathsClassPath;
        break;

      default://PageRank
        strRequest += config.algorithmsPublishedJob + "&classPath=" +
                      config.pageRankClassPath;
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
  _setupTimer(jobId, algorithmType) {
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
   * Monitoring Job Status Request
   *
   * @param jobId is the Spark Job Server generated JobId
   * @return The status of the Spark Job Server.
   */
  _jobStatusRequest(jobId) {
    let self = this;

    if (jobId == null){
      console.log(Enums.errorMessages.jobIDParameterNotIncluded);
    }

    var strRequest = self._createHTTPStatusRequestString(jobId);

    request
      .get(strRequest)
      .end(function(err, res){
        let data = res.body;

        console.log(data.status);

        if(data.status === Enums.jobStatus.FINISHED){
          self._status = Enums.jobStatus.FINISHED;
        }
        else if(data.status === Enums.jobStatus.RUNNING){
          self._status = Enums.jobStatus.RUNNING;
        }
        else if(data.status === Enums.jobStatus.ERROR){
          self._status = Enums.jobStatus.ERROR;
        }
        else {
          self._status = Enums.jobStatus.NONE;
        }

        //algorithmResult = data.result;
      });

      return self._status;
    };

  /**
   * Generating Standard Error Messages for Algorithms
   *
   * @param algorithmType is the type of algorithm that will be run on top of graph
   * @param errorMessage Error Message from Personalized Enumerations
   * @return the formatted error message for Algorithm Class.
   */
  _generateErrorMessage(algorithmType, errorMessage){

    let strErrorMessage =  "[" + algorithmType + "] -> " + errorMessage;
    return strErrorMessage;

  };

  /* Creates CORS request */
  _createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);

    } else {

      // Otherwise, CORS is not supported by the browser.
      xhr = null;

    }//else
    return xhr;
  };

}//Class algorithm

/* exporting the module */
module.exports = Algorithm;
