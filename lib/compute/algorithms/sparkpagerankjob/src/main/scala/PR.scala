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

/**      In God we trust
  * Created by: Servio Palacios on 2016.05.26.
  * Source: PR.scala
  * Author: Servio Palacios
  * Last edited: 2016.06.01 13:55
  * Description: Spark Job Connector using REST API
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

/* Package related to the Job Server */
package spark.jobserver

import com.typesafe.config.{Config, ConfigFactory}
import scala.util.Try

/* spark references */
import org.apache.spark.{SparkConf, SparkContext}
import com.datastax.spark.connector._

/* GraphX references */
import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD


object PR extends SparkJob {

  def main(args: Array[String]) {

    val conf = new SparkConf(true)
      .set("spark.cassandra.connection.host", "localhost")
      .setMaster("local[4]")
      .setAppName("PageRankGN")

    val sc = new SparkContext(conf)
    val config = ConfigFactory.parseString("")
    val results = runJob(sc, config)
    println("Result is " + results)
  }

  /* Validate incoming parameters */
  /* In here I use schemas to determine in which Graph I will run the algorithms */
  override def validate(sc: SparkContext, config: Config): SparkJobValidation = {
    Try(config.getString("input.string"))
      .map(x => SparkJobValid)
      .getOrElse(SparkJobInvalid("No input.string config param"))

    Try(config.getString("alpha.string"))
      .map(x => SparkJobValid)
      .getOrElse(SparkJobInvalid("No alpha.string config param"))

    Try(config.getString("TOL.string"))
      .map(x => SparkJobValid)
      .getOrElse(SparkJobInvalid("No TOL.string config param"))
  }

  override def runJob(sc: SparkContext, config: Config): Any = {

    /* Get table from keyspace and stored as rdd */
    val vertexRDD1: RDD[(VertexId, String)] = sc.cassandraTable(config.getString("input.string"), "vertices")

    /* Get Cassandra Row and Select id */
    val vertexCassandra: RDD[CassandraRow] = sc.cassandraTable(config.getString("input.string"), "vertices")
                                               .select("id")

    /* Convert Cassandra Row into Spark's RDD */
    val rowsCassandra: RDD[CassandraRow] = sc.cassandraTable(config.getString("input.string"), "edges")
                                             .select("fromv", "tov")

    val alpha = config.getDouble("alpha.string")
    val TOL = config.getDouble("TOL.string")

    /* Convert RDD into edgeRDD */
    val edgesRDD: RDD[Edge[Int]] = rowsCassandra.map(x =>
      Edge(
        x.getLong("fromv"),
        x.getLong("tov")
      ))

    /* Collect Vertices */
    /* TODO test on Cluster */
    val vertex_collect = vertexRDD1.collect().take(1000)

    val vertexSet = VertexRDD(vertexRDD1)

    /* Build the initial Graph */
    val graph = Graph(vertexSet, edgesRDD)

    /* Run PageRank */
    val ranks = graph.pageRank(TOL).vertices

    ranks.collect()

  }//runJob

}//PR object
