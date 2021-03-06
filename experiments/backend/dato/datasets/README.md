# Datasets


## Wikipedia Talk network
|File | Source |
| --- | --- |
| [`wiki-Talk.txt`](https://snap.stanford.edu/data/wiki-Talk.txt.gz) | [Stanford Network Analysis Project](https://snap.stanford.edu/data/wiki-Talk.html) |

Stats:

 * Nodes: 	2394385
 * Edges: 	5021410

To get the vertices set, data can be parsed using awk and sort unix commands. For example, to separate columns execute

```
awk 'FNR > 4 {print $1; print $2}' wiki-Talk.txt > test
```

Then sort the data and eliminate the duplicates using:
```
sort -u -k1 -n test > test-2
```

Dump data to import to C* can be generated using the python parsers, and then import using the `COPY` command from cqlsh. 


## Gnutella peer-to-peer network, August 8 2002
|File | Source |
| --- | --- |
| [`p2p-Gnutella08.txt`](https://snap.stanford.edu/data/p2p-Gnutella08.txt.gz) | [Stanford Network Analysis Project](https://snap.stanford.edu/data/p2p-Gnutella08.html) |

Stats:

 * Nodes: 	6301
 * Edges: 	20777

Notes (importing data):

 * Uncompress `p2p-Gnutella08.zip`, which contain 2 files: `p2p-vertices.txt` and `p2p-edges.txt`
 * Create database structure, on Cassandra, using scripts on `dato/creo.cql`.
 * Load data in Cassandra using `COPY` command (from cqlsh):

```
COPY vertices from '/path/to/p2p-vertices.txt'
COPY edges from '/path/to/p2p-edges.txt'
```

## Graph of Gods
|File | Source |
| --- | --- |
| `GraphOfTheGods.cql` | Titan:db |

Stats:

 * Nodes: 	12
 * Edges: 	17

Data is organized as a set of `INSERT` commands.
