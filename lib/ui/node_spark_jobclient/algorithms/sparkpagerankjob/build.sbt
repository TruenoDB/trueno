name := "sparkpagerankjob"

version := "1.0"

scalaVersion := "2.11.8"


resolvers += "Job Server Bintray" at "https://dl.bintray.com/spark-jobserver/maven"

libraryDependencies += "spark.jobserver" %% "job-server-api" % "0.6.2" % "provided"

libraryDependencies += "com.datastax.spark" %% "spark-cassandra-connector" % "1.6.0-M2"
libraryDependencies += "org.apache.spark" % "spark-core_2.11" % "1.6.1"
libraryDependencies += "org.apache.spark" % "spark-sql_2.11" % "1.6.1"
libraryDependencies += "org.apache.spark" % "spark-graphx_2.11" % "1.6.1"

