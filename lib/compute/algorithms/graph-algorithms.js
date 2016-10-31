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
    "tmplUrl": null,
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
      "fn": "triangles",
      "label": "Triangles",
      "desc": "Compute the number of triangles.",
      "tmplUrl": null,
      "rules": {
        "localComputation": true,
        "remoteComputation": true,
        "directed": false,
        "weighted": false
      },
      "remoteSchema": {},
      "localSchema": {}
    }],
});

