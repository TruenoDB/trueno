/**
 * Created by: victor on 6/21/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
var Download = require('download');
var ProgressBar = require('progress');

var strm = Download('http://apache.claz.org/incubator/tinkerpop/3.2.0-incubating/apache-gremlin-server-3.2.0-incubating-bin.zip','.',{extract: true});

strm.on('response', function(res){
  var len = parseInt(res.headers['content-length'], 10);

  console.log();
  var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: len
  });

  res.on('data', function (chunk) {
    bar.tick(chunk.length);
  });

  res.on('end', function () {
    console.log('\n');
  });
});