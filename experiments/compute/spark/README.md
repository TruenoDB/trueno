###Spark Installation

####Installing Java 8 on Ubuntu

```
http://tecadmin.net/install-oracle-java-8-jdk-8-ubuntu-via-ppa/
```


#####Adding repository
```sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update```


#####Updating
```
maverick@ubuntu:~$ sudo apt-get update
Hit:1 http://security.ubuntu.com/ubuntu xenial-security InRelease
Hit:2 http://us.archive.ubuntu.com/ubuntu xenial InRelease                                          
Get:3 http://us.archive.ubuntu.com/ubuntu xenial-updates InRelease [94.5 kB]                        
Hit:4 http://us.archive.ubuntu.com/ubuntu xenial-backports InRelease                                           
Get:5 http://ppa.launchpad.net/webupd8team/java/ubuntu xenial InRelease [17.6 kB]
Get:6 http://ppa.launchpad.net/webupd8team/java/ubuntu xenial/main amd64 Packages [2,864 B]
Get:7 http://ppa.launchpad.net/webupd8team/java/ubuntu xenial/main i386 Packages [2,864 B]
Get:8 http://ppa.launchpad.net/webupd8team/java/ubuntu xenial/main Translation-en [1,260 B]
Fetched 119 kB in 5s (20.0 kB/s) 
Reading package lists... Done
```

####Install java8
```
maverick@ubuntu:~$ sudo apt-get install oracle-java8-installer
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  gsfonts-x11 java-common
Suggested packages:
  binfmt-support visualvm ttf-baekmuk | ttf-unfonts | ttf-unfonts-core ttf-kochi-gothic | ttf-sazanami-gothic ttf-kochi-mincho
  | ttf-sazanami-mincho ttf-arphic-uming
The following NEW packages will be installed:
  gsfonts-x11 java-common oracle-java8-installer
0 upgraded, 3 newly installed, 0 to remove and 55 not upgraded.
Need to get 38.2 kB of archives.
After this operation, 226 kB of additional disk space will be used.
Do you want to continue? [Y/n] 
```

####Checking java version
```
maverick@ubuntu:~$ java -version
java version "1.8.0_91"
Java(TM) SE Runtime Environment (build 1.8.0_91-b14)
Java HotSpot(TM) 64-Bit Server VM (build 25.91-b14, mixed mode)
```

####Installing sbt
```
http://www.scala-sbt.org/0.13/docs/Installing-sbt-on-Linux.html
```

Ubuntu and other Debian-based distributions use the DEB format, but usually you don’t install your software from a local DEB file. Instead they come with package managers both for the command line (e.g. apt-get, aptitude) or with a graphical user interface (e.g. Synaptic). Run the following from the terminal to install sbt (You’ll need superuser privileges to do so, hence the sudo).
```
echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 642AC823
sudo apt-get update
sudo apt-get install sbt
```
####Download Spark 
```
git clone https://github.com/apache/spark.git
```

####Building Spark
Spark is built using Apache Maven. To build Spark and its example programs, run:

```
build/mvn -DskipTests clean package
```

####Interactive Scala Shell
```
./bin/spark-shell
```

####Example programs:
```
./bin/run-example SparkPi
```

####Installing IntelliJ IDEA
```
maverick@ubuntu:~/Desktop$ tar -xvf ideaIU-2016.1.2.tar.gz
```
####Running IDEA:
```
maverick@ubuntu:~/Desktop/ideaIU/bin$ ./idea.sh
```

*Install Scala plugin*


####Installing Maven

```
maverick@ubuntu:~/IdeaProjects/SimpleProject$ mvn package
The program 'mvn' is currently not installed. You can install it by typing:
sudo apt install maven
maverick@ubuntu:~/IdeaProjects/SimpleProject$ sudo apt install maven
```

####Building Project Using Maven
```
maverick@ubuntu:~/IdeaProjects/SimpleProject$ mvn package
```

