## Trueno from Dev branch as global

```
npm install -g git://github.com/TruenoDB/trueno.git#dev
```

## Spark-Cassandra

### Installing SBT on linux
Ubuntu and other Debian-based distributions DEB package is officially supported by sbt.

You can download .tgz here: https://dl.bintray.com/sbt/native-packages/sbt/0.13.11/sbt-0.13.11.tgz

Ubuntu and other Debian-based distributions use the DEB format, but usually you don’t install your software from a local DEB file. Instead they come with package managers both for the command line (e.g. apt-get, aptitude) or with a graphical user interface (e.g. Synaptic). Run the following from the terminal to install sbt (You’ll need superuser privileges to do so, hence the sudo).

```
echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 642AC823
sudo apt-get update
sudo apt-get install sbt
```


### Spark-Cassandra-Connector Installation

#### Clone repository

```
maverick@ubuntu:~/Desktop/repos$ git clone https://github.com/datastax/spark-cassandra-connector
```


#### Build the Spark Cassandra Connector

```
maverick@ubuntu:~/Desktop/repos/spark-cassandra-connector$ ./sbt/sbt assembly
```

##### Result
```
Attempting to fetch sbt
Launching sbt from sbt/sbt-launch-0.13.8.jar
Java HotSpot(TM) 64-Bit Server VM warning: ignoring option MaxPermSize=350m; support was removed in 8.0
Getting org.scala-sbt sbt 0.13.8 ...
...

Test run finished: 0 failed, 0 ignored, 50 total, 0.227s
[info] ScalaCheck
[info] Passed: Total 0, Failed 0, Errors 0, Passed 0
[info] ScalaTest
[info] Run completed in 21 seconds, 139 milliseconds.
[info] Total number of tests run: 311
[info] Suites: completed 27, aborted 0
[info] Tests: succeeded 311, failed 0, canceled 0, ignored 4, pending 0
[info] All tests passed.
[info] Passed: Total 468, Failed 0, Errors 0, Passed 468, Ignored 4
[info] Checking every *.class/*.jar file's SHA-1.
[info] Merging files...
[warn] Merging 'META-INF/INDEX.LIST' with strategy 'last'
[warn] Merging 'META-INF/LICENSE.txt' with strategy 'last'
[warn] Merging 'META-INF/MANIFEST.MF' with strategy 'discard'
[warn] Merging 'META-INF/NOTICE.txt' with strategy 'last'
[warn] Merging 'META-INF/io.netty.versions.properties' with strategy 'last'
[warn] Strategy 'discard' was applied to a file
[warn] Strategy 'last' was applied to 4 files
[info] SHA-1: 2cee273af57a075ee387e35379586429804eb863
[info] Packaging /home/maverick/Desktop/repos/spark-cassandra-connector/spark-cassandra-connector/target/scala-2.10/spark-cassandra-connector-assembly-1.6.0-M2-25-gb476e45.jar ...
[info] Done packaging.
[success] Total time: 435 s, completed May 15, 2016 12:18:11 PM

```

### Spark-JobServer Installation

#### Clone repository

```
maverick@ubuntu:~/Desktop/repos$ git clone https://github.com/spark-jobserver/spark-jobserver.git
```


#### Build the Spark Job Server

```
maverick@ubuntu:~/Desktop/repos/spark-jobserver$ ./sbt/sbt assembly
```

#### Initiating the Spark Job Server
```
cd /home/maverick/Desktop/repos/spark-jobserver/

sbt
job-server/reStart
```

