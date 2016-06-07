/**
  * Created by Servio Palacios on 2016.05.18.
  */

import org.apache.spark.{SparkConf, SparkContext}

import com.datastax.spark.connector._

import org.apache.spark._
import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD


object TriangleCounting {
  def main(args: Array[String]): Unit = {
    System.setProperty("spark.cassandra.query.retry.count", "1")

    val conf = new SparkConf(true)
      .set("spark.cassandra.connection.host", "192.168.116.139")
    // Load the edges as a graph

    val sc = new SparkContext("local", "ConnectedComponetsApp", conf)

    /// Load the edges in canonical order and partition the graph for triangle count
    val graph = GraphLoader.edgeListFile(sc, "followers.txt", true).partitionBy(PartitionStrategy.RandomVertexCut)
    // Find the triangle count for each vertex
    val triCounts = graph.triangleCount().vertices
    // Join the triangle counts with the usernames
    val users = sc.textFile("users.txt").map { line =>
                                                val fields = line.split(",")
                                                (fields(0).toLong, fields(1))
    }
    val triCountByUsername = users.join(triCounts).map { case (id, (username, tc)) =>
                                                                    (username, tc)
    }
    // Print the result
    println(triCountByUsername.collect().mkString("\n"))

  }
}