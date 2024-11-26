import * as core from "@actions/core";
import * as github from "@actions/github";
import { getConfig } from "./config";
import { setPullRequestComment } from "./github/comment-pr";
import {
  applicationCreate,
  applicationDeploy,
  applicationOne,
  applicationSaveDockerProvider,
  applicationSaveEnvironment,
  client,
  domainByApplicationId,
  domainCreate,
  domainGenerateDomain,
  projectOne,
} from "./sdk/client";
import type { Application, Domain, Project } from "./sdk/types";

const config = getConfig();
let octokit: ReturnType<typeof github.getOctokit>;
if (config.githubToken) {
  octokit = github.getOctokit(config.githubToken);
}
client.setConfig({
  baseUrl: `${config.dokployBaseUrl}/api`,
  headers: {
    Authorization: `Bearer ${config.dokployToken}`,
  },
});

async function main() {
  const application = await getOrCreateApplication();

  if (application) {
    core.info(`Updating docker image of ${application.name}...`);
    await applicationSaveDockerProvider({
      body: {
        applicationId: application.applicationId,
        dockerImage: config.dockerImage,
        username: config.dockerUsername,
        password: config.dockerPassword,
      },
    });
    core.info(`Updating environment variables of ${application.name}...`);
    await applicationSaveEnvironment({
      body: {
        applicationId: application.applicationId,
        env: config.env.join("\n"),
      },
    });
    core.info(`Deploying ${application.name}...`);
    await applicationDeploy({
      body: {
        applicationId: application.applicationId,
      },
    });

    await waitForDeploymentToBeDone(application.applicationId);

    const applicationUrl = await getApplicationUrl(application.applicationId);
    if (config.commentPr) {
      await setPullRequestComment(octokit, {
        appName: application.name,
        appUrl: applicationUrl,
        appSettingsUrl: `${config.dokployBaseUrl}/dashboard/project/${config.projectId}/services/application/${application.name}`,
      });
    }

    core.info(
      `🚀 ${application.name} successfully deployed to ${applicationUrl}`
    );
  }
}

async function getOrCreateApplication() {
  if (config.applicationId) {
    const { data } = await applicationOne({
      query: { applicationId: config.applicationId },
    });

    if (data) {
      core.info(`Application ${config.applicationName} found`);
      return data as Application;
    }
  }

  const { data: project } = await projectOne({
    query: { projectId: config.projectId },
  });
  for (const application of (project as Project | undefined)?.applications ??
    []) {
    if (application.name === config.applicationName) {
      core.info(`Application ${config.applicationName} found`);
      return application;
    }
  }

  core.info(`Creating application ${config.applicationName}...`);
  const { data: application } = await applicationCreate({
    body: {
      projectId: config.projectId,
      name: config.applicationName,
      appName: config.applicationName,
    },
  });
  if (application) {
    const { data: host } = await domainGenerateDomain({
      body: {
        appName: config.applicationName,
      },
    });
    await domainCreate({
      body: {
        host: host as string,
        applicationId: (application as Application).applicationId,
        https: true,
        certificateType: "letsencrypt",
        port: Number.parseInt(config.dockerPort ?? "80"),
      },
    });
    return application as Application;
  }
}

async function getApplicationUrl(applicationId: string) {
  const { data } = await domainByApplicationId({
    query: { applicationId },
  });
  return `https://${(data as Domain[])[0].host}`;
}

async function waitForDeploymentToBeDone(applicationId: string) {
  const res = await applicationOne({
    query: { applicationId },
  });
  const application = res.data as Application | undefined;
  if (!application) {
    throw new Error("Application not found");
  }
  if (application.applicationStatus === "error") {
    throw new Error("Application deployment failed");
  }
  if (application.applicationStatus === "done") {
    return;
  }

  // wait for 5 seconds before checking again
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await waitForDeploymentToBeDone(applicationId);
}

main();
