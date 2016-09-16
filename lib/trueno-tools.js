#!/usr/bin/env node
/**
 * Created by: victor on 5/12/16.
 * Source: trueno-start.js
 * Author: victor
 * Description:
 *
 */
'use strict';
let cli = require('commander');
let pkg = require("../package.json");

cli._name = "$ trueno tools";
cli.version(pkg.version)
.option('--status', 'Show the database processes status')
.parse(process.argv);