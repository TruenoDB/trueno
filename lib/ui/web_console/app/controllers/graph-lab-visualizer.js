"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab-visualizer.js
 * Author: victor
 * Description:
 */

function GraphLabVisualizer(options, graphLabResultsCtrl) {

  this._scope = options.scope;
  this._currentTab = 'graph';
  this._vis = null;
  this._queryFilter;
  this._graphFilter = null;
  this._colorMap = {};
  this._graphComputer = null;
  this._dialog = options.dialog;

  /* results controller */
  this._graphLabResultsCtrl = graphLabResultsCtrl;

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

  Object.defineProperty(this, '_graphLab', {
    get: function () {
      return options.wConsole._graphLabCtrl;
    }
  });

  Object.defineProperty(this, '_localCompute', {
    get: function () {
      return options.wConsole._graphLabCtrl._graphComputeCtrl._localComp;
    }
  });

  /* The tweaks functions status */
  this._scope.visTweakIsOpen = false;
  /* Set the filter default setting to view only the resulting nodes */
  this._scope.filterRadio = 'show';
  /* Set the filter chips collection */
  this._scope.filterChips = [];
  this._scope.chk = {fetchNeighbors: false};

  /* The Fab button status */
  this._visTweaks = {
    isLayoutRunning: false
  };
  /* Setting the blinkers variables */
  this._scope.blinkers = {
    graph: false,
    vertex: false,
    edge: false,
    results: false
  };

  /* binding methods */
  this._scope.visInit = this.init.bind(this);
  this._scope.onTabChanges = this.onTabSelected.bind(this);
  this._scope.onTweakLayoutToggle = this.onTweakToggleLayout.bind(this);
  this._scope.zoomIn = this.onZoomIn.bind(this);
  this._scope.zoomOut = this.onZoomOut.bind(this);
  this._scope.zoomCenter = this.onZoomCenter.bind(this);
  this._scope.onDownload = this.onDownload.bind(this);
  this._scope.onCreate = this.onCreate.bind(this);
  this._scope.onDelete = this.onDelete.bind(this);
  this._scope.onClear = this.onClear.bind(this);
  this._scope.removeFilter = this.onRemoveFilter.bind(this);
  /* neighbors on click */
  this._scope.neighborsOnClick = function (chk) {
    console.log(chk);
  };

  /* Query editor loaded event handler */
  this._scope.aceFilterLoaded = this.onQueryFilterLoaded.bind(this);
  /* Init query changed event handler */
  this._scope.aceFilterChanged = this.onQueryFilterChanged.bind(this);

  /* toast */
  this._toast = options.toast;
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
    self._vis.bind('clickNode doubleClickNode rightClickNode', self.onClickVertex.bind(self));
    self._vis.bind('overNode', self.onHoverVertex.bind(self));
    self._vis.bind('clickEdge', self.onClickEdge.bind(self));
    self._vis.bind('clickStage doubleClickStage rightClickStage', self.onClickCanvas.bind(self));
    /* Add drag plugin */
    sigma.plugins.dragNodes(self._vis, self._vis.renderers[0]);

    /* Initialize graph filter */
    self._graphFilter = new GraphFilter({vis: self._vis});
    window.graphFilter = self._graphFilter;

    /* refresh view */
    self._scope.$apply();

  }, 0);
};

GraphLabVisualizer.prototype.getBlinkers = function () {
  /* set computer */
  return this._scope.blinkers;
};

GraphLabVisualizer.prototype.setComputer = function (computer) {
  /* set computer */
  this._graphComputer = computer;
};

GraphLabVisualizer.prototype.onQueryFilterLoaded = function (_editor) {

  var self = this;
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
      self.applyFilter(self._queryFilter.getValue());
    }
  })

};

