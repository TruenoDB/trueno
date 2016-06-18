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
  this._exConn = options.wConsole._exConn;
  this._queryEditor = null;

  /* Define visualizer property with custom getter */
  Object.defineProperty(this, '_visualizer', {
    get: function() {
      return options.wConsole._graphLabCtrl._graphLabVisCtrl;
    }
  });
}

GraphLabQuery.prototype.init = function () {

  /* init available graphs */
  this._scope.graphs = [
    'modern',
    'Friendster',
    'Facebook',
    'Protein H56',
  ];

  /* init user graph selection variable */
  this._scope.select = {selectedGraph: null};

  /* The query history */
  this._scope.queryHistory = [];

  /* Bind graph select event */
  this._scope.graphSelectChanged = this.onGraphSelected.bind(this);
  /* Init query changed event handler */
  this._scope.aceChanged = this.onQueryChanged.bind(this);
  /* Query editor loaded event handler */
  this._scope.aceLoaded = this.onQueryEditorLoaded.bind(this);
  /* Bind execute query button */
  this._scope.executeQuery = this.executeQuery.bind(this);
};

GraphLabQuery.prototype.onGraphSelected = function (g) {

  console.log(this._scope.select.selectedGraph);
};


GraphLabQuery.prototype.executeQuery = function () {

  var self = this;

  /* Pack the query */
  var qry = new QueryPack();
  qry.setQuery(this._queryEditor.getValue());
  qry.setStartTime(new Date());

  this._exConn.executeQuery(qry.getQuery()).then(function (res) {

    /* Set query as successful */
    qry.setSuccess(true);
    qry.setResult(res);
    qry.setEndTime(new Date());
    qry.setDuration(qry.getEndTime() - qry.getStartTime());
    /* Adding to query history */
    self._scope.queryHistory.push(qry);

    /* Adding vertices to visualization */
    self._visualizer.addComponents(res);
    /* Logging error */
    console.log(res);

  }, function (err) {

    /* Set query as successful */
    qry.setSuccess(false);
    qry.setError(err);
    qry.setEndTime(new Date());
    qry.setDuration(qry.getEndTime() - qry.getStartTime());

    /* Adding to query history */
    self._scope.queryHistory.push(qry);
    /* Logging error */
    console.log(err);
  });
};

GraphLabQuery.prototype.onQueryEditorLoaded = function (_editor) {

  /* Save editor reference */
  this._queryEditor = _editor;

  /* Set styling and settings */
  _editor.setReadOnly(false);
  _editor.setFontSize('1.8vmin');
  _editor.renderer.setOption('showLineNumbers', false);
  _editor.setOptions({maxLines: 10});
  _editor.setHighlightActiveLine(false);
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