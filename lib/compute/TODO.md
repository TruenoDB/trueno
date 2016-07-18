#Compute TODO

**Please refer to https://github.com/TruenoDB/trueno-compute-server**

(There is a Spark Compute Server Algorithm's Generator.)

###Spark job Server
 * Distributed configuration
 * Installer
 * Complementary options
 
###Algorithms
 * [1] Include RDD Persistence API (Transformations **persist** **cache**)
 * [2] Organize data using Key/Value pairs (**Grouping and Sorting**, **Joins**)
 * [3] Understand Tuning and Partitioning, implement techniques on new algorithms
 * [4] There exist a way to **join** Cassandra tables using Spark/Cassandra connector (requires expensive shuffling)
 * [5] Test DataFrames and validate implementation on new algorithms.

###Implement well known algorithms (equivalent to NetworkX)
 * Clustering
 * Centrality
 * Closeness
 * Betweenness
 * Detect cycles
 * Components (Connectivity, Strong connectivity)
 * Find Cliques, K-Clique
 * Topological Sort
 * Trees
 * Shortest Paths
 * Professor Mehmet suggested algorithms
 
Notes:
* The idea is to enrich the current GraphX stack using Scala and Spark.
