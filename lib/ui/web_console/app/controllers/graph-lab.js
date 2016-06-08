"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab.js
 * Author: victor
 * Description:
 *
 */

function GraphLab(options) {

  this._scope = options.scope;
  this._scope.userGraph = '';
  this._scope.graphs = [];
  this._queryEditor = null;
}

GraphLab.prototype.init = function () {

  /* init user graph selection variable */
  this._scope.userGraph = '';
  /* init available graphs */
  this._scope.graphs = [
    'Friendster',
    'Facebook',
    'Protein H56',
  ];
  /* Init query changed event handler */
  this._scope.aceChanged = this.onQueryChanged.bind(this);
  /* Query editor loaded event handler */
  this._scope.aceLoaded = this.onQueryEditorLoaded.bind(this);

};

GraphLab.prototype.onQueryEditorLoaded = function (_editor) {

  /* Setting editor */
  this._queryEditor = _editor;

  /* Set styling and settings */
  _editor.setReadOnly(false);
  _editor.setFontSize('3vmin');
  _editor.renderer.setOption('showLineNumbers', false);
  _editor.setHighlightActiveLine(false);

};

GraphLab.prototype.onQueryChanged = function (e) {

  /* Get the editor */
  var _editor = e[1];
  var lines = e[0].lines;

  if (lines.length > 1) {
    _editor.find(String.fromCharCode(10))
    _editor.replaceAll('');
    _editor.selection.clearSelection()
  }
};