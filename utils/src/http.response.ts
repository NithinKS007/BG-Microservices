import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T | null = null,
  message: string
) => {
  const success = statusCode >= 200 && statusCode < 300;

  return res.status(statusCode).json({
    success,
    status: statusCode,
    message,
    data,
  });
};
