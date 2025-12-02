import { envConfig } from "./env.config";
import { Application } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { logger } from "../../../utils/src";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";

export interface IServiceConfig {
  path: string;
  url: string;
  pathRewrite?: Record<string, string>;
  name: string;
  timeout?: number;
}

class ServiceProxy {
  private static readonly serviceConfig: IServiceConfig[] = [
    {
      path: "/user-service",
      url: envConfig.USER_SERVICE_URL,
      pathRewrite: { "^/user-service": "/api/v1/users" },
      name: "user-service",
      timeout: 5000,
    },
    {
      path: "/auth-service",
      url: envConfig.AUTH_SERVICE_URL,
      pathRewrite: { "^/auth-service": "/api/v1/auth" },
      name: "auth-service",
      timeout: 5000,
    },
    {
      path: "/blog-service",
      url: envConfig.BLOG_SERVICE_URL,
      pathRewrite: { "^/blog-service": "/api/v1/blogs" },
      name: "blog-service",
      timeout: 5000,
    },
  ];

  private static createProxyOptions(service: IServiceConfig): Options {
    return {
      target: service.url,
      changeOrigin: true,
      pathRewrite: service.pathRewrite,
      timeout: service.timeout ?? envConfig.DEFAULT_TIMEOUT,
      logger: logger,
      on: {
        error: ServiceProxy.handleProxyError,
        proxyReq: ServiceProxy.handleProxyRequest,
        proxyRes: ServiceProxy.handleProxyResponse,
      },
    };
  }

  private static handleProxyError(
    err: Error,
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> | Socket
  ): void {
    if (res instanceof ServerResponse) {
      logger.error(
        `Proxy error: ${err.message} ${req.method} ${req.url} ${res.statusCode} ${res.statusMessage}`
      );
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "Service unavailable",
          statusCode: 503,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      res.destroy();
    }
  }

  private static handleProxyRequest(
    proxyReq: ClientRequest,
    req: IncomingMessage,
    res: ServerResponse
  ): void {
    logger.info(`Proxying request ${req.method} ${req.url}`);
  }

  private static handleProxyResponse(
    proxyRes: IncomingMessage,
    req: IncomingMessage,
    res: ServerResponse
  ): void {
    logger.info(
      `Received response ${proxyRes.statusCode} for ${req.method} ${req.url}`
    );
  }

  public static setupProxy(app: Application): void {
    ServiceProxy.serviceConfig.forEach((service) => {
      const proxyOptions = ServiceProxy.createProxyOptions(service);
      app.use(service.path, createProxyMiddleware(proxyOptions));
      logger.info(`Configured proxy for ${service.name} at ${service.path}`);
    });
  }
}

export const proxyServices = (app: Application): void =>
  ServiceProxy.setupProxy(app);
