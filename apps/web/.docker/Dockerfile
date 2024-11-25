# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME="/pnpm"
ENV TURBO_CACHE_DIR="/.turbo"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set store-dir ${PNPM_HOME}

FROM base AS build
ARG VITE_TRANSLATIONS_HASH
ENV VITE_TRANSLATIONS_HASH=$VITE_TRANSLATIONS_HASH
WORKDIR /app
COPY . /app/
# Log for troubleshooting. There should be files in the directory when there's a cache hit
RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents before install: $(ls -la ${PNPM_HOME})"
RUN --mount=type=cache,target=${PNPM_HOME} pnpm install --frozen-lockfile
# Another log for troubleshooting. This should never be empty since the NPM modules were installed before running this line
RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents after install: $(ls -la ${PNPM_HOME})"
RUN --mount=type=cache,target=${TURBO_CACHE_DIR} pnpm turbo build --filter=@monorepo-template/web
RUN --mount=type=cache,target=${PNPM_HOME} pnpm deploy --filter=@monorepo-template/web --prod /prod

FROM base AS production
WORKDIR /app
COPY --from=build /prod /app
EXPOSE 8080
CMD [ "pnpm", "start" ]