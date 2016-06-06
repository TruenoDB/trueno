'use strict';

/*
 */
function webConsole() {
  this._trueno = null;
}
/*
 */
webConsole.prototype._initAngular = function () {

  /* Keeping this reference */
  var self = this;

  /* Get the App Module */
  var panel = angular.module("webConsole", ["chart.js", 'ngMaterial']);

  /* Theming */
  panel.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('orange');
  });

  /* Eliminating blue and blue colors */
  Chart.defaults.global.colours = Chart.defaults.global.colours.splice(2);

  /* The global app controller */
  panel.controller("AppCtrl",
    function ($scope) {

      $scope.$watch('selectedIndex', function (current, old) {

        /* if timer is instantiated */
        if (self._specsTimer) {
          if (current == 0) {
            self._specsTimer.resume();
          }
          else {
            self._specsTimer.pause();
          }
        }
      });

    });

  /* Initialize the Components(sandbox, consoles, providers, etc) count controller */
  panel.controller("statusCtrl",
    function ($scope) {

      $scope.instanceCount = 0;
      $scope.graphsCount = 0;
      $scope.vertexCount = 0;
      $scope.edgeCount = 0;
      $scope.connectionCount = 0;
      $scope.coresCount = 0;
      $scope.freqCount = 0;
      $scope.memoryCount = 0;
      $scope.storageCount = 0;
      $scope.jobCount = 0;

    });

  /* Initialize the memory controller */
  panel.controller("memoryCtrl",
    function ($scope) {
      $scope.labels = ["Used", "Free"];
      $scope.data = [300, 500];
      $scope.type = 'Pie';

      $scope.toggle = function () {
        $scope.type = $scope.type === 'PolarArea' ?
          'Pie' : 'PolarArea';
      };
    });

  /* Initialize the CPU controller */
  panel.controller("cpuCtrl",
    function ($scope) {

      $scope.options = {showXLabels: 10};

      $scope.labels = [60, "", "", "", "", 55, "", "", "", "", 50,
        "", "", "", "", 45, "", "", "", "", 40,
        "", "", "", "", 35, "", "", "", "", 30,
        "", "", "", "", 25, "", "", "", "", 20,
        "", "", "", "", 15, "", "", "", "", 10,
        "", "", "", 5, "", "", "", 1];

      $scope.series = ['Frequency'];
      $scope.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
    });

  /* Initialize the CPU controller */
  panel.controller('filterComponentCtrl', function ($timeout, $q) {
    var self = this;
    // Lists of fruit names and Vegetable objects
    self.tags = [];
    self.selectedItem = null;
    self.searchText = null;
    self.selectedKeywords = [];
    self.keywords = [
      "==",
      "===",
      "\!=",
      "\!==",
      ">",
      "<",
      ">=",
      "<=",
      "&&",
      "\|\|",
      "\!"];

    var scope = angular.element(document.getElementById("mychip")).scope();
    console.log(scope);

    self.querySearch = function (query) {
      var results = query ? self.keywords.filter(createFilterFor(query)) : [];
      return results;
    };

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(keyword) {
        return (keyword.toLowerCase().indexOf(lowercaseQuery) === 0)
      };
    }

  });


}
/*
 */
webConsole.prototype._connect = function () {

  /* Keeping this reference */
  var self = this;

  /* Create Driver Connector */
  var trueno = new Trueno();

  trueno.connect(function (s) {

    /* Connected with id */
    console.log('connected', s.id);

    /* Get current connected instance status */
    trueno.getClusterStatus().then(self._getClusterStatusResponse.bind(self));

  }, function (s) {
    /* Disconnected */
    console.log('disconnected', s.id);

  });

  /* Assigning trueno connector instance */
  this._trueno = trueno;
}
/*
 */
webConsole.prototype._getInstanceStatusResponse = function (instance) {


};

webConsole.prototype._getClusterStatusResponse = function (instances) {

  var self = this;
  /* Status object */
  var statusObj = {
    instanceCount: 0,
    graphsCount: 0,
    vertexCount: 0,
    edgeCount: 0,
    connectionCount: 0,
    coresCount: 0,
    freqCount: 0,
    memoryCount: 0,
    storageCount: 0,
    jobCount: 0
  };

  /* For each instance, compute fields */
  Object.keys(instances).forEach(function(k){
    /* Agregating values */
    statusObj.instanceCount++;
    //statusObj.connectionCount += instances[k]._state.connections;
    statusObj.coresCount += instances[k]._metrics.cpu.cores;
    statusObj.freqCount += instances[k]._metrics.cpu.cores * instances[k]._metrics.cpu.speed;
    statusObj.memoryCount += instances[k]._metrics.totalmem;
    //statusObj.storageCount += instances[k]._metrics.storage;
    //statusObj.jobCount += instances[k]._state.jobCount;
  });

  console.log(instances);

  /* Get status scope */
  var scope = angular.element(document.getElementById("status")).scope();
  scope.$apply(function () {

    scope.instanceCount = statusObj.instanceCount;
    scope.graphsCount = statusObj.graphsCount;
    scope.vertexCount = statusObj.vertexCount;
    scope.edgeCount = statusObj.edgeCount;
    scope.connectionCount = statusObj.connectionCount;
    scope.coresCount = statusObj.coresCount;
    scope.freqCount = statusObj.freqCount;
    scope.memoryCount = statusObj.memoryCount;
    scope.storageCount = statusObj.storageCount;
    scope.jobCount = statusObj.jobCount;

  });

};

/*
 */
webConsole.prototype._updateSpecs = function (metrics) {

  /* Updating Memory */
  var scope = angular.element(document.getElementById("memory")).scope();
  scope.$apply(function () {

    scope.data[parseInt(metrics.rand * 100 % scope.data.length)] += metrics.rand * 1000;
    var totMem = scope.data[0] + scope.data[1];
    scope.usedSize = parseInt(scope.data[0]);
    scope.freeSize = parseInt(scope.data[1]);
    scope.used = parseInt((scope.data[0] / totMem) * 100);
    scope.free = parseInt((scope.data[1] / totMem) * 100);

  });

  /* Updating CPU */
  scope = angular.element(document.getElementById("cpu")).scope();
  scope.$apply(function () {

    scope.data[0].shift();
    scope.data[0].push(metrics.rand * 100);
  });
}

/* Instantiating app */
var wConsole = new webConsole();
/* Init angular-material components */
wConsole._initAngular();
/* Connect to DB instance */
wConsole._connect();