Output
```
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building simple-project 1.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.2/maven-compiler-plugin-3.2.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.2/maven-compiler-plugin-3.2.pom (12 KB at 12.8 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.2/maven-compiler-plugin-3.2.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.2/maven-compiler-plugin-3.2.jar (45 KB at 228.5 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.17/maven-surefire-plugin-2.17.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.17/maven-surefire-plugin-2.17.pom (5 KB at 42.1 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire/2.17/surefire-2.17.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire/2.17/surefire-2.17.pom (17 KB at 135.2 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.17/maven-surefire-plugin-2.17.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.17/maven-surefire-plugin-2.17.jar (34 KB at 237.1 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-jar-plugin/2.4/maven-jar-plugin-2.4.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-jar-plugin/2.4/maven-jar-plugin-2.4.pom (6 KB at 50.0 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-jar-plugin/2.4/maven-jar-plugin-2.4.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-jar-plugin/2.4/maven-jar-plugin-2.4.jar (34 KB at 249.8 KB/sec)
[INFO] 
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ simple-project ---
[WARNING] Using platform encoding (UTF-8 actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] Copying 0 resource
[INFO] 
[INFO] --- maven-compiler-plugin:3.2:compile (default-compile) @ simple-project ---
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.4/plexus-compiler-api-2.4.pom
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.4/plexus-compiler-api-2.4.pom (865 B at 7.7 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler/2.4/plexus-compiler-2.4.pom
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler/2.4/plexus-compiler-2.4.pom (6 KB at 44.2 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.4/plexus-compiler-manager-2.4.pom
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.4/plexus-compiler-manager-2.4.pom (690 B at 6.0 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.4/plexus-compiler-javac-2.4.pom
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.4/plexus-compiler-javac-2.4.pom (769 B at 6.5 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compilers/2.4/plexus-compilers-2.4.pom
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compilers/2.4/plexus-compilers-2.4.pom (2 KB at 11.0 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.5.1/plexus-utils-1.5.1.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.9/maven-plugin-parameter-documenter-2.0.9.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.9/maven-error-diagnostics-2.0.9.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-core/2.0.9/maven-core-2.0.9.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.9/maven-plugin-descriptor-2.0.9.jar
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-utils/1.5.1/plexus-utils-1.5.1.jar (206 KB at 610.5 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-monitor/2.0.9/maven-monitor-2.0.9.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.9/maven-plugin-parameter-documenter-2.0.9.jar (21 KB at 45.7 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-toolchain/1.0/maven-toolchain-1.0.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.9/maven-error-diagnostics-2.0.9.jar (14 KB at 30.1 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-utils/0.1/maven-shared-utils-0.1.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-monitor/2.0.9/maven-monitor-2.0.9.jar (11 KB at 20.9 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.4/plexus-compiler-api-2.4.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.9/maven-plugin-descriptor-2.0.9.jar (37 KB at 64.4 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.4/plexus-compiler-manager-2.4.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-core/2.0.9/maven-core-2.0.9.jar (156 KB at 273.0 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.4/plexus-compiler-javac-2.4.jar
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.4/plexus-compiler-api-2.4.jar (25 KB at 39.1 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-container-default/1.5.5/plexus-container-default-1.5.5.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-toolchain/1.0/maven-toolchain-1.0.jar (33 KB at 47.6 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-classworlds/2.2.2/plexus-classworlds-2.2.2.jar
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.4/plexus-compiler-manager-2.4.jar (5 KB at 6.4 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/xbean/xbean-reflect/3.4/xbean-reflect-3.4.jar
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.4/plexus-compiler-javac-2.4.jar (19 KB at 25.4 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/log4j/log4j/1.2.12/log4j-1.2.12.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/shared/maven-shared-utils/0.1/maven-shared-utils-0.1.jar (151 KB at 193.7 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/commons-logging/commons-logging-api/1.1/commons-logging-api-1.1.jar
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-classworlds/2.2.2/plexus-classworlds-2.2.2.jar (46 KB at 39.4 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/com/google/collections/google-collections/1.0/google-collections-1.0.jar
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-container-default/1.5.5/plexus-container-default-1.5.5.jar (212 KB at 176.3 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/junit/junit/3.8.2/junit-3.8.2.jar
Downloaded: https://repo.maven.apache.org/maven2/commons-logging/commons-logging-api/1.1/commons-logging-api-1.1.jar (44 KB at 30.6 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/org/apache/xbean/xbean-reflect/3.4/xbean-reflect-3.4.jar (131 KB at 82.9 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/junit/junit/3.8.2/junit-3.8.2.jar (118 KB at 74.7 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/log4j/log4j/1.2.12/log4j-1.2.12.jar (350 KB at 211.3 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/com/google/collections/google-collections/1.0/google-collections-1.0.jar (625 KB at 285.3 KB/sec)
[INFO] Changes detected - recompiling the module!
[WARNING] File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!
[INFO] Compiling 1 source file to /home/maverick/IdeaProjects/SimpleProject/target/classes
[INFO] 
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ simple-project ---
[WARNING] Using platform encoding (UTF-8 actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory /home/maverick/IdeaProjects/SimpleProject/src/test/resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.2:testCompile (default-testCompile) @ simple-project ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- maven-surefire-plugin:2.17:test (default-test) @ simple-project ---
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.17/maven-surefire-common-2.17.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.17/maven-surefire-common-2.17.pom (6 KB at 49.2 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.2/maven-plugin-annotations-3.2.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.2/maven-plugin-annotations-3.2.pom (2 KB at 14.0 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugin-tools/maven-plugin-tools/3.2/maven-plugin-tools-3.2.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugin-tools/maven-plugin-tools/3.2/maven-plugin-tools-3.2.pom (17 KB at 130.2 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/2.17/surefire-api-2.17.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/2.17/surefire-api-2.17.pom (3 KB at 17.9 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/2.17/surefire-booter-2.17.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/2.17/surefire-booter-2.17.pom (3 KB at 22.8 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.17/maven-surefire-common-2.17.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/2.17/surefire-booter-2.17.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/2.17/surefire-api-2.17.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-toolchain/2.0.9/maven-toolchain-2.0.9.jar
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.2/maven-plugin-annotations-3.2.jar
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-booter/2.17/surefire-booter-2.17.jar (39 KB at 222.1 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.17/maven-surefire-common-2.17.jar (260 KB at 570.9 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.2/maven-plugin-annotations-3.2.jar (15 KB at 29.6 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-toolchain/2.0.9/maven-toolchain-2.0.9.jar (38 KB at 69.4 KB/sec)
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/surefire/surefire-api/2.17/surefire-api-2.17.jar (144 KB at 183.5 KB/sec)
[INFO] No tests to run.
[INFO] 
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ simple-project ---
Downloading: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.15/plexus-interpolation-1.15.jar
Downloaded: https://repo.maven.apache.org/maven2/org/codehaus/plexus/plexus-interpolation/1.15/plexus-interpolation-1.15.jar (60 KB at 319.2 KB/sec)
[INFO] Building jar: /home/maverick/IdeaProjects/SimpleProject/target/simple-project-1.0-SNAPSHOT.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 11.020 s
[INFO] Finished at: 2016-05-12T22:44:08-07:00
[INFO] Final Memory: 29M/203M
[INFO] ------------------------------------------------------------------------
```

