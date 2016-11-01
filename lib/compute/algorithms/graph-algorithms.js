/**
 * Created by: victor on 10/30/16.
 * Source: .js
 * Author: Victor, Servio
 * Description:
 *
 */

module.exports = Object.freeze({
  "Link Analysis": [{
    "fn": "pagerank",
    "label": "PageRank",
    "desc": "Computes a ranking of the nodes in the graph G based on the structure of the incoming links. It was originally designed as an algorithm to rank web pages.",
    "rules": {
      "localComputation": false,
      "remoteComputation": true,
      "directed": true,
      "weighted": false
    },
    "remoteSchema": {
      "alpha": {
        type: 'number',
        default: 0.85
      },
      "tolerance": {
        type: 'number',
        default: 0.001
      }
    }
  }],
  "Cluster": [
    {
      "fn": "averageClustering",
      "label": "Average Clustering",
      "desc": "Compute the average clustering coefficient for the graph G.",
      "rules": {
        "localComputation": true,
        "remoteComputation": false,
        "directed": true,
        "weighted": true
      },
      "localSchema": {}
    }, {
      "fn": "clustering",
      "label": "Clustering",
      "desc": "Compute the clustering coefficient for nodes.",
      "rules": {
        "localComputation": true,
        "remoteComputation": false,
        "directed": true,
        "weighted": true
      },
      "localSchema": {}
    }, {
      "fn": "squareClustering",
      "label": "Square Clustering",
      "desc": "Compute the squares clustering coefficient for nodes.",
      "rules": {
        "localComputation": true,
        "remoteComputation": false,
        "directed": true,
        "weighted": true
      },
      "localSchema": {}
    }, {
      "fn": "transitivity",
      "label": "Transitivity",
      "desc": "Compute graph transitivity, the fraction of all possible triangles present in G.",
      "rules": {
        "localComputation": true,
        "remoteComputation": false,
        "directed": true,
        "weighted": true
      },
      "localSchema": {}
    },
    {
      "fn": "triangles",
      "label": "Triangles",
      "desc": "Compute the number of triangles.",
      "rules": {
        "localComputation": true,
        "remoteComputation": true,
        "directed": false,
        "weighted": false
      },
      "localSchema": {}
    }],
});

