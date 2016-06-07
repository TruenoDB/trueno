/*

 ________                                                 _______   _______
/        |                                               /       \ /       \
$$$$$$$$/______   __    __   ______   _______    ______  $$$$$$$  |$$$$$$$  |
   $$ | /      \ /  |  /  | /      \ /       \  /      \ $$ |  $$ |$$ |__$$ |
   $$ |/$$$$$$  |$$ |  $$ |/$$$$$$  |$$$$$$$  |/$$$$$$  |$$ |  $$ |$$    $$<
   $$ |$$ |  $$/ $$ |  $$ |$$    $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$$$$$$  |
   $$ |$$ |      $$ \__$$ |$$$$$$$$/ $$ |  $$ |$$ \__$$ |$$ |__$$ |$$ |__$$ |
   $$ |$$ |      $$    $$/ $$       |$$ |  $$ |$$    $$/ $$    $$/ $$    $$/
   $$/ $$/        $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$/  $$$$$$$/  $$$$$$$/

 */


/** In God we trust
  * @author Servio Palacios
  * @date_creation 2016.05.26.
  * @module pagerank.scala
  * @description Spark Job Connector using REST API
  *
  */

/**
  * Run a dynamic version of PageRank returning a graph with vertex attributes containing the
  * PageRank and edge attributes containing the normalized edge weight.
  *
  * @param graph the graph on which to compute PageRank
  * @param tol the tolerance allowed at convergence (smaller => more accurate).
  * @param resetProb the random reset probability (alpha)
  *
  * @return the graph containing with each vertex containing the PageRank and each edge
  *         containing the normalized weight.
  */

package spark.jobserver

import com.typesafe.config.{Config, ConfigFactory}
import scala.util.Try

//spark
import org.apache.spark.{SparkConf, SparkContext}
import com.datastax.spark.connector._

import org.apache.spark._
import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD


object PageRank extends SparkJob {

    def main(args: Array[String]) {
        //System.setProperty("spark.cassandra.query.retry.count", "1")
        //System.out.println(System.getProperty( "java.class.path"))
        val conf = new SparkConf(true)
                          .set("spark.cassandra.connection.host", "localhost")
                          .setMaster("local[4]")
                          .setAppName("PageRank")

        val sc = new SparkContext(conf)
        val config = ConfigFactory.parseString("")
        val results = runJob(sc, config)
        println("Result is " + results)
    }

    override def validate(sc: SparkContext, config: Config): SparkJobValidation = {
        Try(config.getString("input.string"))
          .map(x => SparkJobValid)
          .getOrElse(SparkJobInvalid("No input.string config param"))
    }

    override def runJob(sc: SparkContext, config: Config): Any = {
        //get table from keyspace and stored as rdd
        val vertexRDD1: RDD[(VertexId, String)] =
            sc.cassandraTable(config.getString("input.string"), "vertices2")

        val rowsCassandra: RDD[CassandraRow] = sc.cassandraTable(config.getString("input.string"), "edges")
                                                 .select("fromvertex", "tovertex")
        val edgesRDD: RDD[Edge[Int]] = rowsCassandra.map(x =>
            Edge(
                x.getLong("fromvertex"),
                x.getLong("tovertex")
            ))

        val vertex_collect = vertexRDD1.collect().take(100)
        //vertex_collect.foreach(println(_))

        //edgesRDD.foreach(println(_))

        val vertexSet = VertexRDD(vertexRDD1)

        // Build the initial Graph
        val graph = Graph(vertexSet, edgesRDD)

        // Run PageRank
        //I can use a parameter from Web UI, adding this to the class
        val ranks = graph.pageRank(0.0001).vertices
        ranks.collect()
        //sc.parallelize(config.getString("input.string").split(" ").toSeq).countByValue
    }

}
