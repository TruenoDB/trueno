/**
 * @author Servio Palacios
 * @date_creation 2016.05.27.
 * @module main.js
 * @description calls to the algorithms wrapped in spark's class
 *
 */
$(document).ready(function () {

    /* The global media object */
    var self = {};

    /* Connection settings */
    var options = {
        parent: self,
        defaultSparkJobServer: config.sparkJobServer.defaultSparkJobServer,
        defaultPort: config.sparkJobServer.defaultPort //8090
    };

    /* the spark library connection variable */
    window.SparkClient = new SparkJobClient(options);
    window.self = self;

    self.jobs = [];

    /* App UI logic */
    $("#btn_pagerank").click(function(){
        SparkClient.pageRankRequest("gnutella",0.0001, 0.5);
    });

    $("#btn_connectedcomponents").click(function(){
        SparkClient.connectedComponents();
    });

    $("#btn_trianglecounting").click(function(){
        SparkClient.triangleCounting();
    });

    $("#btn_shortestpath").click(function(){
        console.log("Shortest Path");
    });

    $("#btn_wordcount").click(function(){
        console.log("Word Count");

        SparkClient.wordCountRequest();
    });

});




