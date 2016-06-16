"use strict";

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

/**
 * Created by: Servio Palacios on 20160526
 * Source: enums.js
 * Author: Servio Palacios
 * Last edition: Servio Palacios 2016.06.06
 * Description: Enumeration for the next events:
 */

function Enums() {

    this.jobStatus = {
        STARTED: "STARTED",
        FINISHED: "FINISHED",
        RUNNING: "RUNNING",
        ERROR: "ERROR"
    };

    this.algorithmType = {
        PAGE_RANK:"Page Rank",
        WORD_COUNT:"Word Count",
        TRIANGLE_COUNTING:"Triangle Counting",
        CONNECTED_COMPONENTS:"Connected Components",
        STRONGLY_CONNECTED_COMPONENTS:"Strongly Connected Components",
        SHORTEST_PATHS:"Shortest Paths",
        NONE:"None"
    };

    this.pageRank = {
      graph: "gnutella",
      TOL: 0.0001,
      resetProb: 0.15
    };

    this.connectedComponents = {
      graph: "gnutella",
      maxIterations: 1000
    };

    this.jobServerRequest = {
      contentType: "Content-Type",
      contentTypeValue: "application/json",
      classPath: "&classPath=",
      jobsAppName: "/jobs?appName=",
      requestType: "http://",
      jobsURL: "/jobs/"
    };

    this.errorMessages = {
      jobServerRequest: "Job Server Request",
      jobIDParameterNotIncluded: "JobId Parameter not included",
      computeSchedulerAlgorithmNotRecognized: "[Compute Scheduler] Algorithm type not recognized",
      optionsNotDefined: "[options] parameter not defined."
    }

}

/* Immutable for security reasons */
module.exports = Object.freeze(new Enums());
