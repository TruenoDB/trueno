#GraphX

##Test Data
```
http://webdatacommons.org/hyperlinkgraph/2012-08/download.html
```

```
Scala Sample Schema
CREATE KEYSPACE scala_api WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
CREATE TABLE scala_api.edges (id INT PRIMARY KEY, fromVertex INT, toVertex INT);
```

###References:
* https://spark.apache.org/docs/0.9.0/graphx-programming-guide.html
* [Fixing conversion errors] http://stackoverflow.com/questions/36938373/for-graphx-how-do-i-convert-an-array-of-object-to-an-array-of-edges
* http://stackoverflow.com/questions/37146816/spark-scala-graphx-shortest-path-between-two-vertices
* https://github.com/apache/spark/blob/master/graphx/src/main/scala/org/apache/spark/graphx/lib/ShortestPaths.scala
* http://stackoverflow.com/questions/35358055/how-to-convert-rddcassandrarow-to-listcassandrarow-in-scala-without-using-co
* https://docs.datastax.com/en/cql/3.0/cql/cql_reference/cql_data_types_c.html
