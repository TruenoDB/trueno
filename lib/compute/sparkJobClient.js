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
 * @date_creation 2016.05.26.
 * @module sparkJobClient.js
 * @description Spark Job Connector using REST API
 *
 */

//External Libraries
var request = require('superagent');

//Local Libraries
var Enums = require("./enums");
var config = require("../config.json");
var counter = 1;
var algorithmResult = {};

/**
 * @constructor
 *
 */
function SparkJobClient(options) {

    var self = this;

    if(typeof options === "undefined"){
        throw new Error("[options] parameter not defined.");
    }

    self._sparkJobServer = options.defaultSparkJobServer;
    self._sparkJobServerPort = options.defaultPort;
    self._requestedJobs = [];

    //self._threshold = config.security.threshold;

}//SparkJobClient Constructor

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
SparkJobClient.prototype.pageRankRequest = function(graph, tol, resetProb) {

    var self = this;
    counter = 1;

    var strRequest = self._createHTTPRequestString(Enums.algorithmType.PAGE_RANK);

    request.post(strRequest)
        .set('Content-Type', 'application/json')
        .send({ input: {string: config.schema} })
        .end(function(err, res){
                if (err || !res.ok) {
                    console.log(Enums.jobStatus.ERROR);
                }
                else {
                    self._requestedJobs.push(res.body.result.jobId);
                    $('#tbl_jobs > tbody:last-child').append('<tr><td>' + res.body.result.jobId + '</td><td>Page Rank</td><td>Started</td></tr>');
                    self.setupTimer(res.body.result.jobId, Enums.algorithmType.PAGE_RANK);
                }
        });

    return strRequest;
};


/** Generates ConnectedComponents Request
 * Compute the connected component membership of each vertex and return a graph with the vertex
 * value containing the lowest vertex id in the connected component containing that vertex.
 *
 * @param graph the graph for which to compute the connected components
 * @param maxIterations the maximum number of iterations to run for
 * @return a graph with vertex attributes containing the smallest vertex in each
 *         connected component
 */
SparkJobClient.prototype.connectedComponents = function(graph, maxIterations) {

    var self = this;
    counter = 1;

    var strRequest = self._createHTTPRequestString(Enums.algorithmType.CONNECTED_COMPONENTS);

    request.post(strRequest)
        .set('Content-Type', 'application/json')
        .send({ input: {string: config.schema} })
        .end(function(err, res){
            if (err || !res.ok) {
                console.log(Enums.jobStatus.ERROR);
            }
            else {
                self._requestedJobs.push(res.body.result.jobId);
                $('#tbl_jobs > tbody:last-child').append('<tr><td>' + res.body.result.jobId + '</td><td>Connected Components</td><td>Started</td></tr>');
                self.setupTimer(res.body.result.jobId, Enums.algorithmType.CONNECTED_COMPONENTS);
            }
        });

    return strRequest;
};

/**
 * Compute the strongly connected component (SCC) of each vertex and return a graph with the
 * vertex value containing the lowest vertex id in the SCC containing that vertex.
 *
 * @param graph the graph for which to compute the SCC
 *
 * @return a graph with vertex attributes containing the smallest vertex id in each SCC
 */
SparkJobClient.prototype.stronglyConnectedComponents = function(graph) {

    var self = this;
    counter = 1;

    var strRequest = self._createHTTPRequestString(Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS);

    request.post(strRequest)
        .set('Content-Type', 'application/json')
        .send({ input: {string: config.schema} })
        .end(function(err, res){
            if (err || !res.ok) {
                console.log(Enums.jobStatus.ERROR);
            }
            else {
                self._requestedJobs.push(res.body.result.jobId);
                $('#tbl_jobs > tbody:last-child').append('<tr><td>' + res.body.result.jobId + '</td><td>Strongly Connected Components</td><td>Started</td></tr>');
                self.setupTimer(res.body.result.jobId, Enums.algorithmType.STRONGLY_CONNECTED_COMPONENTS);
            }
        });

    return strRequest;
};

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
SparkJobClient.prototype.triangleCounting = function() {

    var self = this;
    counter = 1;

    var args = {
        data: { input: {string: config.schema} },
        headers: { "Content-Type": "application/json" }
    };

    /*var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=algorithms&classPath=spark.jobserver.TriangleCounting";
    client.post(strRequest, args, function (data, response) {
        console.log(data);
        console.log(data.result);
        self._requestedJobs.push(data.result.jobId);

        $('#tbl_jobs > tbody:last-child').append('<tr><td>' + data.result.jobId + '</td><td>Triangle Counting</td><td>Started</td></tr>');
        self.setupTimer(data.result.jobId, Enums.algorithmType.TRIANGLE_COUNTING);
    });

    return strRequest;*/
};

