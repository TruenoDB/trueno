"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database component downloader.
 * @module lib/core/initialize/component_downloader
 * @see module:lib/core/initialize/init
 */

/** Import modules */
const Download = require('download');
const ProgressBar = require('progress');
const shell = require('shelljs');
const YAML = require('yamljs');
/* Loading YAML configuration file */
let Components = YAML.load(__dirname + '/../../../conf/trueno-component-sources.yaml');

/** Description of the class */
class ComponentDownloader {

  /**
   * Create a component downloader object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {
    /* Get all component names */
    this._components = Object.keys(Components);
    this._compCount = this._components.length;
    /* shuffle link arrays */
    for (var k in Components) {
      this._shuffle(Components[k].links);
    }
  }

  /**
   * Start the download process.
   */
  start() {
    /* this object reference */
    var self = this;
    /* Cleaning directory first */
    logger.info('Cleaning components directory...');
    /* Removing current binaries if exist */
    for (var k in Components) {
      shell.rm('-rf', __dirname + '/../binaries/' + Components[k].dir);
    }
    /* Logging start message */
    logger.info('Downloading Trueno Components... This may take a while.');
    /* Start all downloads */
    return new Promise((resolve, reject) => {
      self.download(self._components.shift(), resolve);
    });
  }


  /**
   * Download the next component.
   * @param {string} comp - String with the component property name in the Components object.
   */
  download(cmp, resolve) {
    /* This instance object reference */
    var self = this;
    /* Getting this components object */
    var compObj = Components[cmp];
    /* set the download number */
    compObj.num = this._compCount - this._components.length;
    /* get download url */
    var url = compObj.links.shift();
    /* Starting the download and bind functions */
    var strm = require('download')(url, __dirname + '/../binaries/' + compObj.dir, {extract: true});

    /* When download is complete, fire this event */
    strm.then(()=> {
      /* Normalize directory */
      self._normalizeDir(compObj.dir);
      /* Start next downloads */
      if (self._components.length > 0) {
        self.download(self._components.shift(), resolve);
      } else {
        logger.info('All components downloaded.');
        resolve();
      }
    }, (err)=> {
      /* Logging error message */
      logger.info('Failed to download ' + compObj.name + ' from ' + url);
      logger.info(err);
      /* If more links available, try, otherwise halt */
      if (compObj.links.length > 0) {
        logger.info('Trying alternate source.');
        self.download(cmp, resolve);
      } else {
        logger.error('Unable to download the' + compObj.name + ' component, setup is will halt...');
      }
    });
    /* When the response arrives, bind the progress bar */
    strm.on('response', this._response.bind(compObj));
  }

  /**
   * Download request callback response function.
   * @param {object} res - The download response object.
   */
  _response(res) {

    var len = parseInt(res.headers['content-length'], 10);
    var desc = this.name + ' ' + this.version;

    /* Instantiate progress bar */
    var bar = new ProgressBar(this.num + '/' + Object.keys(Components).length + ')  Downloading ' + desc + ' [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: len
    });

    /* Binding data event */
    res.on('data', function (chunk) {
      bar.tick(chunk.length);
    });
  }

  /**
   * Normalizes component directory, move everything one level and deletes empty decompressed folder.
   * @param {string} cmpDir - The component directory.
   */
  _normalizeDir(cmpDir) {
    let unCompressDirName = shell.ls(__dirname + '/../binaries/' + cmpDir)[0];
    shell.mv(__dirname + '/../binaries/' + cmpDir + '/*/*', __dirname + '/../binaries/' + cmpDir + '/');
    shell.rm('-rf', __dirname + '/../binaries/' + cmpDir + '/' + unCompressDirName);
  }

  /**
   * Shuffles incoming array.
   * @param {array} array - The array to be shuffle.
   */
  _shuffle(array) {
    var i = 0
      , j = 0
      , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }

}

/* exporting the module */
module.exports = ComponentDownloader;
