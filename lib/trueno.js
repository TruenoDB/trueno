#!/usr/bin/env node
"use strict";

/**
 * @author Victor O. Santos Uceta
 * Entry point of the CLI. This executes all principal commands.
 */

let cli = require('commander');
let pkg = require("../package.json");

cli.version(pkg.version)
.usage("<cmd>")
.command('start    [flags..]', 'Launch Trueno')
.command('stop     [flags..]', 'Stop Trueno')
.command('setup    [flags..]', 'Setup Trueno(download and setup all components')
.command('console  [flags..]', 'Launch the Trueno administrative CLI console and traversal REPL')
.command('balancer [flags..]', 'Start Trueno load balancer')
.command('tools    [flags..]', 'Run one of the Trueno tools')
.on('--help', function () {
  console.log('  Example:');
  console.log('');
  console.log('    $ trueno start');
  console.log('');
})
.parse(process.argv);
