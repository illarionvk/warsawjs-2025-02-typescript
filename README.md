# Development

1. Install [Orbstack][download_orbstack] (recommended) or [Docker for Desktop][download_docker]. Only Linux and Mac platforms are supported.

1. Create `.env` from `.env.template` located at project root.

1. Open a terminal window and change the working directory to the project folder.

   Type `./up` to start the development container.

   The container shell prompt should appear after Docker builds an image and starts the container.

1. Run tests

   ```
   pnpm test
   ```

1. Run Blackjack demo

   ```
   pnpm start
   ```


1. After you're done working with the project, type `./down` in another terminal window to stop the container

# Development Environment

## Docker

The Docker container includes required versions of Node.js, Ruby,
Shopify CLI, ThemeKit, and other development dependencies.

You're not expected to install anything on your computer besides Docker and Docker Compose.

## Node Modules

This project uses pnpm package manager to manage dependencies. **Do not use npm or Yarn**.

Please use [pnpm CLI commands][pnpm_cli] _within the container_ to manage dependencies.

For performance, the `node_modules` folder is stored inside a Docker volume and the folder
contents are available within the container only.

Run `./edit` command to [attach Visual Studio Code editor to the running container][attach to container]
for full Typescript autocomplete support.

## Typescript

**This project supports Typescript via [swc compiler][swc].**

The JS/TS source files in `src` folder are compiled to `dist` folder.

The project uses the `tsc` compiler only for type checking.

You can type `bb run typecheck` in the container shell prompt to run the type checking.

# Troubleshooting

## Apple Silicon (M1/M1X) Macs

This project fully supports Macs with Intel and Apple Silicon processors.

## Node Modules

If you're experiencing issues with the `node_modules` or webpack cache, run the following command in your terminal:

```shell
docker compose down --volumes
```

## Docker for Mac Performance

If you experience slowdowns with Docker for Mac, try the following in the app preferences:

1. Update Docker for Mac to the latest version.
1. Increase the number of CPUs to at least 4.
1. Increase memory to at least 2GB; 4GB or more is preferred, but no more than 30% of your total available memory.
1. In Resources --> File Sharing, keep only `/private` and `/tmp` directory entries; then add the folder where you keep your development code.

> To maximize performance, keep your code in a separate folder outside of Documents, e.g., `~/dev`.

[attach to container]: https://code.visualstudio.com/docs/remote/attach-container
[download_docker]: https://www.docker.com/community-edition#/download
[download_orbstack]: https://orbstack.dev/download
[pnpm_cli]: https://pnpm.js.org/en/cli/install
[swc]: https://swc.rs/
