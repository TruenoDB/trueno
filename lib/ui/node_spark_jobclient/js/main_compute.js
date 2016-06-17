/**
 * @author Servio Palacios
 * @date_creation 2016.06.13.
 * @module main_compute.js
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

  /* The spark library connection variable */
  window.ComputeScheduler = new ComputeScheduler(options);
  window.self = self;

  self.jobs = [];

  /* App UI logic */
  $("#btn_pagerank").click(function(){

    let objJob = {
      algorithm: { property: {graph:  'gnutella',
        TOL:    0.15,
        alpha:  0.0001}
      },
      algorithmType: Enums.algorithmType.PAGE_RANK
    };

    ComputeScheduler._compute_promise(objJob);

    let tempJobId = ComputeScheduler._getJobId();

    let interval = setInterval(function () {

      if (tempJobId === null) {

        tempJobId = ComputeScheduler._getJobId();

      }

      if (tempJobId != null) {

        /* Show Job Id */
        console.log("Job Id -> [" + tempJobId + "]");

        let strJobStatus = ComputeScheduler._jobStatus(tempJobId);

        /* If Status is FINISHED then clear the interval */
        /* Obtain Result */
        if (strJobStatus === Enums.jobStatus.FINISHED) {

          clearInterval(interval);

        }//if

      }//if typeof

    }, 500);

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
