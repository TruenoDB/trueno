"use strict";

/**
 * @author Victor O. Santos Uceta
 * Setup the TruenoDB components and initialize everything.
 * @see core/trueno
 */

let cli = require('commander');
let pkg = require("../package.json");

cli._name = "$ trueno setup";
cli.version(pkg.version)
.option('-b, --backend <backend>', 'The storage backend, options: cassandra or scylladb. Default: cassandra', /^(cassandra|scylladb)$/i)
.parse(process.argv);