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

}

GraphLabQuery.prototype.init = function () {

  /* init user graph selection variable */
  this._scope.userGraph = '';
  /* init available graphs */
  this._scope.graphs = [
    'modern',
    'Friendster',
    'Facebook',
    'Protein H56',
  ];

  /* Init query changed event handler */
  this._scope.aceChanged = this.onQueryChanged.bind(this);
  /* Query editor loaded event handler */
  this._scope.aceLoaded = this.onQueryEditorLoaded.bind(this);
  /* Bind execute query button */
  this._scope.executeQuery = this.executeQuery.bind(this);
};

GraphLabQuery.prototype.executeQuery = function () {

  this._exConn.executeQuery(this._queryEditor.getValue()).then(function (res) {

    console.log(res);

  }, function (err) {

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