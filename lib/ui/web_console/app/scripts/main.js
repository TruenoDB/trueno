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
  var panel = angular.module("webConsole", ["chart.js", 'ngMaterial', 'ui.ace']);
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

      $scope.aceLoaded = function (_editor) {
        _editor.setReadOnly(false);
        _editor.setFontSize('3vmin');
        _editor.renderer.setOption('showLineNumbers', false);
        _editor.setHighlightActiveLine(false);

        //var staticWordCompleter = {
        //  getCompletions: function (editor, session, pos, prefix, callback) {
        //    var wordList = ["g", "V", "E"];
        //    callback(null, wordList.map(function (word) {
        //      return {
        //        caption: word,
        //        value: word,
        //        meta: "static"
        //      };
        //    }));
        //  }
        //};
        //_editor.completers = [staticWordCompleter]

      };

      $scope.aceChanged = function (e) {

        /* Get the editor */
        var _editor = e[1];
        var lines = e[0].lines;

        if (lines.length > 1) {
          _editor.find(String.fromCharCode(10))
          _editor.replaceAll('');
          _editor.selection.clearSelection()
        }
      };

      $scope.$watch('selectedIndex', function (current, old) {
        console.log('selected tab: ', current);
      });

    });

  /* Initialize status controller */
  panel.controller("leftSidebarCtrl",
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

  panel.controller("monitorCtrl",
    function ($scope) {

      $scope.memmory = {};
      $scope.memmory.labels = ["Used", "Free"];
      $scope.memmory.data = [300, 500];
      $scope.memmory.type = 'Pie';
      $scope.toggle = function () {
        $scope.memmory.type = $scope.memmory.type === 'PolarArea' ?
          'Pie' : 'PolarArea';
      };


      $scope.cpu = {};
      $scope.cpu.options = {showXLabels: 10};
      $scope.cpu.labels = [60, "", "", "", "", 55, "", "", "", "", 50,
        "", "", "", "", 45, "", "", "", "", 40,
        "", "", "", "", 35, "", "", "", "", 30,
        "", "", "", "", 25, "", "", "", "", 20,
        "", "", "", "", 15, "", "", "", "", 10,
        "", "", "", 5, "", "", "", 1];
      $scope.cpu.series = ['Frequency'];
      $scope.cpu.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
    });

  panel.controller("grapLabCtrl",
    function ($scope) {
      $scope.userGraph = '';
      $scope.graphs = [
        'Friendster',
        'Facebook',
        'Protein H56',
      ];
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
  Object.keys(instances).forEach(function (k) {
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