GraphLabVisualizer.prototype.applyFilter = function (query) {

  /* Execute xpath query and get results */
  var results = this._graphFilter.filter(query, this._scope.filterRadio);

  /* if results are not null */
  if (results) {
    /* Add the new filter chip */
    this._scope.filterChips.push(results);
    /* refresh view */
    this._scope.$apply();

    /* set filter function */
    switch (results.type) {
      case "show":
        this.renderShowFilter(results);
        break;
      case "highlight":
        this.renderHighlightFilter(results);
        break;
    }
  }
  /* refresh the visualization */
  this._vis.refresh();
};

GraphLabVisualizer.prototype.renderShowFilter = function (results) {

  /* this instance reference */
  var self = this;

  /* Hide all nodes */
  this._vis.graph.nodes().forEach(function (node) {
    /* If no show filter in this node, hide it */
    if (Object.keys(node.filters.show).length == 0) {
      node.hidden = true;
    }
  });

  /* Hide all edges */
  this._vis.graph.edges().forEach(function (edge) {
    /* If no show filter in this node, hide it */
    if (Object.keys(edge.filters.show).length == 0) {
      edge.hidden = true;
    }
  });

  /* show all results */
  results.data.forEach(function (component) {
    /* if this is a vertex */
    if (component.hasOwnProperty('degree')) {
      var v = self._vis.graph.nodes(component.id);
      /* if vertex is valid */
      if (v) {
        v.hidden = false;
        v.filters[results.type][results.id] = true;
      }
    } else {
      var e = self._vis.graph.edges(component.id);
      /* if edge is valid */
      if (e) {
        e.hidden = false;
        e.filters[results.type][results.id] = true;
        /* show source and target */
        var source = self._vis.graph.nodes(e.source);
        source.hidden = false;
        source.filters[results.type][results.id] = true;
        var target = self._vis.graph.nodes(e.target);
        target.hidden = false;
        target.filters[results.type][results.id] = true;
      }
    }
  });
};

GraphLabVisualizer.prototype.renderHighlightFilter = function (results) {


};

GraphLabVisualizer.prototype.onRemoveFilter = function (filter, index) {

  /* set filter function */
  switch (filter.type) {
    case "show":
      this.removeShowFilter(filter);
      break;
    case "highlight":
      this.removeHighlightFilter(filter);
      break;
  }

  /* refresh the visualization */
  this._vis.refresh();
};


GraphLabVisualizer.prototype.removeShowFilter = function (filter) {

  console.log(this._scope.filterChips);

  /* If there is a show filter, selectively show corresponding vertices */
  if (this._scope.filterChips.filter(function (f) {
      return f.type == 'show'
    }).length) {

    /* Hide nodes that does not have show filters */
    this._vis.graph.nodes().forEach(function (node) {
      /* delete this filter from the node */
      if (node.filters.show[filter.id]) {
        delete node.filters.show[filter.id];
      }
      /* If no show filter in this node, hide it */
      if (Object.keys(node.filters.show).length == 0) {
        node.hidden = true;
      }
    });
    /* Hide edges that does not have show filters */
    this._vis.graph.edges().forEach(function (edge) {
      /* delete this filter from the node */
      if (edge.filters.show[filter.id]) {
        delete edge.filters.show[filter.id];
      }
      /* If no show filter in this node, hide it */
      if (Object.keys(edge.filters.show).length == 0) {
        edge.hidden = true;
      }
    });

  } else {
    /* just show everything */
    this._vis.graph.nodes().forEach(function (node) {
      node.filters = {show: {}, highlight: {}};
      node.hidden = false;
    });
    this._vis.graph.edges().forEach(function (edge) {
      edge.filters = {show: {}, highlight: {}};
      edge.hidden = false;
    });
  }

};


