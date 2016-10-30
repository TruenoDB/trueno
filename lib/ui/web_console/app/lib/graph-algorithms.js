/**
 * Created by: victor on 7/1/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

window.graphAlgorithms = {
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
    "remoteForm":{
      "alpha":{
        type:'number',
        default: 0.85
      },
      "tolerance":{
        type:'number',
        default: 0.001
      }
    },
    "localForm":{
      "alpha":{
        type:'number',
        default: 0.85
      },
      "tolerance":{
        type:'number',
        default: 0.001
      }
    }
  }],
  "Cluster": [
  //  {
  //  "fn": "averageClustering",
  //  "label": "Average Clustering",
  //  "desc": "Compute the average clustering coefficient for the graph G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "clustering",
  //  "label": "Clustering",
  //  "desc": "Compute the clustering coefficient for nodes.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "squareClustering",
  //  "label": "Square Clustering",
  //  "desc": "Compute the squares clustering coefficient for nodes.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "transitivity",
  //  "label": "Transitivity",
  //  "desc": "Compute graph transitivity, the fraction of all possible triangles present in G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //},
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
    }
  }],
  //"Centrality": [{
  //  "fn": "betweennessCentrality",
  //  "label": "Betweenness Centrality",
  //  "desc": "Compute the shortest-path betweenness centrality for nodes.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "edgeBetweennessCentrality",
  //  "label": "Edge Betweenness Centrality",
  //  "desc": "Compute betweenness centrality for edges.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "eigenvectorCentrality",
  //  "label": "Eigen vector Centrality",
  //  "desc": "Compute the eigenvector centrality for G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}],
  //"Clique": [{
  //  "fn": "findCliques",
  //  "label": "Find Cliques",
  //  "desc": "Search for all maximal cliques in a graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "findCliquesRecursive",
  //  "label": "Find Cliques Recursive",
  //  "desc": "Recursive search for all maximal cliques in a graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "graphCliqueNumber",
  //  "label": "Graph Clique Number",
  //  "desc": "Return the clique number (size of the largest clique) for G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "graphNumberOfCliques",
  //  "label": "Graph Number Of Cliques",
  //  "desc": "Returns the number of maximal cliques in G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "numberOfCliques",
  //  "label": "Number Of Cliques",
  //  "desc": "Returns the number of maximal cliques for each node.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}],
  //"DAG": [{
  //  "fn": "isAperiodic",
  //  "label": "Is Aperiodic?",
  //  "desc": "Return true if G is aperiodic.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "isDirectedAcyclicGraph",
  //  "label": "Is Directed Acyclic Graph?",
  //  "desc": "Determines if G is a directed acyclic graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "topologicalSort",
  //  "label": "Topological Sort",
  //  "desc": "Return a list of nodes in topological sort order.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "topologicalSortRecursive",
  //  "label": "Topological Sort Recursive",
  //  "desc": "Return a list of nodes in topological sort order.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}],
  //"Graphical": [{
  //  "fn": "isGraphical",
  //  "label": "Is Graphical?",
  //  "desc": "Returns true if sequence is a valid degree sequence.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "isValidDegreeSequence",
  //  "label": "Is Valid Degree Sequence?",
  //  "desc": "Returns true if degreeSequence can be realized by a simple graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "isValidDegreeSequenceErdosGallai",
  //  "label": "Is Valid Degree Sequence(Erdos Gallai)?",
  //  "desc": "Returns true if degreeSequence can be realized by a simple graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "isValidDegreeSequenceHavelHakimi",
  //  "label": "Is Valid Degree Sequence(Havel Hakimi)?",
  //  "desc": "Returns true if degreeSequence cam be realized by a simple graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}],
  //"Isomorphism": [{
  //  "fn": "couldBeIsomorphic",
  //  "label": "Could Be Isomorphic",
  //  "desc": "Returns false if graphs are definitely not isomorphic.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "fastCouldBeIsomorphic",
  //  "label": "Fast Could Be Isomorphic",
  //  "desc": "Returns false if graphs are definitely not isomorphic.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "fasterCouldBeIsomorphic",
  //  "label": "Faster Could Be Isomorphic",
  //  "desc": "Returns false if graphs are definitely not isomorphic.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}],
  //"Operators": [{
  //  "fn": "compose",
  //  "label": "Compose",
  //  "desc": "Return a new graph of G composed with H.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "difference",
  //  "label": "Difference",
  //  "desc": "Return a new graph that contains the edges that exist in G but not in H.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "disjointUnion",
  //  "label": "DisjointUnion",
  //  "desc": "Return the disjoint union of graphs G and H.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "intersection",
  //  "label": "Intersection",
  //  "desc": "Return a new graph that contains only edges that exist in both G and H.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "symmetricDifference",
  //  "label": "Symmetric Difference",
  //  "desc": "Return new graph with edges that exit in either G or H but not both.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "union",
  //  "label": "Union",
  //  "desc": "Return the union of graphs G and H.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}],
  //"Shortest Path": [{
  //  "fn": "hasPath",
  //  "label": "Has Path(Generic)",
  //  "desc": "Determines if the graph has a path.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "shortestPath",
  //  "label": "Shortest Path(Generic)",
  //  "desc": "Compute shortest paths in the graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "shortestPathLength",
  //  "label": "Shortest Path Length(Generic)",
  //  "desc": "Compute shortest path lengths in the graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "allPairsShortestPath",
  //  "label": "All Pairs Shortest Path(Unweighted)",
  //  "desc": "Compute shortest paths between all nodes.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "allPairsShortestPathLength",
  //  "label": "All Pairs Shortest Path Length(Unweighted)",
  //  "desc": "Compute the shortest path lengths between all nodes in G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "bidirectionalShortestPath",
  //  "label": "Bidirectional Shortest Path(Unweighted)",
  //  "desc": "Return a list of nodes in a shortest path between source and target.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "predecessor",
  //  "label": "Predecessor(Unweighted)",
  //  "desc": "Returns a map of predecessors for the path from source to all nodes in G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "singleSourceShortestPath",
  //  "label": "Single Source Shortest Path(Unweighted)",
  //  "desc": "Compute shortest path between source and all other nodes reachable from source.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "singleSourceShortestPathLength",
  //  "label": "Single Source Shortest Path Length(Unweighted)",
  //  "desc": "Compute the shortest path lengths from source to all reachable nodes.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "allPairsDijkstraPath",
  //  "label": "All Pairs Dijkstra Path(Weighted)",
  //  "desc": "Compute shortest paths between all nodes in a weighted graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "allPairsDijkstraPathLength",
  //  "label": "All Pairs Dijkstra Path Length(Weighted)",
  //  "desc": "Compute shortest path lengths between all nodes in a weighted graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "dijkstraPath",
  //  "label": "Dijkstra Path(Weighted)",
  //  "desc": "Returns the shortest path from source to target in a weighted graph G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "dijkstraPathLength",
  //  "label": "Dijkstra Path Length(Weighted)",
  //  "desc": "Returns the shortest path length from source to target in a weighted graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "singleSourceDijkstra",
  //  "label": "Single Source Dijkstra(Weighted)",
  //  "desc": "Compute shortest paths and lengths in a weighted graph G.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "singleSourceDijkstraPath",
  //  "label": "Single Source Dijkstra Path(Weighted)",
  //  "desc": "Compute shortest path between source and all other reachable nodes for a weighted graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}, {
  //  "fn": "singleSourceDijkstraPathLength",
  //  "label": "Single Source Dijkstra Path Length(Weighted)",
  //  "desc": "Compute the shortest path length between source and all other reachable nodes for a weighted graph.",
  //  "tmplUrl": null,
  //  "rules": {
  //    "localComputation": true,
  //    "remoteComputation": false,
  //    "directed": true,
  //    "weighted": true
  //  }
  //}
  //]
};

/* Freezing the object */
Object.freeze(window.graphAlgorithms);