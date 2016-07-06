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
  this._queryFilter;
  this._colorMap = {};
  this._graphComputer = null;

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
  this._scope.visTweakIsOpen = false;
  /* Set the filter default setting to view */
  this._scope.filterRadio = 'view';

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
  this._scope.zoomIn = this.onZoomIn.bind(this);
  this._scope.zoomOut = this.onZoomOut.bind(this);
  this._scope.zoomCenter = this.onZoomCenter.bind(this);
  this._scope.onDownload = this.onDownload.bind(this);

  /* Query editor loaded event handler */
  this._scope.aceFilterLoaded = this.onQueryFilterLoaded.bind(this);
  /* Init query changed event handler */
  this._scope.aceFilterChanged = this.onQueryFilterChanged.bind(this);
}

GraphLabVisualizer.prototype.init = function () {

  var self = this;

  /* Give time to the rendering to ng-include the dynamic html */
  setTimeout(function () {

    /* Instantiate new Sigma */
    self._vis = new sigma({
      graph: {},
      renderer: {
        container: document.getElementById('graphRendererContainer'),
        type: 'canvas'
      },
      settings: {
        /* edgeLabelSize: 'proportional', */
        drawLabels: false,
        drawEdgeLabels: false,
        minArrowSize: 6,
        borderSize: 2,
        outerBorderSize: 3,
        defaultNodeOuterBorderColor: 'rgb(236, 81, 72)',
        enableEdgeHovering: true,
        sideMargin: 1,
        edgeHoverColor: 'red',
        defaultEdgeHoverColor: '#000',
        edgeHoverSizeRatio: 1,
        edgeHoverExtremities: true,
        //scalingMode: 'outside'
      }
    });

    /* Initialize all visualizer methods */
    self._vis.bind('overNode outNode clickNode doubleClickNode rightClickNode', self.onClickVertex.bind(self));
    self._vis.bind('clickEdge', self.onClickEdge.bind(self));
    self._vis.bind('clickStage doubleClickStage rightClickStage', self.onClickCanvas.bind(self));
    /* Add drag plugin */
    sigma.plugins.dragNodes(self._vis, self._vis.renderers[0]);
    /* refresh view */
    self._scope.$apply();

  }, 0);
};

GraphLabVisualizer.prototype.setComputer = function (computer) {
  /* set computer */
  this._graphComputer = computer;
};

GraphLabVisualizer.prototype.onQueryFilterLoaded = function (_editor) {

  /* Save editor reference */
  this._queryFilter = _editor;

  /* Set styling and settings */
  _editor.session.setOption("useWorker", false);
  _editor.setReadOnly(false);
  _editor.setFontSize('1.8vmin');
  _editor.renderer.setOption('showLineNumbers', false);
  _editor.setOptions({maxLines: 1});
  _editor.setHighlightActiveLine(false);
  _editor.commands.addCommand({
    name: 'filter',
    bindKey: {win: 'Enter', mac: 'Enter'},
    exec: function (editor) {
    }
  });

};

GraphLabVisualizer.prototype.onQueryFilterChanged = function (e) {

  /* Get the editor */
  var _editor = e[1];
  var lines = e[0].lines;

  if (lines.length > 1) {
    _editor.find(String.fromCharCode(10))
    _editor.replaceAll('');
    _editor.selection.clearSelection()
  }
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
  /* add each component */
  cmp.forEach(function (c, i, a) {
    switch (c.type) {
      case 'vertex':
        if (!self._vis.graph.nodes(c.id)) {
          self.addVertex(c, i, a);
        }
        break;
      case 'edge':
        /* If edge does not exist, and source -> target are present, add the edge */
        if (!self._vis.graph.edges(c.id) && (self._vis.graph.nodes(c.outV) && self._vis.graph.nodes(c.inV))) {
          self.addEdge(c);
        }
    }
  });

  /* refreshing visualization and start render event */
  this._vis.refresh();
  /* Setting the blinker */
  this._scope.blinkers.graph = true;
}

GraphLabVisualizer.prototype.addVertex = function (v, i, a) {

  /* check if label is in color map*/
  if (v.label && !this._colorMap[v.label]) {
    this._colorMap[v.label] = this._getStringColor(v.label);
  }

  /* Creating node from vertex */
  var node = {
    id: v.id,
    label: v.label,
    degree: 0,
    properties: {},
    x: /*Math.cos(Math.PI * 2 * i / a.length),*/Math.random(),
    y: /*Math.sin(Math.PI * 2 * i / a.length),*/Math.random(),
    size: 1,
    //color: '#' + (Math.floor(Math.random() * 16777215).toString(16) + '000000').substr(0, 6),
    color: '#' + this._colorMap[v.label]
  };

  /* Adding properties */
  for (var k in v.properties) {
    if(v.properties[k][0]){
      node.properties[k] = v.properties[k][0].value;
    }else{
      node.properties[k] =  v.properties[k];
    }
  }

  /* Adding node */
  this._vis.graph.addNode(node);
  /* Adding the node to the computer */
  this._graphComputer.getLocalComputer().addNode(node);
}

GraphLabVisualizer.prototype.addEdge = function (e) {

  /* check if label is in color map*/
  if (e.label && !this._colorMap[e.label]) {
    this._colorMap[e.label] = this._getStringColor(e.label);
  }

  /* Creating node from vertex */
  var edge = {
    id: e.id,
    label: e.label,
    source: e.outV,
    target: e.inV,
    type: 'curvedArrow',
    properties: {},
    size: 1,
    color: '#' + this._colorMap[e.label]
  };

  /* Increase nodes degree */
  this._vis.graph.nodes(e.outV).degree++;
  this._vis.graph.nodes(e.inV).degree++;

  /* Adding properties */
  for (var k in e.properties) {
    if(e.properties[k][0]){
      edge.properties[k] = e.properties[k][0].value;
    }else{
      edge.properties[k] =  e.properties[k];
    }
  }

  /* Adding node to the visualization*/
  this._vis.graph.addEdge(edge);
  /* Adding the edge to the computer */
  this._graphComputer.getLocalComputer().addEdge(edge);
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

GraphLabVisualizer.prototype._getStringColor = function (str) {

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var c = (hash & 0x00FFFFFF)
  .toString(16)
  .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

GraphLabVisualizer.prototype.onZoomIn = function () {

  var c = this._vis.camera;

  sigma.misc.animation.camera(c, {
    ratio: c.ratio / c.settings('zoomingRatio')
  }, {
    duration: 200
  });
}

GraphLabVisualizer.prototype.onZoomOut = function () {

  var c = this._vis.camera;

  sigma.misc.animation.camera(c, {
    ratio: c.ratio * c.settings('zoomingRatio')
  }, {
    duration: 200
  });
}

GraphLabVisualizer.prototype.onZoomCenter = function () {

  var c = this._vis.camera;

  sigma.misc.animation.camera(c, {
    x: 0,
    y: 0
  }, {
    duration: 200
  });

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
  //console.log(e.type, e.data.node, e.data.captor);
  /* Set component in the inspect viewer */
  this._inspector.setComponent(this._vis.graph.nodes(e.data.node.id), 'vertex');
}

GraphLabVisualizer.prototype.onClickEdge = function (e) {
  //console.log(e.type, e.data.edge, e.data.captor);
  /* Set component in the inspect viewer */
  this._inspector.setComponent(this._vis.graph.edges(e.data.edge.id), 'edge');
}

GraphLabVisualizer.prototype.onClickCanvas = function (e) {
  //console.log(e.type, e.data.captor);
}