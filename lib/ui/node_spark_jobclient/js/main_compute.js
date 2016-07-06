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
  //$("#btn_pagerank").click(function(){
  //
  //  let objJob = {
  //    algorithm: { property: {graph:  'gnutella',
  //      TOL:    0.15,
  //      alpha:  0.0001}
  //    },
  //    algorithmType: Enums.algorithmType.PAGE_RANK
  //  };
  //
  //  ComputeScheduler._compute_promise(objJob);
  //
  //  let tempJobId = ComputeScheduler._getJobId();
  //
  //  let interval = setInterval(function () {
  //
  //    if (tempJobId === null) {
  //
  //      tempJobId = ComputeScheduler._getJobId();
  //
  //    }
  //
  //    if (tempJobId != null) {
  //
  //      /* Show Job Id */
  //      console.log("Job Id -> [" + tempJobId + "]");
  //
  //      let strJobStatus = ComputeScheduler._jobStatus(tempJobId);
  //
  //      /* If Status is FINISHED then clear the interval */
  //      /* Obtain Result */
  //      if (strJobStatus === Enums.jobStatus.FINISHED) {
  //
  //        clearInterval(interval);
  //
  //      }//if
  //
  //    }//if typeof
  //
  //  }, 500);
  //
  //});

  $("#btn_pagerank").click(function(){

    let objJob = {
      algorithm: { property: {graph:  'gnutella',
        TOL:    0.15,
        alpha:  0.00001}
      },
      algorithmType: Enums.algorithmType.PAGE_RANK
    };

    /* I need just the jobId, then the status */
    ComputeScheduler._ex_compute(objJob).then((jobId)=>{

        /* Obtaining the PageRank JobId from the promise */
        self._jobId = jobId;
        console.log("main_compute jobId in promise -> " + jobId);

    },(err)=>{

      /* Error in Promise */
      console.log("Error: " + err);

    });

    let interval = setInterval(function () {

     /* if (self._jobId === null) {

        self._jobId = ComputeScheduler._getJobId();

      }*/

      if (self._jobId != null) {

        /* Show Job Id */
        console.log("Job Id -> [" + self._jobId + "]");

        ComputeScheduler._ex_computeJobStatus(self._jobId).then( (status) => {

          /* Obtaining the PageRank Status from the promise */
          self._status = status;
          console.log("main_compute status in promise -> " + status);

        },(err) => {

          /* Error in Promise */
          console.log("Error: " + err);

        });

        /* If Status is FINISHED then clear the interval */
        /* Obtain Result */
        if (self._status === Enums.jobStatus.FINISHED ||
            self._status === Enums.jobStatus.ERROR ) {

          clearInterval(interval);

          ComputeScheduler._ex_computeJobResult(self._jobId).then( (result) => {

            console.log(result);

          },(err) => {

            /* Error in Promise */
            console.log("Error: " + err);

          });

        }//if

      }//if null

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
