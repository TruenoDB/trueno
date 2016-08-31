"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab-visualizer.js
 * Author: victor
 * Description:
 *
 */

function GraphLabInspect(options) {

  this._scope = options.scope;
  this._scope.component = {};
  this._jsonFormatter = options.jsonFormatter;
}

GraphLabInspect.prototype.init = function () {

  /* Init formatter settings */
  this._jsonFormatter.hoverPreviewEnabled = true;
  this._jsonFormatter.hoverPreviewArrayCount = true;
  this._jsonFormatter.hoverPreviewFieldCount = true;
};

GraphLabInspect.prototype.setComponent = function (c, type, vis) {

  var comp = {
    id: c.id,
    type: type,
    label: c.label,
    prop: c.prop,
    computed: c.computed,
    meta: c.meta
  };

  switch(type){
    case 'vertex': comp.degree = c.degree;
      break;
    case 'edge':
      comp.source = c.source;
      comp.target = c.target;
      break;
  }

  this._scope.component = comp;
  this._scope.$apply();
};
