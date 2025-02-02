import Koa from "koa";
import KoaRouter from "koa-router";
import koaRange from "koa-range";
import koaCors from "koa2-cors";
import koaBody from "koa-body";
import _ from "lodash";
import Request from "./request/Request.ts";
import Response from "./response/Response.js";
import FailureBody from "./response/FailureBody.ts";
import logger from "./logger.ts";
import config from "./config.ts";

import qwen from "@/serviceProviders/qwen/index.ts";
import kimi from "@/serviceProviders/kimi/index.ts";

const registerCenter = {
  qwen,
  kimi,
};

interface ServiceProviderConfig {
  [key: string]: any;
}

class Server {
  app;
  router;
  serviceProviders: any[];
  constructor() {
    this.app = new Koa();
    this.app.use(koaCors());

    // 范围请求支持
    this.app.use(koaRange);

    // 路由
    this.router = new KoaRouter({ prefix: config.service.urlPrefix });
    // 前置处理异常拦截
    this.app.use(async (ctx: any, next: Function) => {
      if (
        ctx.request.type === "application/xml" ||
        ctx.request.type === "application/ssml+xml"
      )
        ctx.req.headers["content-type"] = "text/xml";
      try {
        await next();
      } catch (err) {
        logger.error(err);
        const failureBody = new FailureBody(err);
        new Response(failureBody).injectTo(ctx);
      }
    });
    // 载荷解析器支持
    this.app.use(koaBody(_.clone(config.system.requestBody)));
    this.app.on("error", (err: any) => {
      // 忽略连接重试、中断、管道、取消错误
      if (
        ["ECONNRESET", "ECONNABORTED", "EPIPE", "ECANCELED"].includes(err.code)
      )
        return;
      logger.error(err);
    });

    this.serviceProviders = [];
    logger.success("Server initialized");
  }

  async registerServiceProviders(
    serviceProviders: string[]
  ): Promise<{ [serviceProviderName: string]: ServiceProviderConfig }[]> {
    for (let serviceProvider of serviceProviders) {
      if (!registerCenter[serviceProvider]) {
        logger.warn(`Service provider ${serviceProvider} not found`);
        continue;
      }
      const { config } = registerCenter[serviceProvider];
      const { routes } = config;
      await this.attachRoutes(serviceProvider, routes);
      logger.success(`Service provider [${serviceProvider}] registered`);
      this.serviceProviders.push(registerCenter[serviceProvider]);
    }
    this.registerAttachRoutes("", []);

    return []; // Return an empty array or appropriate value
  }

  /**
   * 附加路由
   *
   * @param routes 路由列表
   */
  attachRoutes(serviceProvider, routes: any[]) {
    routes.forEach((route: any) => {
      const prefix = route.prefix || "";
      for (let method in route) {
        if (method === "prefix") continue;
        if (!_.isObject(route[method])) {
          logger.warn(`Router ${prefix} ${method} invalid`);
          continue;
        }
        for (let uri in route[method]) {
          this.router[method](`${prefix}${uri}`, async (ctx) => {
            const { request, response } = await this.#requestProcessing(
              ctx,
              route[method][uri]
            );
            if (response != null && config.system.requestLog)
              logger.info(
                `<- ${request.method} ${request.url} ${
                  response.time - request.time
                }ms`
              );
          });
        }
      }
      logger.info(`Route ${config.service.urlPrefix || ""}${prefix} attached`);
    });
  }

  registerAttachRoutes(serviceProvider: string, routes: any[]) {
    this.app.use(this.router.routes());

    this.app.use(this.router.routes());

    // 未知请求处理
    this.app.use((ctx: any) => {
      const request = new Request(ctx);
      logger.debug(
        `-> ${ctx.request.method} ${
          ctx.request.url
        } request is not supported - ${request.remoteIP || "unknown"}`
      );
      const message = `[请求有误]: 正确请求为 POST -> /<SEVICE_PROVIDER>/v1/chat/completions，当前请求为 ${ctx.request.method} -> ${ctx.request.url} 请纠正`;
      logger.warn(message);
      const failureBody = new FailureBody(new Error(message));
      const response = new Response(failureBody);
      response.injectTo(ctx);
      if (config.system.requestLog)
        logger.info(
          `<- ${request.method} ${request.url} ${
            response.time - request.time
          }ms`
        );
    });
  }

  /**
   * 请求处理
   *
   * @param ctx 上下文
   * @param routeFn 路由方法
   */
  #requestProcessing(ctx: any, routeFn: Function): Promise<any> {
    return new Promise((resolve) => {
      const request = new Request(ctx);
      try {
        if (config.system.requestLog)
          logger.info(`-> ${request.method} ${request.url}`);
        routeFn(request)
          .then((response) => {
            try {
              if (!Response.isInstance(response)) {
                const _response = new Response(response);
                _response.injectTo(ctx);
                return resolve({ request, response: _response });
              }
              response.injectTo(ctx);
              resolve({ request, response });
            } catch (err) {
              logger.error(err);
              const failureBody = new FailureBody(err);
              const response = new Response(failureBody);
              response.injectTo(ctx);
              resolve({ request, response });
            }
          })
          .catch((err) => {
            try {
              logger.error(err);
              const failureBody = new FailureBody(err);
              const response = new Response(failureBody);
              response.injectTo(ctx);
              resolve({ request, response });
            } catch (err) {
              logger.error(err);
              const failureBody = new FailureBody(err);
              const response = new Response(failureBody);
              response.injectTo(ctx);
              resolve({ request, response });
            }
          });
      } catch (err) {
        logger.error(err);
        const failureBody = new FailureBody(err);
        const response = new Response(failureBody);
        response.injectTo(ctx);
        resolve({ request, response });
      }
    });
  }

  /**
   * 监听端口
   */
  async listen() {
    const host = config.service.host;
    const port = config.service.port;
    await Promise.all([
      new Promise((resolve, reject) => {
        if (
          host === "0.0.0.0" ||
          host === "localhost" ||
          host === "127.0.0.1"
        ) {
          return resolve(null);
        }

        this.app.listen(port, "localhost", (err) => {
          if (err) return reject(err);
          resolve(null);
        });
      }),

      new Promise((resolve, reject) => {
        this.app.listen(port, host, (err) => {
          if (err) return reject(err);
          resolve(null);
        });
      }),
    ]);
    logger.success(`Server listening on port ${port} (${host})`);
  }
}

export default new Server();
