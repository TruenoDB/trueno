/**
 * In God we trust
 * Created by Servio Palacios on 2016.05.15.
 * Connector.java
 */


import com.datastax.spark.connector.cql.CassandraConnector;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.*;
import org.apache.spark.api.java.JavaRDD;

import java.lang.reflect.Array;
import java.util.*;
import java.io.Serializable;
import com.datastax.driver.core.Session;
import org.apache.spark.rdd.RDD;

import static com.datastax.spark.connector.japi.CassandraJavaUtil.*;


/*
import com.datastax.spark.connector.*;
import org.apache.spark.SparkContext;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.graphx.*;
*/

public class Connector {


    public static void main(String[] args) {//public static void

        SparkConf conf = new SparkConf().setAppName("Simple Application");
        conf.set("spark.cassandra.connection.host", "192.168.116.139");
        conf.setMaster("local[2]");

        JavaSparkContext sc = new JavaSparkContext(conf);

        generateData(sc);

    }//main


    private static void generateData(JavaSparkContext sc) {

        CassandraConnector connector = CassandraConnector.apply(sc.getConf());

        // Prepare the schema
        //try ()

        Session session = connector.openSession();
        session.execute("DROP KEYSPACE IF EXISTS java_api");
        session.execute("CREATE KEYSPACE java_api WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}");
        session.execute("CREATE TABLE java_api.vertices (id INT PRIMARY KEY, name TEXT, parents LIST<INT>)");
        session.execute("CREATE TABLE java_api.edges (id UUID PRIMARY KEY, Vertex INT, price DECIMAL)");

        // Prepare the Vertices hierarchy
        List<Vertex> Vertices = Arrays.asList(
                new Vertex(0, "All Vertices", Collections.<Integer>emptyList()),
                new Vertex(1, "Vertex A", Arrays.asList(0)),
                new Vertex(4, "Vertex A1", Arrays.asList(0, 1)),
                new Vertex(5, "Vertex A2", Arrays.asList(0, 1)),
                new Vertex(2, "Vertex B", Arrays.asList(0)),
                new Vertex(6, "Vertex B1", Arrays.asList(0, 2)),
                new Vertex(7, "Vertex B2", Arrays.asList(0, 2)),
                new Vertex(3, "Vertex C", Arrays.asList(0)),
                new Vertex(8, "Vertex C1", Arrays.asList(0, 3)),
                new Vertex(9, "Vertex C2", Arrays.asList(0, 3))
        );

        JavaRDD<Vertex> VerticesRDD = sc.parallelize(Vertices);
        //RDD<Vertex> vertexRDD : RDD[(Long, (String, Integer))] = sc.parallelize(Vertices);
        javaFunctions(VerticesRDD).writerBuilder("java_api", "vertices", mapToRow(Vertex.class)).saveToCassandra();

    }//generateData

    public static class Vertex implements Serializable {
        private Integer id;
        private String name;
        private List<Integer> parents;

        public Vertex() { }

        public Vertex(Integer id, String name, List<Integer> parents) {
            this.id = id;
            this.name = name;
            this.parents = parents;
        }

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public List<Integer> getParents() { return parents; }
        public void setParents(List<Integer> parents) { this.parents = parents; }

        /*@Override
        public String toString() {
            return MessageFormat.format("Vertex'{'id={0}, name=''{1}'', parents={2}'}'", id, name, parents);
        }*/
    }


}
