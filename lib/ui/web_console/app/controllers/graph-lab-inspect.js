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

GraphLabInspect.prototype.setComponent = function (c, type) {

  this._scope.component = {
    id: c.id,
    type: type,
    label: c.label,
    prop: c.properties,
    comp: {},
    meta: {}
  };
  this._scope.$apply();
};
