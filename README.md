<p align="left">
  <img height="75" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/truenoDB.png">
</p>

----------

## WARNING
<b >THIS PROJECT IS UNDER HEAVY DEVELOPMENT AND ITS NOT PRODUCTION READY.</b>

>The Dynamic/Static Graph Distributed Database

<p align="center">
  <img height="300" src="https://raw.githubusercontent.com/TruenoDB/trueno/dev/assets/images/logo_medium.png">
</p>
[![Build Status](https://travis-ci.org/mastayoda/trueno.io.svg?branch=master)](https://travis-ci.org/mastayoda/trueno.io)[![npm version](https://badge.fury.io/js/trueno.io.svg)](http://badge.fury.io/js/trueno.io) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mastayoda/trueno.io) [![GitHub Stars](https://img.shields.io/github/stars/mastayoda/trueno.io.svg)](https://github.com/mastayoda/trueno.io) [![Supported Platforms](https://img.shields.io/badge/platforms-Chrome|Firefox|Opera|Node.js-orange.svg)](https://github.com/mastayoda/trueno.io)

[![NPM](https://nodei.co/npm/trueno.io.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/trueno.io/)

## Install

```sh
$ npm install -g trueno
```


## usage

```sh
  Usage: trueno <cmd>


  Commands:

    supervisor [flags..]  Launch the Trueno.io Supervisor
    sandbox [flags..]     Launch a Trueno.io Sandbox
    console [flags..]     Launch the Trueno.io Console in a local web-app or command line interface
    provider [flags..]    Launch a Trueno.io Data Provider
    tools [flags..]       Launch the Trueno.io Tools command line interface
    help [cmd]            display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Example:

    $trueno supervisor
```
## usage: Console

```sh
  Usage: trueno console [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -a, --address <string>  The target Server address(IP or URI), default: global.trueno.io
    -p, --port <number>     The target Server listening port, default: 8000
    -w, --web               Start the Console in localhost web app, port: 8002
    -v, --verbose           Start the Server in verbose mode, i.e. all debbuging outputs will be printed to console
```
## usage: Supervisor

```sh
  Usage: trueno supervisor [options]

  Options:

    -h, --help                      output usage information
    -V, --version                   output the version number
    -a, --address <string>          The Supervisor binding address(IP or URI), default: global.trueno.io
    -p, --port <number>             The Supervisor listening port, default: 8000
    -m, --max-connections <number>  The maximun number of connections to this Supervisor, default: unlimited
    -w, --workers <number>          Number of Supervisor workers instances, by default: 1
    -v, --verbose                   Start the Supervisor in verbose mode, i.e. all debbuging outputs will be printed to console
```
## usage: Sandbox

```sh
  Usage: trueno sandbox [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -a, --address <string>   The target Server address(IP or URI), default: global.trueno.io
    -p, --port <number>      The target Server listening port, default: 8000
    -w, --workers <number>   Number of Sandbox workers instances, by default: 1
    -m, --max-jobs <number>  The maximun numbers of jobs running concurrently inside a worker, default: 1
    -s, --secure <boolean>   Setup provider connection via secure socket, default: false
    --web                    Start sandbox in web mode, the target server port will be used as web server port.
    -v, --verbose            Start the Server in verbose mode, i.e. all debbuging outputs will be printed to console
```
## usage: Provider

```sh
  Usage: trueno provider [options]

  Options:

    -h, --help                      output usage information
    -V, --version                   output the version number
    -a, --address <string>          The Provider binding address(IP or URI), default: global.trueno.io
    -p, --port <number>             The Provider listening port, default: 8000
    -m, --max-connections <number>  The maximun number of connections to this Provider, default: unlimited
    -w, --workers <number>          Number of Provider workers instances, by default: 1
    -v, --verbose                   Start the Server in verbose mode, i.e. all debbuging outputs will be printed to console
```

 © [Victor O. Santos, Servio Palacios, Edgardo Barsallo, Miguel Rivera, Aswin Siva, Venkata Subramanya, Peng Hao, Chih-Hao Fang, Ananth Grama](https://github.com/TruenoDB)
