/**
  * Created by Servio Palacios on 2016.05.21.
  */

import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.graphx._
import org.apache.spark.graphx.lib.ShortestPaths
import org.apache.spark.rdd.RDD

//Idea taken from http://stackoverflow.com/questions/37146816/spark-scala-graphx-shortest-path-between-two-vertices

object ShortestPath { def main(args:Array[String]): Unit = {
  System.setProperty("spark.cassandra.query.retry.count", "1")

  val conf = new SparkConf(true)
                 .set("spark.cassandra.connection.host", "192.168.116.139")

  val sc = new SparkContext("local", "testingGraphX", conf)

  // Create an RDD for the vertices
  val users: RDD[(VertexId, (String, String))] =
    sc.parallelize(Array(
      (3L, ("rxin", "student")),
      (7L, ("jgonzal", "postdoc")),
      (5L, ("franklin", "prof")),
      (2L, ("istoica", "prof")))
    )
  // Create an RDD for edges
  val relationships: RDD[Edge[String]] =
    sc.parallelize(Array(
      Edge(3L, 7L, "collab"),
      Edge(5L, 3L, "advisor"),
      Edge(2L, 5L, "colleague"),
      Edge(5L, 7L, "pi")
    )
    )
  // Define a default user in case there are relationship with missing user
  val defaultUser = ("John Doe", "Missing")

  // Build the initial Graph
  val graph = Graph(users, relationships, defaultUser)

  val result = ShortestPaths.run(graph, Seq(7L))

  val shortestPath = result               // result is a graph
    .vertices                             // we get the vertices RDD
    .filter({case(vId, _) => vId == 2L})  // we filter to get only the shortest path from v1
    .first                                // there's only one value
    ._2                                   // the result is a tuple (v1, Map)
    .get(7L)                              // we get its shortest path to v2 as an Option object

  shortestPath.foreach(println(_))
} }



