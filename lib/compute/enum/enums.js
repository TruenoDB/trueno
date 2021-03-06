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
        DEPENDENCIES: "Dependencies",
        PAGE_RANK:"pagerank",
        WORD_COUNT:"Word Count",
        TRIANGLE_COUNTING:"triangles",
        CONNECTED_COMPONENTS:"Connected Components",
        STRONGLY_CONNECTED_COMPONENTS:"Strongly Connected Components",
        SHORTEST_PATHS:"Shortest Paths",
        NONE:"None"
    };

    this.parameters = {
      vertices:  {string: "vertices"},
      edges:     {string: "edges"},
      vertexId:  {string: "id"},
      source:    {string: "source"},
      target:    {string: "target"},
      compute:   {string: "comp"},
      persisted: {string: "false"}
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
      optionsNotDefined: "[options] parameter not defined.",
      jobStatusMustBeFinished: "Job Status must be FINISHED"
    }

}//Enums

/* Immutable for security reasons */
module.exports = Object.freeze(new Enums());