GraphLabVisualizer.prototype.removeHighlightFilter = function (results) {


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
  /* Rebuild Snapshot */
  this._graphFilter.computeSnapshot().then(function () {
    console.log("Snapshot Computed");
  }, function (err) {
    console.log(err);
  })
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
    filters: {show: {}, highlight: {}},
    x: /*Math.cos(Math.PI * 2 * i / a.length),*/Math.random(),
    y: /*Math.sin(Math.PI * 2 * i / a.length),*/Math.random(),
    size: 1,
    //color: '#' + (Math.floor(Math.random() * 16777215).toString(16) + '000000').substr(0, 6),
    color: '#' + this._colorMap[v.label]
  };

  /* Adding properties */
  for (var k in v.properties) {
    if (v.properties[k].hasOwnProperty(0) && typeof v.properties[k] != 'string') {
      node.properties[k] = v.properties[k][0].value;
    } else {
      node.properties[k] = v.properties[k];
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
    filters: {show: {}, highlight: {}},
    size: 1,
    color: '#' + this._colorMap[e.label]
  };

  /* Increase nodes degree */
  this._vis.graph.nodes(e.outV).degree++;
  this._vis.graph.nodes(e.inV).degree++;

  /* Adding properties */
  for (var k in e.properties) {
    if (e.properties[k].hasOwnProperty(0) && typeof e.properties[k] != 'string') {
      edge.properties[k] = e.properties[k][0].value;
    } else {
      edge.properties[k] = e.properties[k];
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
    case 'results':
      break;
  }
}

GraphLabVisualizer.prototype.onDelete = function () {

  var self = this;

  var confirm = this._dialog.confirm()
  .title("Are you sure you want to delte graph: '" + this._query._scope.select.selectedGraph + "'")
  .textContent('Deleting this graph is irreversible.')
  .ariaLabel('Deleting Graph')
  .ok("Yes, delete '" + this._query._scope.select.selectedGraph + "'")
  .cancel('No, cancel deletion');

  this._dialog.show(confirm).then(function () {
    /* deleting the graph */
    graphPersistence.deleteGraph(self._query._scope.select.selectedGraph).then(function () {
      self._toast.success(self._query._scope.select.selectedGraph + ' was successfully deleted!', 'Graph Deleted Sucessfully');

      /* fetch graphs */
      graphPersistence.getGraphs().then((result) => {
        /* set graphs */
        self._graphLab.setGraphs(result);
      }, (error) => {
        console.log("Error: Could not fetch Graph g info", error);
      });

    }, function (err) {
      self._toast.error(err, 'Error Deleting Graph');
    });
  }, function () {
    self._toast.warning(self._query._scope.select.selectedGraph + ' was not deleted!', 'Graph Deleted Cancelled');
  });

}

GraphLabVisualizer.prototype.getCurrentGraph = function (g) {

  /* This object reference */
  var self = this;
  /* vertices and edges collection */
  var vertices = [], edges = [];

  /* get the edges and vertices from compute */
  this._vis.graph.nodes().forEach(function (v) {
    vertices.push(v);
  });

  /* get the edges and vertices from compute */
  this._vis.graph.edges().forEach(function (e) {
    edges.push(e);
  });

  /* build graph from memory here */
  return {vertices: vertices, edges: edges};
}

GraphLabVisualizer.prototype.onCreate = function () {

  var self = this;

  self._dialog.show({
    controller: function ($scope, $mdDialog) {

      /* getting components */
      var components = self.getCurrentGraph();

      /* set the information object */
      $scope.name = '';
      /* The edge and vertices properties */
      $scope.edges = components.edges.length;
      $scope.vertices = components.vertices.length;

      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {

        //graphPersistence.deleteGraph($scope.name);
        //return;

        graphPersistence.createGraph($scope.name, {}).then(function (g) {

          var gVertices = [], gEdges = [];

          /* create all vertices */
          components.vertices.forEach(function (vertex) {
            /* creating vertex */
            var v = g.addVertex();
            v.setId(vertex.id);
            v.setLabel(vertex.label);
            /* adding properties to the vertex */
            for (var p in vertex.properties) {
              v.setProperty(p, vertex.properties[p]);
            }
            gVertices.push(v);
          });
          /* create all edges */
          components.edges.forEach(function (edge) {
            /* creating vertex */
            var e = g.addEdge(edge.source, edge.target);
            e.setId(edge.id);
            e.setLabel(edge.label);

            /* adding properties to the vertex */
            for (var p in edge.properties) {
              e.setProperty(p, edge.properties[p]);
            }
            gEdges.push(e);
          });

          graphPersistence.insertVerticesBatch(g, gVertices, function (current, total) {
            /* logging progress */
            console.log('vertex progresss', current, total, current / total);
          }).then(function () {

            /* then insert edges */
            return graphPersistence.insertEdgesBatch(g, gEdges, function (current, total) {
              /* logging progress */
              console.log('edges progresss', current, total, current / total);
            });

          }, function (err) {
            self._toast.error(error, 'Error Creating Vertices');
            graphPersistence.deleteGraph($scope.name).then(function () {
              console.log('Graph deleted', $scope.name);
            }, function (err) {
              console.log('error deleting', $scope.name);
            });
          }).then(function () {
            self._toast.success($scope.name + ' was successfully created!', 'Graph Created Sucessfully');
            /* fetch graphs with timeout */
            setTimeout(function () {
              graphPersistence.getGraphs().then((result) => {
                /* set graphs */
                self._graphLab.setGraphs(result);
                self._toast.info($scope.name + ' is available', 'Graph Available');
              }, (error) => {
                console.log("Error: Could not fetch Graph g info", error);
              });
            }, 3000);

            /* hiding dialog */
            $mdDialog.hide();
          }, function (err) {
            self._toast.error(error, 'Error Creating Edges');
            graphPersistence.deleteGraph($scope.name).then(function () {
              console.log('Graph deleted', $scope.name);
            }, function (err) {
              console.log('error deleting', $scope.name);
            });
          });

        }, function (error) {
          self._toast.error(error, 'Error Creating Graph');
        })

      };
    },
    templateUrl: 'views/tab.graphLab.create.dialog.html',
    parent: angular.element(document.body),
    clickOutsideToClose: true
  });

}

GraphLabVisualizer.prototype.onClear = function () {

  /* clear the graph visualization */
  this._vis.graph.clear();
  this._vis.refresh();
  /* clear results */
  this._graphLabResultsCtrl.clearResults();
  /* clear local computer data */
  this._graphComputer.getLocalComputer().clearGraph();

  /* show toast */
  this._toast.success('Clear Operation Successful.', 'Data Cleared');

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

GraphLabVisualizer.prototype.onHoverInVertex = function (e) {

  //TODO: save selected vertex and set the current hovered one
  /* Set component in the inspect viewer */
  //this._inspector.setComponent(this._vis.graph.nodes(e.data.node.id), 'vertex');
}

GraphLabVisualizer.prototype.onHoverOutVertex = function (e) {
  //TODO: Set the saved vertex back
  /* Set component in the inspect viewer */
  this._inspector.setComponent(this._vis.graph.nodes(e.data.node.id), 'vertex', this._vis);
}

GraphLabVisualizer.prototype.onClickVertex = function (e) {

  /* if automatic neighbor fetch is active retrieve with query */
  if (this._scope.chk.fetchNeighbors) {
    this._query.getNeighbors(e.data.node.id);
  }
}

GraphLabVisualizer.prototype.onHoverVertex = function (e) {

  //console.log(e.type, e.data.node, e.data.captor);
  /* Set component in the inspect viewer */
  this._inspector.setComponent(this._vis.graph.nodes(e.data.node.id), 'vertex', this._vis);
}

GraphLabVisualizer.prototype.onClickEdge = function (e) {
  //console.log(e.type, e.data.edge, e.data.captor);
  /* Set component in the inspect viewer */
  this._inspector.setComponent(this._vis.graph.edges(e.data.edge.id), 'edge', this._vis);
}

GraphLabVisualizer.prototype.onClickCanvas = function (e) {
  //console.log(e.type, e.data.captor);
}