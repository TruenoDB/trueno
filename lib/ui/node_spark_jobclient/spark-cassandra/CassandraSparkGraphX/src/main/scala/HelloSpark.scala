/**
  * Created by Servio Palacios on 2016.05.18.
  */
import org.apache.spark.{SparkConf, SparkContext}

import com.datastax.spark.connector._
import org.apache.spark._
import org.apache.spark.graphx._
import org.apache.spark.rdd.RDD

object HelloSpark { def main(args:Array[String]): Unit = {
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

  // Run PageRank
  val ranks = graph.pageRank(0.0001).vertices

  // Print the result
  println(ranks.collect().mkString("\n"))

  //val graph: Graph[(String, String), String]
  // Constructed from above
  // Count all users which are postdocs
  graph.vertices.filter { case (id, (name, pos)) => pos == "postdoc" }.count

  // Count all the edges where src > dst
  graph.edges.filter(e => e.srcId > e.dstId).count

  val facts: RDD[String] =
    graph.triplets.map(triplet =>
      triplet.srcAttr._1 + " is the " + triplet.attr + " of " + triplet.dstAttr._1)
  facts.collect.foreach(println(_))

} }