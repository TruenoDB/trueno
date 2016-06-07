/**
 * Created by Servio on 2016.05.27.
 */

var Client = require('node-rest-client').Client;

var client = new Client();

// direct way
/*client.get("http://192.168.116.139:8090/jobs?appName=wordcount&classPath=spark.jobserver.WordCountExample", function (data, response) {
    // parsed response body as js object
    console.log(data);
    console.log(data[0].duration);
    // raw response
    console.log("Response");
    console.log(response);
});*/

// registering remote methods
/*client.registerMethod("jsonMethod", "http://192.168.116.139:8090/jobs?appName=test&classPath=spark.jobserver.WordCountExample", "GET");

client.methods.jsonMethod(function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});
*/

//POST
// set content-type header and data as json in args parameter
var args = {
    data: { input: {string: "hello gorman"} },
    headers: { "Content-Type": "application/json" }
};

client.post("http://192.168.116.139:8090/jobs?appName=wordcount&classPath=spark.jobserver.WordCountExample", args, function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});

//https://stackoverflow.com/questions/17690803/node-js-getaddrinfo-enotfound

//deployer
//configuration
