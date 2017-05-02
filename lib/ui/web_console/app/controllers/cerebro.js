"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: admin.js
 * Author: victor
 * Description:
 *
 */

function Cerebro(options) {

  this._scope = options.scope;
  this._sce = options.sce;

}

Cerebro.prototype.init = function () {

  this._scope.CerebroAddress = this._sce.trustAsResourceUrl("http://" + document.location.hostname + ":" + 8008);

};