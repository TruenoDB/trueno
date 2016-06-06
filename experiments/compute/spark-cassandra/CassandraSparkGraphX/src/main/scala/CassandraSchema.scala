/**
  * Created by Servio Palacios on 2016.05.21.
  */

import org.apache.spark.{SparkConf, SparkContext}
import com.datastax.spark.connector._

object CassandraSchema { def main(args:Array[String]): Unit = {
  System.setProperty("spark.cassandra.query.retry.count", "1")

  val conf = new SparkConf(true)
                 .set("spark.cassandra.connection.host", "192.168.116.139")

  val sc = new SparkContext("local", "CassandraSchema", conf)

  val collection = sc.parallelize(Seq((1, 2 , 1, "AR"), (2, 4, 1, "BR"), (3, 1, 2, "CR"),
                                      (4, 6, 3, "DR"), (5, 7, 3, "ER"), (6, 7, 6, "FR"),
                                      (7, 6, 7, "GR"), (8, 3, 7, "HR")))
  collection.saveToCassandra("scala_api", "edges", SomeColumns("id", "fromvertex", "tovertex", "relationship"))

  val vertexCollection = sc.parallelize(Seq((1, "A"), (2, "B"), (3, "C"), (4, "D"), (5, "E"), (6, "F"), (7, "G"), (8, "H")))
  vertexCollection.saveToCassandra("scala_api", "vertices2", SomeColumns("vertexid", "vertexname"))

}

}