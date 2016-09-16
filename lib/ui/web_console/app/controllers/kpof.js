"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: admin.js
 * Author: victor
 * Description:
 *
 */

function Kpof(options) {

  this._scope = options.scope;
  this._sce = options.sce;

}

Kpof.prototype.init = function () {

  this._scope.kpofAddress = this._sce.trustAsResourceUrl("http://" + document.location.hostname + ":" + 8004 + "/_plugin/kopf");

};