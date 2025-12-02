import { sendResponse } from "./http.response";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "./http.status.codes";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  sendResponse(res, StatusCodes.NotFound, null, "Not found");
};
