"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab-query.js
 * Author: victor
 * Description:
 *
 */

function GraphLabQuery(options) {

  this._scope = options.scope;
  this._inConn = options.wConsole._inConn;
  this._queryEditor = null;

  /* Define visualizer property with custom getter */
  Object.defineProperty(this, '_visualizer', {
    get: function () {
      return options.wConsole._graphLabCtrl._graphLabVisCtrl;
    }
  });

  /* toast */
  this._toast = options.toast;
}

GraphLabQuery.prototype.init = function () {

  var self = this;

  /* init available graphs */
  this._scope.graphs = [];

  /* Set the progress bar value */
  this._scope.queryProgressActivate = false;

  /* init user graph selection variable */
  this._scope.select = {selectedGraph: null};

  /* The query history */
  this._scope.queryHistory = [];

  this._scope.openMenu = function ($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };

  /* Bind graph select event */
  this._scope.graphSelectChanged = this.onGraphSelected.bind(this);
  /* Init query changed event handler */
  this._scope.aceChanged = this.onQueryChanged.bind(this);
  /* Query editor loaded event handler */
  this._scope.aceLoaded = this.onQueryEditorLoaded.bind(this);
  /* Bind execute query button */
  this._scope.executeQuery = function () {
    self.executeQuery.bind(self)(self._queryEditor.getValue(), false);
  };

};

GraphLabQuery.prototype.setGraphs = function (collection) {

  /* add graph collection */
  this._scope.graphs = collection.map(function (g) {
    return g._label;
  });
  /* If not apply is ongoing */
  if (!this._scope.$$phase) {
    this._scope.$apply();
  }
};


GraphLabQuery.prototype.onGraphSelected = function (g) {

  /* switching gremlin graph */
  var swithQry = "graph = TruenoGraph.open('"+this._scope.select.selectedGraph+"');g = graph.traversal();''"

  this._toast.info(this._scope.select.selectedGraph, 'Graph Switched');
  this.executeQuery(swithQry, true);
};

GraphLabQuery.prototype.getSelectedGraph = function () {

  return this._scope.select.selectedGraph;
};

GraphLabQuery.prototype.toggleProgressBar = function (v) {

  this._scope.queryProgressActivate = v;

  /* If not apply is ongoing */
  if (!this._scope.$$phase) {
    this._scope.$apply();
  }

};

GraphLabQuery.prototype.getNeighbors = function (id) {

  /* build query */
  var nQry = "g.V(" + id + ").as('a').both().as('b').select('a').bothE().as('c').select('a','b','c')";
  /* execute query */
  this.executeQuery(nQry, true);
}

GraphLabQuery.prototype.aggregateRecursively = function (res, list) {

  for (var prop in res) {
    /* if vertex or edge add to list */
    if (res[prop].hasOwnProperty('type') && (res[prop].type == 'vertex' || res[prop].type == 'edge')) {
      list.push(res[prop]);
    } else {
      this.aggregateRecursively(res[prop], list);
    }
  }
}

GraphLabQuery.prototype.executeQuery = function (qryString, automatic) {

  var self = this;

  /* Pack the query */
  var qry = new QueryDataState();
  qry.setQuery(qryString);
  qry.setStartTime(new Date());
  qry.setSuccess(true);

  /* Start progressbar */
  this.toggleProgressBar(true);

  ///* partial results */
  //var resBuffer = [];
  ///* Execute Query Stream*/
  //const query = this._inConn.executeQueryStream(qry.getQuery());
  ///* receiving data */
  //query.on('data', (result) => {
  //
  //  /* pushing new results into buffer */
  //  resBuffer.push(result);
  //  /* dumping buffer into visulizer */
  //  if (resBuffer.length > 500) {
  //    self._visualizer.addComponents(resBuffer);
  //    resBuffer = [];
  //  }
  //});
  ///* stream ends */
  //query.on('end', () => {
  //  console.log('All results fetched');
  //  self.toggleProgressBar(false);
  //});
  ///* stream error */
  //query.on('error', function (e) {
  //  console.log('Could not complete query:', e.message);
  //  self.toggleProgressBar(false);
  //});

  /* Execute Query */
  this._inConn.executeQuery(qry.getQuery()).then(function (res) {

    var flatResults = [];

    /* Set query as successful */
    qry.setSuccess(true);
    qry.setResult(res);
    qry.setEndTime(new Date());
    qry.setDuration(qry.getEndTime() - qry.getStartTime());
    /* Adding to query history */
    self._scope.queryHistory.push(qry);
    /* aggregating results */
    self.aggregateRecursively(res, flatResults);
    /* Logging results if not automatic(via click ui) */
    if(!automatic){
      self._toast.success('Received results for query: ' + qry.getQuery(), flatResults.length + ' components retrieved');
    }
    /* Adding vertices to visualization */
    self._visualizer.addComponents(flatResults);
    /* disable progress bar */
    self.toggleProgressBar(false);

  }, function (err) {

    /* Set query as successful */
    qry.setSuccess(false);
    qry.setError(err);
    qry.setEndTime(new Date());
    qry.setDuration(qry.getEndTime() - qry.getStartTime());
    /* show error */
    self._toast.error('Query error: ' + err, 'Query error');
    /* Adding to query history */
    self._scope.queryHistory.push(qry);
    /* Logging error */
    console.log(err);
    /* disable progress bar */
    self.toggleProgressBar(false);
  });
};

GraphLabQuery.prototype.onQueryEditorLoaded = function (_editor) {

  /* Save this object reference */
  var self = this;
  /* Save editor reference */
  this._queryEditor = _editor;

  /* Set styling and settings */
  _editor.setReadOnly(false);
  _editor.setFontSize('1.8vmin');
  _editor.renderer.setOption('showLineNumbers', false);
  _editor.setOptions({maxLines: 10});
  _editor.setHighlightActiveLine(false);
  _editor.commands.addCommand({
    name: 'execute',
    bindKey: {win: 'Enter', mac: 'Enter'},
    exec: function (editor) {
      if (self._scope.settings.enterExecutes) {
        self.executeQuery(self._queryEditor.getValue(), false);
      } else {
        editor.insert("\n");
      }
    }
  });
};


GraphLabQuery.prototype.onQueryChanged = function (e) {

  /* Get the editor */
  var _editor = e[1];
  var lines = e[0].lines;

  if (lines.length > 10) {
    _editor.find(String.fromCharCode(10))
    _editor.replaceAll('');
    _editor.selection.clearSelection()
  }
};