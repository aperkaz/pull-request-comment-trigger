#!/usr/bin/env node
module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(132);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 132:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {


const core = __webpack_require__(286);
const { context, GitHub } = __webpack_require__(919);

async function run() {
  const trigger = core.getInput("trigger");
  if (!trigger) {
    core.setFailed("No `trigger` input given, aborting.");
    return;
  }
  const reaction = core.getInput("reaction");
  const { GITHUB_TOKEN } = process.env;
  if (reaction && !GITHUB_TOKEN) {
    core.setFailed('If "reaction" is supplied, GITHUB_TOKEN is required');
    return;
  }

  if (
    context.eventName === "issue_comment" &&
    !context.payload.issue.pull_request
  ) {
    // not a pull-request comment, aborting
    core.setOutput("triggered", "false");
    return;
  }

  const { owner, repo } = context.repo;

  const body =
    context.eventName === "issue_comment"
      ? context.payload.comment.body
      : context.payload.pull_request.body;

  if (!body.includes(trigger)) {
    core.setOutput("triggered", "false");
    return;
  }

  console.log("hi");
  console.log(context);
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);

  core.setOutput("triggered", "true");

  if (!reaction) {
    return;
  }

  const client = new GitHub(GITHUB_TOKEN);
  if (context.eventName === "issue_comment") {
    await client.reactions.createForIssueComment({
      owner,
      repo,
      comment_id: context.payload.comment.id,
      content: reaction
    });
  } else {
    await client.reactions.createForIssue({
      owner,
      repo,
      issue_number: context.payload.pull_request.number,
      content: reaction
    });
  }
}

run().catch(err => {
  console.error(err);
  core.setFailed("Unexpected error");
});


/***/ }),

/***/ 286:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 919:
/***/ (function() {

eval("require")("@actions/github");


/***/ })

/******/ });