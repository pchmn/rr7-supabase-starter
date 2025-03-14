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

## Prerequisites

- [`Dockploy`](https://docs.dokploy.com/docs/core) server in order to deploy apps
- [`Supabase`](https://supabase.com/) account for the database and auth
- [`Docker`](https://www.docker.com/) registry in order to build the docker images

## Getting Started

Once this template cloned, there is a task list in order to start fresh and without problems :
- [ ] 1. Reset project (set version to 0.0.0 and rename project): `pnpm reset-project <new_project_name>`
- [ ] 2. Install dependencies: `pnpm i`
- [ ] 3. Create a new project on your `Dokploy` server and replace `project-id` in `preview-up.yml`, `preview-down.yml` and `production.yml` workflows with your project id
- [ ] 4. Create 2 new projects on your `Supabase` account: one for the previews and one for the production
- [ ] 5. Create these repository secrets on GitHub:
  - [ ] `DOCKER_USERNAME`: Your Docker registry username
  - [ ] `DOCKER_PASSWORD`: Your Docker registry password
  - [ ] `DOKPLOY_BASE_URL`: The base URL of your Dokploy instance
  - [ ] `DOKPLOY_TOKEN`: Authentication token for Dokploy API access
  - [ ] `PREVIEW_SESSION_SECRET`: Secret key for preview environment sessions
  - [ ] `PREVIEW_SUPABASE_ANON_KEY`: Anon key for preview Supabase project
  - [ ] `PREVIEW_SUPABASE_DB_PASSWORD`: Database password for preview Supabase project
  - [ ] `PREVIEW_SUPABASE_PROJECT_ID`: Project ID for preview Supabase instance
  - [ ] `PREVIEW_SUPABASE_SERVICE_ROLE_KEY`: Service role key for preview Supabase project
  - [ ] `PREVIEW_SUPABASE_URL`: URL for preview Supabase instance
  - [ ] `PRODUCTION_SESSION_SECRET`: Secret key for production environment sessions
  - [ ] `PRODUCTION_SUPABASE_ANON_KEY`: Anon key for production Supabase project
  - [ ] `PRODUCTION_SUPABASE_DB_PASSWORD`: Database password for production Supabase project
  - [ ] `PRODUCTION_SUPABASE_PROJECT_ID`: Project ID for production Supabase instance
  - [ ] `PRODUCTION_SUPABASE_SERVICE_ROLE_KEY`: Service role key for production Supabase project
  - [ ] `PRODUCTION_SUPABASE_URL`: URL for production Supabase instance
  - [ ] `SUPABASE_ACCESS_TOKEN`: Access token for Supabase API


1. Clone this repository
2. Install dependencies: `pnpm i`
3. Reset project by running: `pnpm reset-project <new_project_name>`

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

- `DOCKER_USERNAME`: Your Docker registry username
- `DOCKER_PASSWORD`: A Docker registry password

> if using a different registry than docker hub, change `registry` input for action `./.github/actions/build-docker` in `preview-up.yml`

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
