"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: graph-lab-compute.js
 * Author: victor
 * Description:
 *
 */

function GraphLabCompute(options) {

  this._scope = options.scope;
  /* Create local and remote computers */
  this._localComp = new LocalComputer();
  this._remoteComp = new RemoteComputer();
  this._dialog = options.dialog;

  console.log(options);
}

GraphLabCompute.prototype.init = function () {

  this._scope.algorithms = graphAlgorithms;
  /* bind funciton */
  this._scope.openDialog = this.openDialog.bind(this);
};

GraphLabCompute.prototype.openDialog = function (scope, algo) {

  var self = this;


  self._dialog.show({
    controller: function ($scope, $mdDialog) {

      $scope.schema = {
        type: "object",
        properties: {
          name: {type: "string", minLength: 2, title: "Name", description: "Name or alias"},
          title: {
            type: "string",
            enum: ['dr', 'jr', 'sir', 'mrs', 'mr', 'NaN', 'dj']
          }
        }
      };

      $scope.form = [
        "*"
      ];


      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    },
    templateUrl: 'views/tab.graphLab.compute.dialog.tpl.html',
    parent: angular.element(document.body),
    clickOutsideToClose: true
  })
  .then(function (answer) {
      console.log(answer);
  }, function () {

  });

};

GraphLabCompute.prototype.getLocalComputer = function () {
  return this._localComp;
};

GraphLabCompute.prototype.getRemoteComputer = function () {
  return this._remoteComp;
};
