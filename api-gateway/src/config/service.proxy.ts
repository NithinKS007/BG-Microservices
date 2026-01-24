import { envConfig } from "./env.config";
import { Application } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { logger } from "../../../utils/src";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { authenticate } from "middlewares/auth.middleware";

export interface IServiceConfig {
  path: string;
  url: string;
  pathRewrite?: Record<string, string>;
  name: string;
  timeout?: number;
}

class ServiceProxy {
  /**
   * Static list of microservice routes and configurations.
   *
   * @private
   * @static
   * @type {IServiceConfig[]}
   */

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

  /**
   * Builds and returns proxy configuration options for a specific service.
   *
   * @private
   * @static
   * @param {IServiceConfig} service - The service configuration.
   * @returns {Options} Proxy middleware options.
   */

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

  /**
   * Handles errors occurring during proxying.
   *
   * @private
   * @static
   * @param {Error} err - The proxy error.
   * @param {IncomingMessage} req - The incoming request.
   * @param {ServerResponse | Socket} res - The outgoing response or socket.
   */

  private static handleProxyError(
    err: Error,
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> | Socket,
  ): void {
    if (res instanceof ServerResponse) {
      logger.error(
        `Proxy error: ${err.message} ${req.method} ${req.url} ${res.statusCode} ${res.statusMessage}`,
      );
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "Service unavailable",
          statusCode: 503,
          timestamp: new Date().toISOString(),
        }),
      );
    } else {
      res.destroy();
    }
  }

  /**
   * Handles a request before it is proxied to the target microservice.
   *
   * Responsibilities:
   *  - Forward user-specific headers (`x-user-id` and `x-role`) from the API Gateway to the microservice.
   *  - Attach a unique request ID (`x-request-id`) for tracing across services.
   *  - Log basic information about the proxied request for debugging and monitoring.
   *
   * @param {ClientRequest} proxyReq - The outgoing request to the target microservice.
   * @param {IncomingMessage} req - The original request received by the API Gateway.
   * @param {ServerResponse} res - The response object of the original request.
   */

  private static handleProxyRequest(
    proxyReq: ClientRequest,
    req: IncomingMessage,
    res: ServerResponse,
  ): void {
    if (req.headers["x-user-id"]) proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
    if (req.headers["x-role"]) proxyReq.setHeader("x-role", req.headers["x-role"]);

    const requestId = req.headers["x-request-id"] || `${Date.now()}-${Math.random()}`;
    proxyReq.setHeader("x-request-id", requestId);

    logger.info(`Proxying request ${req.method} ${req.url}`);
  }

  /**
   * Called when a response is received from the target service.
   * Called when the microservice responds.
   *
   * @private
   * @static
   * @param {IncomingMessage} proxyRes - The response from the proxied service.
   * @param {IncomingMessage} req - The original request.
   * @param {ServerResponse} res - The server response.
   */

  private static handleProxyResponse(
    proxyRes: IncomingMessage,
    req: IncomingMessage,
    res: ServerResponse,
  ): void {
    logger.info(`Received response ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  }

  /**
   * Registers all configured proxy routes on the given Express application.
   *
   * @public
   * @static
   * @param {Application} app - The Express application instance.
   */

  public static setupProxy(app: Application): void {
    ServiceProxy.serviceConfig.forEach((service) => {
      const proxyOptions = ServiceProxy.createProxyOptions(service);

      app.use(
        `${service.path}/public`,
        createProxyMiddleware({ ...proxyOptions, pathRewrite: service.pathRewrite }),
      );

      app.use(service.path, authenticate, createProxyMiddleware(proxyOptions));

      logger.info(`Configured proxy for ${service.name} at ${service.path}`);
    });
  }
}
/**
 * Initializes proxying for all microservices.
 *
 * @function proxyServices
 * @param {Application} app - Express application instance.
 */
export const proxyServices = (app: Application): void => ServiceProxy.setupProxy(app);
