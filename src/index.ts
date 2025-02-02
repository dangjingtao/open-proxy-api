"use strict";

import environment from "@/lib/environment.ts";
import config from "@/lib/config.ts";
import "@/lib/initialize.ts";
import server from "@/lib/server.ts";
import logger from "@/lib/logger.ts";
import models from "./serviceProviders/qwen/routes/models.ts";

const SERVICE_PROVIDERS = ["qwen"];

const startupTime = performance.now();

(async () => {
  logger.header();

  const res = await server.registerServiceProviders(SERVICE_PROVIDERS);

  console.log("<<<< server start >>>>");
  console.table([
    {
      version: environment.package.version,
      pid: process.pid,
      env: environment.env,
      name: config.service.name,
    },
  ]);
  console.log("<<<< model info >>>>");
  console.table(
    SERVICE_PROVIDERS.map((name) => ({
      modelsName: name,
      api_url: `http://${config.service.host}:${config.service.port}/${name}/v1`,
    }))
  );

  await server.listen();

  config.service.bindAddress &&
    logger.success("Service bind address:", config.service.bindAddress);
})()
  .then(() =>
    logger.success(
      `Service startup completed (${Math.floor(
        performance.now() - startupTime
      )}ms)`
    )
  )
  .catch((err) => console.error(err));
