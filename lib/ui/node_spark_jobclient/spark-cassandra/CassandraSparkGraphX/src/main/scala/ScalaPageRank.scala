/**
  * Created by Servio Palacios on 2016.05.18.
  */

import org.apache.spark.{SparkConf, SparkContext}

import com.datastax.spark.connector._

import org.apache.spark._
import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD

//class ScalaPageRank {

  object PageRankFromCassandra {
    def main(args:Array[String]): Unit = {
      System.setProperty("spark.cassandra.query.retry.count", "1")

      val conf = new SparkConf(true)
                     .set("spark.cassandra.connection.host", "192.168.116.139")
      // Load the edges as a graph

      val sc = new SparkContext("local", "testingGraphX", conf)

      //get table from keyspace and stored as rdd
      val vertexRDD1: RDD[(VertexId, String)] = sc.cassandraTable("scala_api", "vertices2")

      //val edges = sc.cassandraTable("scala_api", "edges").collect()
      val rowsCassandra: RDD[CassandraRow] = sc.cassandraTable("scala_api", "edges").select("fromvertex", "tovertex")
      val edgesRDD: RDD[Edge[Int]] = rowsCassandra.map(x =>
                                                            Edge(
                                                                x.getLong("fromvertex"),
                                                                x.getLong("tovertex")
                                                      ))

      //collect will dump the whole rdd data to driver node (here's our machine),
      //which may crush the machine. So take first 100 (for now we use small table,
      //I have to prevent memory problems, for now it's ok)
      val vertex_collect = vertexRDD1.collect().take(100)
      vertex_collect.foreach(println(_))

      edgesRDD.foreach(println(_))

      val vertexSet = VertexRDD(vertexRDD1)

      // Build the initial Graph
      val graph = Graph(vertexSet, edgesRDD)

      // Run PageRank
      val ranks = graph.pageRank(0.0001).vertices

      // Print the result
      println(ranks.collect().mkString("\n"))

  }

}
