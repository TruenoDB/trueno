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
  * Source: ConnectedComponents.scala
  * Author: Servio Palacios
  * Last edited: 2016.06.01 13:55
  * Description: Spark Job Connector using REST API
  */


package spark.jobserver

import com.typesafe.config.{Config, ConfigFactory}
import scala.util.Try

//spark
import org.apache.spark.{SparkConf, SparkContext}
import com.datastax.spark.connector._

import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD


object ConnectedComponents extends SparkJob {


  def main(args: Array[String]) {
    val conf = new SparkConf(true)
      .set("spark.cassandra.connection.host", "localhost")
      .setMaster("local[4]")
      .setAppName("ConnectedComponents")

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
    val vertexRDD1: RDD[(VertexId, String)] = sc.cassandraTable(config.getString("input.string"), "vertices")

    val rowsCassandra: RDD[CassandraRow] = sc.cassandraTable(config.getString("input.string"), "edges")
                                             .select("fromv", "tov")
    val edgesRDD: RDD[Edge[Int]] = rowsCassandra.map(x =>
      Edge(
        x.getLong("fromv"),
        x.getLong("tov")
      ))

    //TODO
    val vertex_collect = vertexRDD1.collect().take(100)

    val vertexSet = VertexRDD(vertexRDD1)

    // Build the initial Graph
    val graph = Graph(vertexSet, edgesRDD)

    // Find the connected components
    val cc = graph.connectedComponents().vertices
    cc.collect()
  }

}

