"use strict";

/**      In God we trust
 * Created by: Servio Palacios on 2016.05.26.
 * Source: restConnector.js
 * Author: Servio Palacios
 * Last edited: 2016.05.26 13:55
 * Description: Spark Job Connector using REST API
 */

//External Libraries
var Client = require('node-rest-client').Client;
var client = new Client();

//Local Libraries
var Enums = require("./enums");
var config = require("../config.json");

/**
 * @constructor
 *
 */
function SparkJobClient(options) {

    var self = this;

    if(typeof options === "undefined"){ //I only set this when it is integrity check
        throw new Error("[options] parameter not defined.");
    }

    //self._threshold = config.security.threshold;

}//SparkJobClient Constructor

/* Generates Random Numbers */
SparkJobClient.prototype.random = function(nBytes) {

    return "";
    //I can see the object:
    //base64:
    //data:

};

/* Generates Random Numbers returns string */
SparkJobClient.prototype.randomString = function(nBytes) {
    

};


/* Exporting module */
module.exports = SparkJobClient;

