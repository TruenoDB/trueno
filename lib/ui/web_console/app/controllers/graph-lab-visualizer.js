"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab-visualizer.js
 * Author: victor
 * Description:
 *
 */

function GraphLabVisualizer(options) {

  this._scope = options.scope;
  this._currentTab = 'graph';
  this._vis = null;

  /* Define cross controller properties */
  /* Define visualizer property with custom getter */
  Object.defineProperty(this, '_inspector', {
    get: function () {
      return options.wConsole._graphLabCtrl._graphLabInspectCtrl;
    }
  });

  Object.defineProperty(this, '_query', {
    get: function () {
      return options.wConsole._graphLabCtrl._graphLabQueryCtrl;
    }
  });


  /* The tweaks functions status */
  this._scope.visTweakFabStatus = {
    isOpen: false
  };
  /* The Fab button status */
  this._visTweaks = {
    isLayoutRunning: false
  };
  /* Setting the blinkers variables */
  this._scope.blinkers = {
    graph: false,
    vertex: false,
    edge: false,
    console: false
  }

  /* binding methods */
  this._scope.visInit = this.init.bind(this);
  this._scope.onTabChanges = this.onTabSelected.bind(this);
  this._scope.onTweakLayoutToggle = this.onTweakToggleLayout.bind(this);
  this._scope.onDownload = this.onDownload.bind(this);
}

GraphLabVisualizer.prototype.init = function () {

  var self = this;

  /* Give time to the rendering to ng-include the dynamic html */
  setTimeout(function () {

    /* Instantiate new Sigma */
    self._vis = new sigma(document.getElementById('graphRendererContainer'));
    /* Initialize all visualizer methods */
    self._vis.bind('overNode outNode clickNode doubleClickNode rightClickNode', self.onClickVertex.bind(self));
    self._vis.bind('clickEdge', self.onClickEdge.bind(self));
    self._vis.bind('clickStage doubleClickStage rightClickStage', self.onClickCanvas.bind(self));
    /* Add drag plugin */
    sigma.plugins.dragNodes(self._vis, self._vis.renderers[0]);
  }, 0);
};

GraphLabVisualizer.prototype.onTabSelected = function (tab) {

  /* Set the current active visualization tab */
  this._currentTab = tab;
  /* Deactivate the blinker */
  this._scope.blinkers[this._currentTab] = false;
};


GraphLabVisualizer.prototype.addComponents = function (cmp) {

  /* This object reference */
  var self = this;

  /* Add all vertices */
  cmp.map(function (c) {
    switch (c.type) {
      case 'vertex':
        self.addVertex(c);
        break;
      case 'edge':
        self.addEdge(c);
    }
  });

  /* refreshing visualization */
  this._vis.refresh();
  /* Setting the blinker */
  this._scope.blinkers.graph = true;
}

GraphLabVisualizer.prototype.addVertex = function (v) {

  /* Creating node from vertex */
  var node = {
    id: v.id,
    label: v.label,
    properties: {},
    x: Math.random(),
    y: Math.random(),
    size: 1,
    color: '#' + (Math.floor(Math.random() * 16777215).toString(16) + '000000').substr(0, 6),
  };

  /* Adding properties */
  for (var k in v.properties) {
    node.properties[k] = v.properties[k][0].value;
  }

  /* Adding node */
  this._vis.graph.addNode(node);
}


GraphLabVisualizer.prototype.addEdge = function (e) {

  /* Creating node from vertex */
  var edge = {
    id: e.id,
    label: e.label,
    source: e.outV,
    target: e.inV,
    properties: {},
    size: 1,
    color: '#ccc',
  };

  /* Adding properties */
  //for(var k in v.properties){
  //  node.properties[k] = v.properties[k][0].value;
  //}

  /* Adding node */
  this._vis.graph.addEdge(edge);

}

GraphLabVisualizer.prototype.onDownload = function () {

  /* Check which tab is active */
  switch (this._currentTab) {
    case 'graph':
      this._downloadVisImage();
      break;
    case 'vertex':
      break;
    case 'edge':
      break;
    case 'console':
      break;
  }
}

GraphLabVisualizer.prototype._downloadVisImage = function () {

  this._vis.renderers[0].snapshot({
    format: 'png',
    background: 'white',
    filename: this._query._scope.select.selectedGraph + '-' + moment().format('YYYY-MM-DD-h:ma'),
    labels: true,
    download: true
  });
}

GraphLabVisualizer.prototype._downloadCSV = function () {

  //TODO: Download table csv
}

GraphLabVisualizer.prototype._textFile = function () {

  //TODO: Download console text
}

GraphLabVisualizer.prototype.onTweakToggleLayout = function () {

  if (this._visTweaks.isLayoutRunning) {
    /* Stop Force Atlas 2 */
    this._vis.stopForceAtlas2();
  } else {
    /* Start Force Atlas 2 Layout */
    this._vis.startForceAtlas2({
      worker: true,
      barnesHutOptimize: true,
      gravity: 5
    });
  }
  /* negate variable value */
  this._visTweaks.isLayoutRunning = !this._visTweaks.isLayoutRunning;
}

GraphLabVisualizer.prototype.onClickVertex = function (e) {
  console.log(e.type, e.data.node, e.data.captor);
  /* Set component in the inspect viewer */
  this._inspector.setComponent(this._vis.graph.nodes(e.data.node.id), 'vertex');
}

GraphLabVisualizer.prototype.onClickEdge = function (e) {
  console.log(e.type, e.data.edge, e.data.captor);
  /* Set component in the inspect viewer */
  this._inspector.setComponent(this._vis.graph.edges(e.data.edge.id), 'edge');
}

GraphLabVisualizer.prototype.onClickCanvas = function (e) {
  console.log(e.type, e.data.captor);
}