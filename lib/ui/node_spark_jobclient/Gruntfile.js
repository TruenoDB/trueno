"use strict";

/**      In God we trust
 * Created by: Servio Palacios on 2016.05.26.
 * Source: Gruntfile.js
 * Author: Servio Palacios
 * Last edited: 2016.05.26. 14:38
 * Description: Converts automatically libraries needed in the web browsers
 */
module.exports = function (grunt) {
    // Show elapsed time at the end
    require("time-grunt")(grunt);
    // Load all grunt tasks
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            supervisorBrowser: {
                files: "<%= browserify.supervisor.dependencies %>",
                tasks: ["browserify:supervisor"]
            }
        },
        browserify: {
            supervisor: {
                dependencies: [
                    "config.js",
                    "lib/enums.js",
                    "lib/sparkJobClient.js"
                ],
                files: {
                    "js/browserClient.js":["lib/sparkJobClient.js"]
                }
            },
            web:{
                files: {
                    "js/browserClient2.js":["js/browserWrapper.js"]
                }
            },
        }//browserify
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask("default", ["browserify"]);
};