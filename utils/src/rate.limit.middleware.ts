import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { sendResponse } from "./http.response";
import { StatusCodes } from "./http.status.codes";

const createRateLimiter = (windowMs: number, maxRequests: number) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    message: "Limit exceeded",
    statusCode: StatusCodes.RateLimit,
    handler: (req: Request, res: Response) => {
      sendResponse(res, StatusCodes.RateLimit, null, "Limit exceeded");
    },
  });

const rateLimiter = createRateLimiter(1 * 60 * 1000, 150);

export { rateLimiter };
