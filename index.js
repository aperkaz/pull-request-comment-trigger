#!/usr/bin/env node

const core = require("@actions/core");
const { context, GitHub } = require("@actions/github");

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

    console.log('hi');
    console.log(context)
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
      // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
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
