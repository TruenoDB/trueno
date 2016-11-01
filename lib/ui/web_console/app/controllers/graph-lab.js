"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab.js
 * Author: victor
 * Description:
 */

function GraphLab(options) {

  this._scope = options.scope;
  this._scope.userGraph = '';
  this._scope.graphs = [];

  /* Instantiating the controllers for the different graph lab sections */
  this._graphLabResultsCtrl = new GraphLabResults(options);
  this._graphLabSettingsCtrl = new GraphLabSettings(options);
  this._graphLabQueryCtrl = new GraphLabQuery(options);
  this._graphLabInspectCtrl = new GraphLabInspect(options);
  this._graphLabVisCtrl = new GraphLabVisualizer(options, this._graphLabResultsCtrl);
  this._graphComputeCtrl= new GraphLabCompute(options, this._graphLabResultsCtrl, this._graphLabVisCtrl);


  /* Initializing the controllers */
  this._graphLabResultsCtrl.init();
  this._graphLabSettingsCtrl.init();
  this._graphLabQueryCtrl.init();
  this._graphComputeCtrl.init();
  this._graphLabInspectCtrl.init();
  this._graphLabInspectCtrl.init();

  /* Aggregate Graph Lab computer to visualizer */
  this._graphLabVisCtrl.setComputer(this._graphComputeCtrl);

}

GraphLab.prototype.init = function () {
  /* Initialize other Graph, Edge, Vertex, compute, and inspect controllers */
};

GraphLab.prototype.setGraphs = function (collection) {
  /* assign bridge functions */
  this._graphLabQueryCtrl.setGraphs(collection);
};

GraphLab.prototype.setAlgorithms = function (collection) {
  /* assign bridge functions */
  this._graphComputeCtrl.setAlgorithms(collection);
};