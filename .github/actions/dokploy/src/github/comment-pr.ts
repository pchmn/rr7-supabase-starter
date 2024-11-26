import * as core from "@actions/core";
import * as github from "@actions/github";

export async function setPullRequestComment(
  octokit: ReturnType<typeof github.getOctokit>,
  {
    appName,
    appUrl,
    appSettingsUrl,
  }: {
    appName: string;
    appUrl: string;
    appSettingsUrl: string;
  }
) {
  const { owner, repo } = github.context.repo;
  const { number: issue_number } = github.context.issue;

  const commentBody = `
  ## 🚀 Preview deployment
  
  **Your PR has been automatically deployed to Dokploy**

  ✅ Application: ${appUrl}

  ⚙️ Administration: ${appSettingsUrl}
  `;

  const { data } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number,
  });

  const existingComment = data.find((comment) =>
    comment.body?.includes("Your PR has been automatically deployed to Dokploy")
  );

  if (!existingComment) {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body: commentBody,
    });
    core.info("Comment successfully added");
  } else {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: commentBody,
    });
    core.info("Comment already exists, updated");
  }
}