####Running Application using spark-submit
```
maverick@ubuntu:~/IdeaProjects/SimpleProject$ ../../Desktop/spark/bin/spark-submit --class "SimpleApp" --master local[4] target/simple-project-1.0-SNAPSHOT.jar
```
Output
```
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
16/05/12 22:48:49 INFO SparkContext: Running Spark version 2.0.0-SNAPSHOT
16/05/12 22:48:50 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
16/05/12 22:48:50 WARN Utils: Your hostname, ubuntu resolves to a loopback address: 127.0.1.1; using 192.168.116.139 instead (on interface ens33)
16/05/12 22:48:50 WARN Utils: Set SPARK_LOCAL_IP if you need to bind to another address
16/05/12 22:48:50 INFO SecurityManager: Changing view acls to: maverick
16/05/12 22:48:50 INFO SecurityManager: Changing modify acls to: maverick
16/05/12 22:48:50 INFO SecurityManager: Changing view acls groups to: 
16/05/12 22:48:50 INFO SecurityManager: Changing modify acls groups to: 
16/05/12 22:48:50 INFO SecurityManager: SecurityManager: authentication disabled; ui acls disabled; users  with view permissions: Set(maverick); groups with view permissions: Set(); users  with modify permissions: Set(maverick); groups with modify permissions: Set()
16/05/12 22:48:50 INFO Utils: Successfully started service 'sparkDriver' on port 39121.
16/05/12 22:48:50 INFO SparkEnv: Registering MapOutputTracker
16/05/12 22:48:50 INFO SparkEnv: Registering BlockManagerMaster
16/05/12 22:48:50 INFO DiskBlockManager: Created local directory at /tmp/blockmgr-12c80af3-fdec-47e5-9927-6bd9770965d0
16/05/12 22:48:50 INFO MemoryStore: MemoryStore started with capacity 457.9 MB
16/05/12 22:48:50 INFO SparkEnv: Registering OutputCommitCoordinator
16/05/12 22:48:51 WARN AbstractHandler: No Server set for org.spark_project.jetty.server.handler.ErrorHandler@25a6944c
16/05/12 22:48:51 INFO Utils: Successfully started service 'SparkUI' on port 4040.
16/05/12 22:48:51 INFO SparkUI: Bound SparkUI to 0.0.0.0, and started at http://192.168.116.139:4040
16/05/12 22:48:51 INFO SparkContext: Added JAR file:/home/maverick/IdeaProjects/SimpleProject/target/simple-project-1.0-SNAPSHOT.jar at spark://192.168.116.139:39121/jars/simple-project-1.0-SNAPSHOT.jar with timestamp 1463118531341
16/05/12 22:48:51 INFO Executor: Starting executor ID driver on host localhost
16/05/12 22:48:51 INFO Utils: Successfully started service 'org.apache.spark.network.netty.NettyBlockTransferService' on port 35815.
16/05/12 22:48:51 INFO NettyBlockTransferService: Server created on 192.168.116.139:35815
16/05/12 22:48:51 INFO BlockManagerMaster: Trying to register BlockManager
16/05/12 22:48:51 INFO BlockManagerMasterEndpoint: Registering block manager 192.168.116.139:35815 with 457.9 MB RAM, BlockManagerId(driver, 192.168.116.139, 35815)
16/05/12 22:48:51 INFO BlockManagerMaster: Registered BlockManager
16/05/12 22:48:52 INFO MemoryStore: Block broadcast_0 stored as values in memory (estimated size 107.7 KB, free 457.8 MB)
16/05/12 22:48:52 INFO MemoryStore: Block broadcast_0_piece0 stored as bytes in memory (estimated size 10.2 KB, free 457.8 MB)
16/05/12 22:48:52 INFO BlockManagerInfo: Added broadcast_0_piece0 in memory on 192.168.116.139:35815 (size: 10.2 KB, free: 457.9 MB)
16/05/12 22:48:52 INFO SparkContext: Created broadcast 0 from textFile at SimpleApp.java:14
16/05/12 22:48:52 INFO FileInputFormat: Total input paths to process : 1
16/05/12 22:48:52 INFO SparkContext: Starting job: count at SimpleApp.java:18
16/05/12 22:48:52 INFO DAGScheduler: Got job 0 (count at SimpleApp.java:18) with 2 output partitions
16/05/12 22:48:52 INFO DAGScheduler: Final stage: ResultStage 0 (count at SimpleApp.java:18)
16/05/12 22:48:52 INFO DAGScheduler: Parents of final stage: List()
16/05/12 22:48:52 INFO DAGScheduler: Missing parents: List()
16/05/12 22:48:52 INFO DAGScheduler: Submitting ResultStage 0 (MapPartitionsRDD[2] at filter at SimpleApp.java:16), which has no missing parents
16/05/12 22:48:53 INFO MemoryStore: Block broadcast_1 stored as values in memory (estimated size 3.2 KB, free 457.8 MB)
16/05/12 22:48:53 INFO MemoryStore: Block broadcast_1_piece0 stored as bytes in memory (estimated size 1958.0 B, free 457.8 MB)
16/05/12 22:48:53 INFO BlockManagerInfo: Added broadcast_1_piece0 in memory on 192.168.116.139:35815 (size: 1958.0 B, free: 457.9 MB)
16/05/12 22:48:53 INFO SparkContext: Created broadcast 1 from broadcast at DAGScheduler.scala:1012
16/05/12 22:48:53 INFO DAGScheduler: Submitting 2 missing tasks from ResultStage 0 (MapPartitionsRDD[2] at filter at SimpleApp.java:16)
16/05/12 22:48:53 INFO TaskSchedulerImpl: Adding task set 0.0 with 2 tasks
16/05/12 22:48:53 INFO TaskSetManager: Starting task 0.0 in stage 0.0 (TID 0, localhost, partition 0, PROCESS_LOCAL, 5373 bytes)
16/05/12 22:48:53 INFO TaskSetManager: Starting task 1.0 in stage 0.0 (TID 1, localhost, partition 1, PROCESS_LOCAL, 5373 bytes)
16/05/12 22:48:53 INFO Executor: Running task 1.0 in stage 0.0 (TID 1)
16/05/12 22:48:53 INFO Executor: Running task 0.0 in stage 0.0 (TID 0)
16/05/12 22:48:53 INFO Executor: Fetching spark://192.168.116.139:39121/jars/simple-project-1.0-SNAPSHOT.jar with timestamp 1463118531341
16/05/12 22:48:53 INFO TransportClientFactory: Successfully created connection to /192.168.116.139:39121 after 34 ms (0 ms spent in bootstraps)
16/05/12 22:48:53 INFO Utils: Fetching spark://192.168.116.139:39121/jars/simple-project-1.0-SNAPSHOT.jar to /tmp/spark-69706240-7b83-429a-9176-000786a9d37c/userFiles-57e707d5-cee6-4a27-aa01-02ad39d9de17/fetchFileTemp1160835626607304842.tmp
16/05/12 22:48:53 INFO Executor: Adding file:/tmp/spark-69706240-7b83-429a-9176-000786a9d37c/userFiles-57e707d5-cee6-4a27-aa01-02ad39d9de17/simple-project-1.0-SNAPSHOT.jar to class loader
16/05/12 22:48:53 INFO HadoopRDD: Input split: file:/home/maverick/Desktop/spark/README.md:0+1815
16/05/12 22:48:53 INFO HadoopRDD: Input split: file:/home/maverick/Desktop/spark/README.md:1815+1816
16/05/12 22:48:53 INFO deprecation: mapred.tip.id is deprecated. Instead, use mapreduce.task.id
16/05/12 22:48:53 INFO deprecation: mapred.tip.id is deprecated. Instead, use mapreduce.task.id
16/05/12 22:48:53 INFO deprecation: mapred.task.id is deprecated. Instead, use mapreduce.task.attempt.id
16/05/12 22:48:53 INFO deprecation: mapred.task.id is deprecated. Instead, use mapreduce.task.attempt.id
16/05/12 22:48:53 INFO deprecation: mapred.task.is.map is deprecated. Instead, use mapreduce.task.ismap
16/05/12 22:48:53 INFO deprecation: mapred.task.partition is deprecated. Instead, use mapreduce.task.partition
16/05/12 22:48:53 INFO deprecation: mapred.job.id is deprecated. Instead, use mapreduce.job.id
16/05/12 22:48:53 INFO MemoryStore: Block rdd_1_1 stored as values in memory (estimated size 5.3 KB, free 457.7 MB)
16/05/12 22:48:54 INFO BlockManagerInfo: Added rdd_1_1 in memory on 192.168.116.139:35815 (size: 5.3 KB, free: 457.9 MB)
16/05/12 22:48:54 INFO MemoryStore: Block rdd_1_0 stored as values in memory (estimated size 5.5 KB, free 457.7 MB)
16/05/12 22:48:54 INFO BlockManagerInfo: Added rdd_1_0 in memory on 192.168.116.139:35815 (size: 5.5 KB, free: 457.9 MB)
16/05/12 22:48:54 INFO Executor: Finished task 1.0 in stage 0.0 (TID 1). 1639 bytes result sent to driver
16/05/12 22:48:54 INFO Executor: Finished task 0.0 in stage 0.0 (TID 0). 1726 bytes result sent to driver
16/05/12 22:48:54 INFO TaskSetManager: Finished task 1.0 in stage 0.0 (TID 1) in 909 ms on localhost (1/2)
16/05/12 22:48:54 INFO TaskSetManager: Finished task 0.0 in stage 0.0 (TID 0) in 987 ms on localhost (2/2)
16/05/12 22:48:54 INFO TaskSchedulerImpl: Removed TaskSet 0.0, whose tasks have all completed, from pool 
16/05/12 22:48:54 INFO DAGScheduler: ResultStage 0 (count at SimpleApp.java:18) finished in 1.103 s
16/05/12 22:48:54 INFO DAGScheduler: Job 0 finished: count at SimpleApp.java:18, took 1.516573 s
16/05/12 22:48:54 INFO SparkContext: Starting job: count at SimpleApp.java:22
16/05/12 22:48:54 INFO DAGScheduler: Got job 1 (count at SimpleApp.java:22) with 2 output partitions
16/05/12 22:48:54 INFO DAGScheduler: Final stage: ResultStage 1 (count at SimpleApp.java:22)
16/05/12 22:48:54 INFO DAGScheduler: Parents of final stage: List()
16/05/12 22:48:54 INFO DAGScheduler: Missing parents: List()
16/05/12 22:48:54 INFO DAGScheduler: Submitting ResultStage 1 (MapPartitionsRDD[3] at filter at SimpleApp.java:20), which has no missing parents
16/05/12 22:48:54 INFO MemoryStore: Block broadcast_2 stored as values in memory (estimated size 3.2 KB, free 457.7 MB)
16/05/12 22:48:54 INFO MemoryStore: Block broadcast_2_piece0 stored as bytes in memory (estimated size 1963.0 B, free 457.7 MB)
16/05/12 22:48:54 INFO BlockManagerInfo: Added broadcast_2_piece0 in memory on 192.168.116.139:35815 (size: 1963.0 B, free: 457.9 MB)
16/05/12 22:48:54 INFO SparkContext: Created broadcast 2 from broadcast at DAGScheduler.scala:1012
16/05/12 22:48:54 INFO DAGScheduler: Submitting 2 missing tasks from ResultStage 1 (MapPartitionsRDD[3] at filter at SimpleApp.java:20)
16/05/12 22:48:54 INFO TaskSchedulerImpl: Adding task set 1.0 with 2 tasks
16/05/12 22:48:54 INFO TaskSetManager: Starting task 0.0 in stage 1.0 (TID 2, localhost, partition 0, PROCESS_LOCAL, 5373 bytes)
16/05/12 22:48:54 INFO TaskSetManager: Starting task 1.0 in stage 1.0 (TID 3, localhost, partition 1, PROCESS_LOCAL, 5373 bytes)
16/05/12 22:48:54 INFO Executor: Running task 1.0 in stage 1.0 (TID 3)
16/05/12 22:48:54 INFO Executor: Running task 0.0 in stage 1.0 (TID 2)
16/05/12 22:48:54 INFO BlockManager: Found block rdd_1_1 locally
16/05/12 22:48:54 INFO BlockManager: Found block rdd_1_0 locally
16/05/12 22:48:54 INFO Executor: Finished task 0.0 in stage 1.0 (TID 2). 954 bytes result sent to driver
16/05/12 22:48:54 INFO Executor: Finished task 1.0 in stage 1.0 (TID 3). 954 bytes result sent to driver
16/05/12 22:48:54 INFO TaskSetManager: Finished task 1.0 in stage 1.0 (TID 3) in 27 ms on localhost (1/2)
16/05/12 22:48:54 INFO TaskSetManager: Finished task 0.0 in stage 1.0 (TID 2) in 33 ms on localhost (2/2)
16/05/12 22:48:54 INFO TaskSchedulerImpl: Removed TaskSet 1.0, whose tasks have all completed, from pool 
16/05/12 22:48:54 INFO DAGScheduler: ResultStage 1 (count at SimpleApp.java:22) finished in 0.034 s
16/05/12 22:48:54 INFO DAGScheduler: Job 1 finished: count at SimpleApp.java:22, took 0.073728 s
Lines with a: 60, lines with b: 26
```

###References:
* http://www.philchen.com/2015/02/16/how-to-install-apache-spark-and-cassandra-stack-on-ubuntu
* https://spark.apache.org/docs/latest/spark-standalone.html
* https://spark.apache.org/docs/latest/streaming-programming-guide.html
* https://github.com/datastax/spark-cassandra-connector/blob/master/doc/8_streaming.md
* https://jaceklaskowski.gitbooks.io/mastering-apache-spark/content/spark-anatomy-spark-application.html
* http://blog.scottlogic.com/2013/07/29/spark-stream-analysis.html
* https://www.youtube.com/watch?v=Ok7gYD1VbNw

