"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: remote-computer.js
 * Author: victor
 * Description:
 *
 */
function RemoteComputer(options, graphLabResultsCtrl, graphLabVisCtrl) {
  /* results controller */
  this._graphLabResultsCtrl = graphLabResultsCtrl;
  /* visualization controller */
  this._graphLabVisCtrl = graphLabVisCtrl;
  /* toast */
  this._toast = options.toast;
  /* exconn */
  this._exConn = options.exConn;
}

/**
 * Compute the incoming algorithm asynchronously and return the result.
 */
RemoteComputer.prototype.compute = function (graph, algo, params) {


  /* This instance object reference */
  var self = this;
  /* the result object */
  var resObj = {
    id: new Date().getTime(),
    label: algo.label,
    startTime: new Date(),
    json: {
      params: params,
      result: null
    }
  };

  /* Create a new Graph */
  let g = this._exConn.Graph();
  g.setLabel(graph);
  let c = g.getCompute();
  c.setAlgorithm(algo.fn);

  params.schema = {string: graph};
  params.persisted = {string: "false"};
  params.persistedTable = {string: "vertices"}

  c.setParameters(params);

  /* Get the compute of the algorithm */
  c.deploy().then((jobId)=> {
    console.log('JobId: ', jobId);

    var x = setInterval(function () {
      c.jobStatus(jobId).then((status)=> {
        console.log('Job Status: ', status);
        if (status == Enums.jobStatus.FINISHED) {
          c.jobResult(jobId).then((result)=> {
            console.log('Job Result: ', result);

            /* setting results */
            resObj.endTime = new Date();
            resObj.elapsed = resObj.endTime - resObj.startTime;
            resObj.json.result = result.result;

            /* adding results */
            self._graphLabResultsCtrl.addResult(resObj);
            /* set blinker */
            self._graphLabVisCtrl.getBlinkers().results = true;
            /* show toast */
            self._toast.success(algo.label, 'Remote compute job finish.');

            clearInterval(x);
          });
        }
      });
    }, 5000);
  });

}