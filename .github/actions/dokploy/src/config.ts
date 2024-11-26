import * as core from "@actions/core";

export function getConfig() {
  return {
    githubToken: core.getInput("github-token"),
    dokployBaseUrl: core.getInput("dokploy-base-url", { required: true }),
    dokployToken: core.getInput("dokploy-token", { required: true }),
    projectId: core.getInput("project-id", { required: true }),
    applicationId: core.getInput("application-id", { required: true }),
    applicationName: core.getInput("application-name"),
    dockerImage: core.getInput("docker-image"),
    dockerUsername: core.getInput("docker-username"),
    dockerPassword: core.getInput("docker-password"),
    dockerPort: core.getInput("docker-port"),
    env: core.getMultilineInput("env"),
    commentPr: core.getBooleanInput("comment-pr"),
  };
}
