import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { Request, Response } from "express";
import { sendResponse } from "./http.response";
import { StatusCodes } from "./http.status.codes";

/**
 * RateLimiter is a utility class that provides configurable
 * rate limiting middleware for Express applications.
 *
 * Rate limiting is essential to protect APIs from abuse such as:
 * - Brute force attacks
 * - Denial of service (DoS) attacks
 * - Excessive or unexpected traffic
 *
 * This class uses the `express-rate-limit` package internally
 * to manage request counts per IP over a specific time window.
 */

export class RateLimiter {
  /**
   * Creates a rate limiter middleware.
   *
   * @param windowMs - Time frame in milliseconds over which requests are counted.
   *                   For example, 60 * 1000 = 1 minute.
   * @param maxRequests - Maximum number of allowed requests within the given time frame.
   * @returns Express middleware (RateLimitRequestHandler) that enforces the rate limit.
   *
   * This method sets a default message and HTTP status code when a client exceeds
   * the allowed request limit. The handler uses a custom response utility to
   * standardize error responses across the application.
   */

  private create(windowMs: number, maxRequests: number): RateLimitRequestHandler {
    return rateLimit({
      windowMs,
      max: maxRequests,
      message: "Limit exceeded",
      statusCode: StatusCodes.RateLimit,

      /**
       * Custom handler that is called when a client exceeds the rate limit.
       * It overrides the default response behavior of express-rate-limit to
       * use our standardized `sendResponse` utility, which ensures a consistent
       * JSON response format across the application.
       *
       * @param req - Express Request object
       * @param res - Express Response object
       */

      handler: (req: Request, res: Response) => {
        sendResponse(res, StatusCodes.RateLimit, null, "Limit exceeded");
      },
    });
  }

  /**
   * Provides a pre-configured rate limiter for API gateway routes.
   *
   * @returns Express middleware that limits each IP to 150 requests per minute.
   *
   * Use this middleware for all public-facing endpoints to prevent
   * abuse and ensure fair usage.
   */

  public apiGatewayLimiter(): RateLimitRequestHandler {
    return this.create(60 * 1000, 150);
  }

  /**
   * Example usage:
   * const loginLimiter = rateLimiter.create(15 * 60 * 1000, 5); // 5 requests per 15 minutes
   */
}
