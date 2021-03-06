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
  /* Create Driver Connectors */
  this._inConn = new InternalConnection({host: document.location.hostname});
  this._exConn = new Trueno({host: document.location.hostname});

  /* create global graph persistence object */
  window.graphPersistence = new GraphPersistence({exConn:this._exConn });

  /* Get the App Module */
  var panel = angular.module("webConsole", ["chart.js", 'ngMaterial', 'ui.ace', 'md.data.table', 'jsonFormatter', 'blockUI', 'schemaForm','toastr','hljs']);
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

  /* the block ui config */
  panel.config(function (blockUIConfig) {

    blockUIConfig.templateUrl = '../views/page.blockui.tpl.html';
    blockUIConfig.delay = 0;
  });

  /* configure toaster */
  panel.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
      allowHtml: true,
      timeOut: 5000,
      tapToDismiss: false,
      toastClass: 'toast'
    });
  });

  /* Eliminating blue and blue colors */
  Chart.defaults.global.colours = Chart.defaults.global.colours.splice(2);

  /* Initialize app(global) controller */
  panel.controller("AppCtrl",
    function ($scope, $timeout, $mdSidenav, blockUI) {
      /* start blocking the UI */
      //blockUI.start();
      /* unblock when finish loading after 2 seconds */
      //angular.element(document).ready(function () {
      //  blockUI.stop();
      //});
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
  panel.controller("monitorCtrl", ['$scope', '$sce',
    function ($scope, $sce) {
      self._monitorCtrl = new Monitor({scope: $scope, sce: $sce, wConsole: self});
      self._monitorCtrl.init();
      console.log('Monitor Controller Initialized');
    }]);
  /* Initialize Indexing controller */
  panel.controller("kpofCtrl", ['$scope', '$sce',
    function ($scope, $sce) {
      self._kpofCtrl = new Kpof({scope: $scope, sce: $sce, wConsole: self});
      self._kpofCtrl.init();
      console.log('Kpof Controller Initialized');
    }]);
  /* Initialize Indexing controller */
  panel.controller("sparkCtrl", ['$scope', '$sce',
    function ($scope, $sce) {
      self._sparkCtrl = new Spark({scope: $scope, sce: $sce, wConsole: self});
      self._sparkCtrl.init();
      console.log('Spark Controller Initialized');
    }]);
  /* Initialize admin controller */
  panel.controller("adminCtrl",
    function ($scope) {
      self._adminCtrl = new Sidebar({scope: $scope, wConsole: self});
      self._adminCtrl.init();
      console.log('Admin Controller Initialized');
    });
  /* Initialize graph lab controller */
  panel.controller("grapLabCtrl",
    function ($scope, JSONFormatterConfig, $mdDialog, toastr) {
      self._graphLabCtrl = new GraphLab({
        scope: $scope,
        jsonFormatter: JSONFormatterConfig,
        dialog: $mdDialog,
        toast: toastr,
        exConn: self._exConn,
        wConsole: self
      });
      self._graphLabCtrl.init();
      console.log('Graph Lab Controller Initialized');
    });

  /* Create Internal Connector */
  this._inConn.connect(function (s) {
    /* Connected with id */
    console.log('Connected to Internal API', s.id);
    /* Get current connected instance status */
    self._inConn.getClusterStatus()
    .then(function (results) {
      console.log(results);
    });

  }, function (s) {
    /* Disconnected */
    console.log('Disconnected from Internal API', s.id);
  });

  /* Create External Connector */
  this._exConn.connect(function (s) {

    /* Connected with id */
    console.log('Connected to External API', s.id);

    /* fetch graphs */
    graphPersistence.getGraphs().then((result) => {
      /* set graphs */
      self._graphLabCtrl.setGraphs(result);
    }, (error) => {
      console.log("Error: Could not fetch Graph g info", error);
    });

    /* Get the compute of the algorithm */
    graphPersistence.getAlgorithms().then((algorithms)=> {
      /* set the algorithms */
      self._graphLabCtrl.setAlgorithms(algorithms.result);
    });


  }, function (s) {
    /* Disconnected */
    console.log('Disconnected from External API', s.id);
  });

};

/* Instantiating app */
var wConsole = new webConsole();
/* Init angular-material components then connect to backend */
wConsole.init();

