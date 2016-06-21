/**
 * Created by Servio Palacios on 2016.05.23.
 */

var shell = require('shelljs');


if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    exit(1);
}
else {
    shell.echo('Git installed');
}

//Installing sbt


// Cloning Spark's Repository
if (shell.exec('git clone https://github.com/apache/spark.git').code !== 0) {
    shell.echo('Error: Git clone failed');
    shell.exit(1);
}

//Installing Cassandra
//shell.echo("deb http://www.apache.org/dist/cassandra/debian 30x main") |  sudo tee -a /etc/apt/sources.list.d/cassandra.sources.listdeb http://www.apache.org/dist/cassandra/debian 30x main


if (shell.exec('gpg --keyserver pgp.mit.edu --recv-keys F758CE318D77295D').code !== 0) {
    shell.echo('Error: Key addition');
    shell.exit(1);
}

if (shell.exec('gpg --export --armor F758CE318D77295D | sudo apt-key add -').code !== 0) {
    shell.echo('Error: key export');
    shell.exit(1);
}

if (shell.exec('gpg --keyserver pgp.mit.edu --recv-keys 2B5C1B00').code !== 0) {
    shell.echo('Error: key addition');
    shell.exit(1);
}

if (shell.exec('gpg --export --armor 2B5C1B00 | sudo apt-key add -').code !== 0) {
    shell.echo('Error: key addition');
    shell.exit(1);
}

if (shell.exec('sudo apt-get update').code !== 0) {
    shell.echo('Error: apt-get update');
    shell.exit(1);
}

if (shell.exec('sudo apt-get install cassandra').code !== 0) {
    shell.echo('Error: apt-get install cassandra');
    shell.exit(1);
}
else {
    if (shell.exec('sudo nodetool status').code !== 0) {
        shell.echo('Error: apt-get install cassandra');
        shell.exit(1);
    }
}


