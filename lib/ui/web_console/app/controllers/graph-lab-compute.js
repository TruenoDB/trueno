"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab-compute.js
 * Author: victor
 * Description:
 *
 */

function GraphLabCompute(options, graphLabResultsCtrl) {

  this._scope = options.scope;
  /* Create local and remote computers */
  this._localComp = new LocalComputer(options,graphLabResultsCtrl);
  this._remoteComp = new RemoteComputer(options, graphLabResultsCtrl);
  this._dialog = options.dialog;

}

GraphLabCompute.prototype.init = function () {
  /* bind function */
  this._scope.openDialog = this.openDialog.bind(this);
  /* set empty algorithms */
  this._scope.algorithms = {};
};

GraphLabCompute.prototype.openDialog = function (algo) {

  var self = this;

  self._dialog.show({
    controller: function ($scope, $mdDialog) {

      var selectedIndex = null;

      /* set the information object */
      $scope.algo = algo;
      /* set the local schema */
      $scope.localSchema = {
        type: "object",
        properties: algo.localSchema || {}
      };
      $scope.remoteSchema = {
        type: "object",
        properties: algo.remoteSchema || {}
      };
      $scope.form = ["*"];
      $scope.model = {};
      $scope.$watch('selectedIndex', function (idx) {
        console.log(idx);
        selectedIndex = idx;
      });
      /* present flags */
      $scope.remotePresent = algo.remoteSchema;
      $scope.localPresent = algo.localSchema;

      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        if (answer) {
          switch (selectedIndex) {
            case 0:
              self._localComp.compute(algo.label, algo.fn, $scope.model);
              break;
            case 1:
              self._remoteComp.compute(algo.label, algo.fn, $scope.model);
              break;
          }
        }
        $mdDialog.hide();
      };
    },
    templateUrl: 'views/tab.graphLab.compute.dialog.tpl.html',
    parent: angular.element(document.body),
    clickOutsideToClose: true
  })

};


GraphLabCompute.prototype.setAlgorithms = function (collection) {
  this._scope.algorithms = collection;
};

GraphLabCompute.prototype.getLocalComputer = function () {
  return this._localComp;
};

GraphLabCompute.prototype.getRemoteComputer = function () {
  return this._remoteComp;
};
