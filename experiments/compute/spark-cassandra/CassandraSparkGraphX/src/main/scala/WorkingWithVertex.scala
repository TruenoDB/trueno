/**
  * Created by maverick on 5/19/16.
  */
import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.graphx._
import org.apache.spark.rdd.RDD

/*object firstgraph {
  def addVertex(
                 sc: SparkContext,
                 vertexRDD: RDD[(Long(String,Int))],
  name: String,
  age: Int,
  counter:Long): RDD[(Long, (String, Int))] = {
    val newVertexArray = Array((counter, (name, age)))
    val newVertexRdd: RDD[(Long, (String, Int))] = sc.parallelize(newVertexArray)
    newVertexRdd ++ vertexRDD
  }

  def main(args: Array[String]) {
    val conf = new SparkConf().setMaster("local").setAppName("firstgraph")
    val sc = new SparkContext(conf)

    val vertexArray = Array(
      (1L, ("Alice", 28)),
      (2L, ("Bob", 27)),
      (3L, ("Charlie", 65)),
      (4L, ("David", 42)),
      (5L, ("Ed", 55)),
      (6L, ("Fran", 50)))

    val edgeArray = Array(
      Edge(2L, 1L, 7),
      Edge(2L, 4L, 2),
      Edge(3L, 2L, 4),
      Edge(3L, 6L, 3),
      Edge(4L, 1L, 1),
      Edge(5L, 2L, 2),
      Edge(5L, 3L, 8),
      Edge(5L, 6L, 3))

    var vertexRDD: RDD[(Long, (String, Int))] = sc.parallelize(vertexArray)
    var edgeRDD: RDD[Edge[Int]] = sc.parallelize(edgeArray)
    var graph: Graph[(String, Int), Int] = Graph(vertexRDD, edgeRDD)
    graph.vertices.filter { case (id, (name, age)) => age > 30 }.collect.foreach {
      case (id, (name, age)) => println(s"$name is $age")
    }
    var x = 0
    var counter = 7L
    var name = ""
    var age = 0
    while (x == 0) {
      println("Enter Name")
      name = Console.readLine
      println("Enter age")
      age = Console.readInt
      vertexRDD = addVertex(sc, vertexRDD, name, age, counter)
      graph = Graph(vertexRDD, edgeRDD)
      graph.vertices.filter { case (id, (name, age)) => age > 30 }.collect.foreach {
        case (id, (name, age)) => println(s"$name is $age")
      }
      counter = counter + 1
      println("want to enter more node press 0 for yes and 1 for no ")
      x = Console.readInt
    }
  }
}
*/
