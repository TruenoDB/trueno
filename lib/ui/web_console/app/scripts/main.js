'use strict';

/*
 */
function webConsole() {

  this._inConn = null;
  this._exConn = null;
  this._appCtrl = null;
  this._sidebarCtrl = null;
  this._monitorCtrl = null;
  this._graphLabCtrl = null;
  this._adminCtrl = null;
}
/*
 */
webConsole.prototype.init = function () {

  /* Keeping this object reference scope*/
  var self = this;
  /* Create Driver Connector */
  this._inConn = new Trueno.InternalConnection();
  this._exConn = new Trueno.ExternalConnection();

  /* Get the App Module */
  var panel = angular.module("webConsole", ["chart.js", 'ngMaterial', 'ui.ace', 'md.data.table','jsonFormatter']);
  /* Setting up theme */
  panel.config(function ($mdThemingProvider) {
    /* Settting theme palette */
    $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('orange');
  });

  /* Setting default icon set */
  panel.config(function ($mdIconProvider) {
    $mdIconProvider
    .defaultIconSet('../images/icons/mdi.svg');
  });

  /* Eliminating blue and blue colors */
  Chart.defaults.global.colours = Chart.defaults.global.colours.splice(2);

  /* Initialize app(global) controller */
  panel.controller("AppCtrl",
    function ($scope, $timeout, $mdSidenav) {
      self._appCtrl = new App({scope: $scope, timeout: $timeout, mdSidenav: $mdSidenav, wConsole: self});
      self._appCtrl.init();
    });
  /* Initialize sidebar controller */
  panel.controller("leftSidebarCtrl",
    function ($scope) {
      self._sidebarCtrl = new Sidebar({scope: $scope, wConsole: self});
      self._sidebarCtrl.init();
      console.log('Left Sidebar Controller Initialized');
    });
  /* Initialize monitor controller */
  panel.controller("monitorCtrl",
    function ($scope) {
      self._monitorCtrl = new Monitor({scope: $scope, wConsole: self});
      self._monitorCtrl.init();
      console.log('Monitor Controller Initialized');
    });
  /* Initialize graph lab controller */
  panel.controller("grapLabCtrl",
    function ($scope) {
      self._graphLabCtrl = new GraphLab({scope: $scope, wConsole: self});
      self._graphLabCtrl.init();
      console.log('Graph Lab Controller Initialized');
    });
  /* Initialize admin controller */
  panel.controller("adminCtrl",
    function ($scope) {
      self._adminCtrl = new Sidebar({scope: $scope, wConsole: self});
      self._adminCtrl.init();
      console.log('Admin Controller Initialized');
    });

  /* Create Internal Connector */
  this._inConn.connect(function (s) {
    /* Connected with id */
    console.log('Connected to Internal API', s.id);
    /* Get current connected instance status */
    self._inConn.getClusterStatus()
    .then(self._monitorCtrl.setClusterStatus.bind(self._monitorCtrl));

  }, function (s) {
    /* Disconnected */
    console.log('Disconnected from Internal API', s.id);
  });

  /* Create External Connector */
  this._exConn.connect(function (s) {
    /* Connected with id */
    console.log('Connected to External API', s.id);
  }, function (s) {
    /* Disconnected */
    console.log('Disconnected from External API', s.id);
  });

};

/* Instantiating app */
var wConsole = new webConsole();
/* Init angular-material components then connect to backend */
wConsole.init();

