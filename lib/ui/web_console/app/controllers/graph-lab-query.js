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
    get: function () {
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
  this._scope.executeQuery = this.executeQuery.bind(this);
};

GraphLabQuery.prototype.onGraphSelected = function (g) {

  console.log(this._scope.select.selectedGraph);
};

GraphLabQuery.prototype.toggleProgressBar = function (v) {

  this._scope.queryProgressActivate = v;

  /* If not apply is ongoing */
  if (!this._scope.$$phase) {
    this._scope.$apply();
  }

};

GraphLabQuery.prototype.executeQuery = function () {

  var self = this;

  /* Pack the query */
  var qry = new QueryDataState();
  qry.setQuery(this._queryEditor.getValue());
  qry.setStartTime(new Date());
  qry.setSuccess(true);

  /* Start progressbar */
  this.toggleProgressBar(true);

  ///* partial results */
  //var resBuffer = [];
  ///* Execute Query Stream*/
  //const query = this._exConn.executeQueryStream(qry.getQuery());
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
  this._exConn.sql(qry.getQuery()).then(function (res) {

    /* Set query as successful */
    qry.setSuccess(true);
    qry.setResult(res);
    qry.setEndTime(new Date());
    qry.setDuration(qry.getEndTime() - qry.getStartTime());
    /* Adding to query history */
    self._scope.queryHistory.push(qry);
    /* Logging results */
    console.log('retrieved ' + res.v.length + ' vertices and ' + res.e.length + ' edges.');
    /* Adding vertices to visualization */
    // setTimeout(function () {
    self._visualizer.addComponents(res);
    /* disable progress bar */
    self.toggleProgressBar(false);
    // }, 0);

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
        self.executeQuery();
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