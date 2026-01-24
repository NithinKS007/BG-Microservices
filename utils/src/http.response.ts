import { Response } from "express";

/**
 * Standardized API response helper for Express.
 * Ensures consistent response structure across all endpoints.
 *
 * @template T - Type of the response data
 * @param res - Express Response object
 * @param statusCode - HTTP status code
 * @param data - Optional response data (default: null)
 * @param message - Response message
 *
 * @example
 * sendResponse(res, 200, { userId: 1 }, "User fetched successfully");
 *
 * Response format:
 * {
 *   success: boolean,       // true for 2xx, false otherwise
 *   status: number,         // HTTP status code
 *   message: string,        // descriptive message
 *   data: T | null          // payload
 * }
 */

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T | null = null,
  message: string,
) => {
  const success = statusCode >= 200 && statusCode < 300;

  return res.status(statusCode).json({
    success,
    status: statusCode,
    message,
    data,
  });
};
