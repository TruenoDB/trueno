## Roadmap

0.0 - "A New Hope". Release: 06/21/2016
* **Basic API operations**. 
<br>Supports for add, delete, modify, retrieve for graphs, vertex and edges.
* **External interface**. 
<br>Interface layer to interact with backend operations.
* **Model class to manage CRUD operations**. 
<br>CRUD operations manage by model adapters for each entity (graph, vertex, edges), to minize the use of hard coded sql queries.

0.1 - "The Do-Over". release: 07/15/2016 
* **Redesigned core**. 
<br>Redesign of main classes involved in the API (session classes, external interface, graph non-transactional interface) to boost performance. Adjust entity structures and storage (C*) to minimize the overhead in casting and data conversion (would involve to define data types on C*). Redefine how build-query tool is being used. Changes will be done to assure performance on the backend system.
* **Sample graphs**
<br> Sample graphs based on random data to use on Trueno:db.

0.2 - "Civil War". Release: 08/03/2016
* **Apache TinkerPop3 Gremlin.**
<br>Support of Gremlin traversal language. Java implementation of [Structure OLTP API](http://tinkerpop.apache.org/docs/3.2.0-incubating/dev/provider/). Trueno Java API will be needed for the gremlin support. 
* **Notification/Manage of logical error**. 
<br>So far, only reported by C* are notify to the user, via interface (api-interface).
* **Support for streams**. 
<br>Support for streams for `get*List` operations, instead of the actual list of objects that is returned right now.
* **Predefinition of attributes**.
<br>Predefinition of attributes used by entities. This will efectively facility the management of the integrity of data being stored, and the could impact in the performance of the backend.

0.3 - "Need for Speed". Release: 09/02/2016
* **UUID (64 bit)**. 
<br>Auto generation of an ID for vertex, compatible with Spark GraphX (64 bit); and not the usual UUID (128 bit) supported by Apache Cassandra.
* **Automatic loader**.
<br>Basic loader implemented using API operations. This feature will be used as the main way to import data in the system, until a distributed feature (using Apache Spark) is released (maybe later this year).
* **Suppor for batch queries**. 
<br>Support for batches, useful for long operations. 
* **Support for prepare statements**. 
<br>Support for execute prepare statements on cassandra-connection, to [boost performance for repeated execution of queries](http://www.datastax.com/dev/blog/4-simple-rules-when-using-the-datastax-drivers-for-cassandra) (*prepare once, bind and execute multiple times*). 

0.4 - "The Force Awakens". Release: 10/07/2016
* **Performance Test**
<br>Do some tests to measure the performance of Trueno's backend. Modify module according to these results.
* **Entity integrity and locking**. 
<br>Integrity check while inserting edges, by not allowing inserts of edges between non-existent vertices; cascading delete of edges if a vertex is deleted. Lock entities while updates operations are being done (this would have to be change in the future, for a more efficient solution).

0.5 - "Fast Five". Release: 11/11/2016
* **Enhance index management**.
<br>Basic integration with Apache Solr, for index management outside C\* capabilities. The integration with Apache Solr will be basic. Even though that this milestone aims for a basic integration, it should lay the foundations for index management services in the backend (on future release). Basic index management (for index inside C\*) will also be provided.
* **Graph semantic support**. 
<br>Semantic support of graph properties. Internally, graphs are represented as DAG. If a graph is defined as undirected, then an edge from a and b should be inserted in both ways: (a,b). Support for multi graphs (multiple edges between two nodes) by introducing an identifier per edges. Those properties mush not be modified after edges has been inserted. 

0.6 - "Ghost Protocol". Release: 12/16/2016
* **View Management**
<br>Support for views, used by the compute library. The support will include the needed operations for create, retrieve, update and drop views. This feature needs to be integrated with **compute** and **ui** module.
* **Granular updates on map properties**.
<br>Increase the granularity level on updates operations done over map properties (eg. attributes, metadata, computed results).
* **Support for clustering and distributed operations**
<br>Support for C* installed in cluster. Defenitely, it will required a review on graph partition, intended to minimize the overhead in communication by increasing data locallity on operations.

0.7 - "The Winter Soldier". Release: 02/03/2017


**Disclaimer.**
Release numbers are not related to Trueno release version.
