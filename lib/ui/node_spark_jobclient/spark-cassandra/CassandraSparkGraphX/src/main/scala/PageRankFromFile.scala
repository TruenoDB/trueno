/**
  * Created by Servio Palacios on 2016.05.18.
  */

import org.apache.spark.{SparkConf, SparkContext}

import com.datastax.spark.connector._

import org.apache.spark._
import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD



object PageRankFromFile {
  def main(args: Array[String]): Unit = {
    System.setProperty("spark.cassandra.query.retry.count", "1")

    val conf = new SparkConf(true)
                   .set("spark.cassandra.connection.host", "192.168.116.139")
    // Load the edges as a graph

    val sc = new SparkContext("local", "PageRankFromFileApp", conf)

    // Load the edges as a graph
    val graph = GraphLoader.edgeListFile(sc, "arcs")
    // Run PageRank
    val ranks = graph.pageRank(0.0001).vertices
    // Join the ranks with the usernames
    /*val users = sc.textFile("example_index").map { line =>
      val fields = line.split(" ")
      (fields(1).toLong, fields(0)) //Id, Site
    }
    val ranksByUsername = users.join(ranks).map {
      case (id, (username, rank)) => (username, rank)
    }*/
    // Print the result
    //println(ranksByUsername.collect().mkString("\n"))
    println(ranks.collect().mkString("\n"))
  }
}
