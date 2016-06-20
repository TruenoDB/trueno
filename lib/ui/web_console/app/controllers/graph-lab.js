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
  this._graphLabSettingsCtrl = new GraphLabSettings(options);
  this._graphLabQueryCtrl = new GraphLabQuery(options);
  this._graphLabVisCtrl = new GraphLabVisualizer(options);
  this._graphComputeCtrl= new GraphLabCompute(options);
  this._graphLabInspectCtrl= new GraphLabInspect(options);

  /* Initializing the controllers */
  this._graphLabSettingsCtrl.init();
  this._graphLabQueryCtrl.init();
  this._graphComputeCtrl.init();
  this._graphLabInspectCtrl.init();

}

GraphLab.prototype.init = function () {


  /* Initialize other Graph, Edge, Vertex, compute, and inspect controllers */
};