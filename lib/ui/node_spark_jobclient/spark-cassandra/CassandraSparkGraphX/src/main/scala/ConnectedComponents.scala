/**
  * Created by Servio Palacios on 2016.05.18.
  */

import org.apache.spark.{SparkConf, SparkContext}

import com.datastax.spark.connector._

import org.apache.spark._
import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD



object ConnectedComponents {
  def main(args: Array[String]): Unit = {
    System.setProperty("spark.cassandra.query.retry.count", "1")

    val conf = new SparkConf(true)
      .set("spark.cassandra.connection.host", "192.168.116.139")
    // Load the edges as a graph

    val sc = new SparkContext("local", "ConnectedComponetsApp", conf)

    // Load the graph as in the PageRank example
    val graph = GraphLoader.edgeListFile(sc, "followers.txt")

    // Find the connected components
    val cc = graph.connectedComponents().vertices
    // Join the connected components with the usernames
    val users = sc.textFile("users.txt").map { line =>
      val fields = line.split(",")
      (fields(0).toLong, fields(1))
    }
    val ccByUsername = users.join(cc).map {
      case (id, (username, cc)) => (username, cc)
    }
    // Print the result
    println(ccByUsername.collect().mkString("\n"))
  }
}
