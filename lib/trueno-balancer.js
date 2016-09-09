"use strict";

/**
 * @author Victor O. Santos Uceta
 * Starts the TruenoDB instance or cluster.
 * @see core/trueno
 */

let cli = require('commander');
let fs = require('fs');
let pkg = require('../package.json');
let Init = require('./core/initialize/init');
let config = require('./balancer/config.json');
const spawn = require('child_process').spawn;

cli._name = "$ trueno balancer";

cli.version(pkg.version)
.option('--start <config>', 'Start the balancer with he JSON file containing the balancer configuration')
.option('--stop', 'Stop running load balancers')
.option('--list', 'List running load balancers')
.option('--generate <path>', 'Generate configuration template file to the desired path')
.parse(process.argv);

if (cli.generate) {
  fs.writeFile(cli.generate + '/balancerConfig.json', JSON.stringify(config, null, 2), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Configuration template saved to " + cli.generate + '/balancerConfig.json');
    }
  });
} else if (cli.start || cli.stop || cli.list) {

  let child;
  if(cli.start){
    child = spawn('node', [__dirname + '/../node_modules/loadbalancer/bin/cli.js','start', '--config', cli.start]);
  } else if(cli.list){
    child = spawn('node', [__dirname + '/../node_modules/loadbalancer/bin/cli.js','list']);
  }else{
    child = spawn('node', [__dirname + '/../node_modules/loadbalancer/bin/cli.js','stop']);
  }

  child.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  child.stderr.on('data', function(data) {
    console.log(data.toString());
  });

}else{
  console.log("Error: You must choose one option: start with configuration file, template generation, or stop the balancers");
}