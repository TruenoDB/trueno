"use strict";
/**
 * Created by: Servio Palacios on 20160526
 * Source: enums.js
 * Author: Servio
 * Last edition: edgardo 2016.05.26
 * Description: Enumeration for the next events:
 *
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
        STRONGLY_CONNECTED_COMPONENTS:"Strongly Connected Components"
    };

    this.pageRank = {


    }

}

/* Immutable for security reasons */
module.exports = Object.freeze(new Enums());
