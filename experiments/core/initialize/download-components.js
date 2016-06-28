/**
 * Created by: victor on 6/21/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */
var shell = require('shelljs');

let unCompressDir = shell.ls(__dirname+'/../binaries/gremlin_server')[0];
shell.mv(__dirname+'/../binaries/gremlin_server/*/*', __dirname+'/../binaries/gremlin_server/');
shell.rm('-rf', __dirname+'/../binaries/gremlin_server/'+unCompressDir);

unCompressDir = ls(__dirname+'/../binaries/cassandra')[0];
shell.mv(__dirname+'/../binaries/cassandra/*/*', __dirname+'/../binaries/cassandra/');
shell.rm('-rf', __dirname+'/../binaries/cassandra/'+unCompressDir);

unCompressDir = ls(__dirname+'/../binaries/solr')[0];
shell.mv(__dirname+'/../binaries/solr/*/*', __dirname+'/../binaries/solr/');
shell.rm('-rf', __dirname+'/../binaries/solr/'+unCompressDir);

unCompressDir = ls(__dirname+'/../binaries/spark')[0];
shell.mv(__dirname+'/../binaries/spark/*/*', __dirname+'/../binaries/spark/');
shell.rm('-rf', __dirname+'/../binaries/spark/'+unCompressDir);