/* Generates Word Count Request */
SparkJobClient.prototype.wordCountRequest = function() {

    var self = this;
    counter = 1;

    /*var args = {
        data: { input: {string: "scala_api"} },
        headers: { "Content-Type": "application/json" }
    };

    var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=algorithms&classPath=spark.jobserver.WordCountExample";
    client.post(strRequest, args, function (data, response) {
        //console.log(data);
        //console.log(data.result);
        self._requestedJobs.push(data.result.jobId);

        $('#tbl_jobs > tbody:last-child').append('<tr><td>' + data.result.jobId + '</td><td>Word Count</td><td>Started</td></tr>');
        self.setupTimer(data.result.jobId, Enums.algorithmType.WORD_COUNT);

    });

    return strRequest;*/
};

/**
 * Computes shortest paths to the given set of landmark vertices, returning a graph where each
 * vertex attribute is a map containing the shortest-path distance to each reachable landmark.
 */

SparkJobClient.prototype.shortestPaths = function(graph, ladnmarks) {

  var self = this;
  counter = 1;

  var args = {
    data: { input: {string: config.schema} },
    headers: { "Content-Type": "application/json" }
  };

};


/* Creates CORS request */
SparkJobClient.prototype.createCORSRequest =  function createCORSRequest(method, url) {
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


/**
 * Monitoring Job Status via timers
 *
 * @param jobId is the Spark Job Server generated JobId
 * @param algorithmType is the type of algorithm that will be run on top of graph
 * @return the url containing the correct call to the Spark Job Server.
 */
SparkJobClient.prototype.setupTimer = function(jobId, algorithmType) {
    var self = this;

    var args = {
        headers: {"Content-Type": "application/json"}
    };

    var interval = setInterval(function () {

        var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs/"+ jobId;

        //It worked when I change this to GET method request
        request
            .get(strRequest)
            .end(function(err, res){
                var data = res.body;

                if(data.status === Enums.jobStatus.FINISHED){

                    $('#tbl_jobs > tbody:last-child').append('<tr><td>' + jobId + '</td><td>' + algorithmType + '</td><td>' + data.status + '(' + data.duration + ')</td></tr>');
                    $('.progress-bar').css('width', 100+'%').attr('aria-valuenow', 100);
                    clearInterval(interval);

                    //Results table
                    if(algorithmType === Enums.algorithmType.PAGE_RANK){

                        var result = data.result;

                        for(var i = 0; i < result.length; i++){
                            $('#tbl_pr > tbody:last-child').append('<tr><td>' + result[i][0] + '</td><td>' + result[i][1] + '</td></tr>');
                        }

                    }
                }
                else if(data.status === Enums.jobStatus.RUNNING){

                    $('.progress-bar').css('width', counter+'%').attr('aria-valuenow', counter);
                    counter++;

                }
                else if(data.status === Enums.jobStatus.ERROR){
                    counter = 0;
                    $('.progress-bar').css('width', counter+'%').attr('aria-valuenow', counter);
                    clearInterval(interval);

                    $('#tbl_jobs > tbody:last-child').append('<tr><td>' + jobId + '</td><td>' + algorithmType + '</td><td>' + data.status + '</td></tr>');
                }

                algorithmResult = data.result;

            });

    }, 200);

};


/**
 * Creating HTTP Request for Spark Job Server
 *
 * @param algorithmType is the type of algorithm that will be run on top of graph
 * @return the url containing the correct call to the Spark Job Server.
 */
SparkJobClient.prototype._createHTTPRequestString =  function(algorithmType) {

    var self = this;

    var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=";

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
       //TODO
    }

    return strRequest;
};

/* Exporting module */
module.exports = SparkJobClient;

