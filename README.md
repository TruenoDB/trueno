<p align="left">
  <img height="75" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/truenoDB.png">
</p>

----------

## WARNING
<b>THIS PROJECT IS UNDER HEAVY DEVELOPMENT AND ITS NOT PRODUCTION READY.</b>

>The Dynamic/Static Graph Distributed Database

> **Features:**

> - Distributed, resilient, and fast dynamic and static **graph database**.
> - Support distributed computation.
> - Online queries and traversal.
> - Scalable to billions of nodes and edges.
> - Easy setup for both cluster and single instance installations.
> - User friendly and intuitive interface for graph analysis, fast algorithm processing and visualization.
> - Designed for Data Mining and Machine Learning.

<p align="center">
  <img height="300" src="https://raw.githubusercontent.com/TruenoDB/trueno/dev/assets/images/logo_medium.png">
</p>

[![Build Status](https://travis-ci.org/mastayoda/trueno.io.svg?branch=master)](https://travis-ci.org/mastayoda/trueno.io)[![npm version](https://badge.fury.io/js/trueno.io.svg)](http://badge.fury.io/js/trueno.io) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mastayoda/trueno.io) [![GitHub Stars](https://img.shields.io/github/stars/mastayoda/trueno.io.svg)](https://github.com/mastayoda/trueno.io) [![Supported Platforms](https://img.shields.io/badge/platforms-Chrome|Firefox|Opera|Node.js-orange.svg)](https://github.com/mastayoda/trueno.io)

[![NPM](https://nodei.co/npm/trueno.io.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/trueno.io/)

## Building blocks:

<p align="center">
  <img height="300" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/building_blocks.png">
</p>

## Workflow with **TruenoDB**

<p align="center">
  <img height="200" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/workflow.png">
</p>

## Architecture

<p align="center">
  <img height="400" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/architecture.png">
</p>

> **Components:**

> - **Gremlin (Apache Tinkerpop)**: A graph traversal language for intuitive and easy graph analysis.
> - **Web Console**: Web Interface for graph processing, analytics, visualization, and database management. Data laboratory that connects directly to the database/processing engine.
> - **TensorFlow**: Open Source Software Library for Machine Intelligence
> - **Trueno Core**: Database/Computational Engine Core.
> - **Apache Solr**: The popular, blazing-fast, open source enterprise search platform built on Apache Lucene™ used for vertices and edges properties indexing.
> - **Apache Spark**: a fast and general engine for large-scale data processing. Used for Distributed Graph Processing (GraphX).
> - **Scylla DB**: World's fastest NoSQL column store database. Fully compatible with Apache Cassandra[^cassandra] at 10x the throughput and low latency. Stores all graph structures.


##Roadmap to alpha version:

| Component                       | Percentage    |
| ------------------------------- | ------------- |
| Core                            |      30%      |
| Web Console                     |      30%           |
| Connectors                      |      20%           |
| Graph Compute Engine            |      20%           |
| Backend Storage                 |      20%           |
| Indexing                        |      10%           |
| Gremlin Tinkerpop Integration   |      20%           |

##TruenoDB Interface:

<p align="center">
  <img height="200" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/trueno_interface.png">
</p>






## Install

```sh
$ npm install -g trueno
```


###References:
 [^footn]: The **Apache Cassandra** database is the right choice when you need scalability and high availability without compromising performance.



 © [Victor O. Santos, Servio Palacios, Edgardo Barsallo, Miguel Rivera, Aswin Siva, Venkata Subramanya, Peng Hao, Chih-Hao Fang, Ananth Grama](https://github.com/TruenoDB)
