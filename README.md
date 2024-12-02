# Monorepo Template

This a monorepo template for Typescript projects.

## Features

- 📦 [pnpm](https://pnpm.io/) for fast, disk space efficient package management
- 🏗️ [Turborepo](https://turbo.build/) for efficient build system and task running
- 🔷 [TypeScript](https://www.typescriptlang.org/) for type safety
- 🔨 [Biome](https://biomejs.dev/) for fast consistent code formatting and linting
- 🎨 [Tailwind CSS](https://tailwindcss.com/) support with VS Code integration
- 📱 Workspace structure for apps and packages
- 🔄 Automated dependency version synchronization
- 🛠️ VS Code configuration for optimal developer experience

## Code organization

The monorepo is organized into two main directories:

- `apps/`: Contains all the applications that can be deployed independently
- `packages/`: Contains shared packages/libraries used across applications

## Getting Started

1. Clone this repository
2. Install dependencies: `pnpm i`
3. Replace all occurrences of `monorepo-template` by your own project name

## CI

### Preview Deployments

The repository includes automated preview deployment workflows that manage preview environments for pull requests:

#### Preview Creation (`preview-up.yml`)

When a PR is opened, reopened, synchronized, or marked ready for review, the workflow:

1. Builds a Docker image of the application
2. Deploys it to [Dokploy](https://dokploy.com) with a unique preview URL
3. Comments on the PR with the preview URL

#### Preview Cleanup (`preview-down.yml`)

When a PR is closed (merged or abandoned), the workflow automatically:

1. Removes the preview deployment from Dokploy
2. Cleans up associated resources

#### Required Secrets

The following secrets need to be configured in your repository settings:

**Docker Hub Authentication:**

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: A Docker Hub access token

**AWS Cache (Optional):**

- `AWS_ACCESS_KEY_ID`: AWS access key for S3 cache
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for S3 cache

**Dokploy Deployment:**

- `DOKPLOY_BASE_URL`: The base URL of your Dokploy instance
- `DOKPLOY_TOKEN`: Authentication token for Dokploy API access

The workflows use these secrets to:

- Push built images to Docker Hub
- Store build cache in AWS S3 (if configured)
- Deploy and manage preview environments in Dokploy
