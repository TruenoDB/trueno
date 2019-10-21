
<img height="75" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/truenoDB.png" align="middle">
<img height="300" src="https://raw.githubusercontent.com/TruenoDB/trueno/dev/assets/images/logo_medium.png" align="middle">

----------
## Acknowledgments
<b>The work was partially supported by the National Science Foundation Grant number CCF 1533795, Division of Computing and Communication Foundations under the XPS program

----------

## WARNING
<b>THIS PROJECT IS UNDER HEAVY DEVELOPMENT AND ITS NOT PRODUCTION READY.</b>

>The Hybrid Graph Datastore/Computational Engine

<!-- [![Build Status](https://travis-ci.org/mastayoda/trueno.io.svg?branch=master)](https://travis-ci.org/mastayoda/trueno.io)-->
<!-- [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/TruenoDB/trueno)-->
[![npm version](https://badge.fury.io/js/trueno.io.svg)](http://badge.fury.io/js/trueno.io)
[![GitHub Stars](https://img.shields.io/github/stars/TruenoDB/trueno.svg)](https://github.com/TruenoDB/trueno)
[![Supported Platforms](https://img.shields.io/badge/platforms-Unix-orange.svg)](https://github.com/mastayoda/trueno.io)

[//]: [![NPM](https://nodei.co/npm/trueno.io.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/trueno.io/)

## Features

- Distributed, resilient, and fast dynamic and static **graph database**.
- Support distributed computation.
- Online queries and traversal.
- Scalable to billions of nodes and edges.
- Easy setup for both cluster and single instance installations.
- User friendly and intuitive interface for graph analysis, fast algorithm processing and visualization.
- Designed for Data Mining and Machine Learning.

## Building blocks:

<p align="center">
  <img height="300" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/trueno_components.png">
</p>

## Workflow with **TruenoDB**:

<p align="center">
  <img height="200" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/workflow.png">
</p>

## Architecture:

<p align="center">
  <img height="400" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/trueno_architecture_2.png">
</p>

> **Components:**

> 1. **Gremlin (Apache Tinkerpop)** [1]: A graph traversal language for intuitive and easy graph analysis.
> 2. **Web Console**: Web Interface for graph processing, analytics, visualization, and database management. Data laboratory that connects directly to the database/processing engine.
> 3. **Trueno Core**: Database/Computational Engine Core.
> 4. **Elasticsearch** [6]: Elasticsearch is a distributed, RESTful search and analytics engine capable of solving a growing number of use cases. Stores all graph structures.
> 5. **Apache Spark** [4]: a fast and general engine for large-scale data processing. Used for Distributed Graph Processing (GraphX [5]).


## Storage Schema:
* Each **Index** is a graph.
* **Distributed** workload and storage.
* **Data replication** to increase availability.
* **Data sharding** support for horizontal scaling.
* Support **multiple properties** for edges and vertices.
* **Analytic results** (built-in collection of algorithms) stored in graph structure for easier post-analysis.


## Roadmap to alpha version:

| Component                       | Percentage    |
| ------------------------------- | ------------- |
| Core                            |      90%      |
| Web Console                     |      70%      |
| Connectors                      |      40%      |
| Oblivious Computation           |      20%      |
| Graph Compute Engine            |      70%      |
| Backend Storage / Indexing      |      90%      |
| Gremlin Tinkerpop Integration   |      90%      |
| Dynamic Graphs                  |      10%      |
| Tensorflow Integration          |      05%      |

----------

<p align="center">
  <img height="500" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/trueno_laboratory.png">
</p>

> **TruenoDB Interface Features:**
> Trueno relies on a fast graph analytic/visualization UI.

> 1. Angular Material [8] Based.
> 2. Pure **WebSockets** [9], no slow HTTP requests.
> 3. **Sigma.js WebGL** [10] rendering for high scalability.
> 4. **Gremlin** [11] Language Traversal for graph retrieval.
> 5. XPath for graph component filtering.
> 6. Point, drag, click based functionality. No complex coding or preparation.
> 7. Export, Save, Import graphs.

----------


## Install

```sh
$ npm install -g trueno

```

### References:
 * [1] https://tinkerpop.apache.org/
 * [2] https://www.tensorflow.org/
 * [3] https://lucene.apache.org/solr/
 * [4] https://spark.apache.org/
 * [5] https://spark.apache.org/graphx/
 * [6] http://www.scylladb.com/
 * [7] https://cassandra.apache.org/
 * [8] https://material.angularjs.org/latest/
 * [9] https://www.websocket.org/aboutwebsocket.html
 * [10] http://sigmajs.org/
 * [11] https://github.com/tinkerpop/gremlin/wiki
 * [12] https://www.elastic.co/products/elasticsearch
 * [13] https://doi.org/10.1007/s11042-018-6940-2

 © [Victor O. Santos, Servio Palacios, Edgardo Barsallo, Miguel Rivera, Peng Hao, Chih-Hao Fang, Ananth Grama](https://github.com/TruenoDB)
