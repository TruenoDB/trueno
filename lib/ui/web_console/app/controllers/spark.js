"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: admin.js
 * Author: victor
 * Description:
 *
 */

function Spark(options) {

  this._scope = options.scope;
  this._sce = options.sce;

}

Spark.prototype.init = function () {

  this._scope.sparkWebUI = this._sce.trustAsResourceUrl("http://" + document.location.hostname + ":" + 8006);

};