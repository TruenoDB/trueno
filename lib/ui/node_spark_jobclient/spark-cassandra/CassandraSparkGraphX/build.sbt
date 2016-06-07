name := "CassandraSparkGraphX"

version := "1.0"

scalaVersion := "2.11.8"


libraryDependencies += "com.datastax.spark" %% "spark-cassandra-connector" % "1.6.0-M2"
libraryDependencies += "org.apache.spark" % "spark-core_2.11" % "1.6.1"
libraryDependencies += "org.apache.spark" % "spark-sql_2.11" % "1.6.1"
libraryDependencies += "org.apache.spark" % "spark-graphx_2.11" % "1.6.1"


