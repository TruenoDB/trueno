"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: monitor.js
 * Author: victor
 * Description:
 *
 */

function Monitor(options) {

  this._scope = options.scope;
  this._sce = options.sce;

}

Monitor.prototype.init = function () {

  this._scope.pm2guiAddress = this._sce.trustAsResourceUrl("http://" + document.location.hostname + ":" + 8088);

}