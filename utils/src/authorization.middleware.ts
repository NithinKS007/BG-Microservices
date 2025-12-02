import { NextFunction, Response } from "express";
import { ForbiddenError } from "./error.handling.middleware";
import { CustomReq } from "./customReq";

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: CustomReq, res: Response, next: NextFunction) => {
    const userRole = req?.user?.role;
    if (!userRole || typeof userRole !== "string") {
      next(new ForbiddenError("Invalid user role, Please try again later"));
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      next(new ForbiddenError("Access denied, Please try again later"));
      return;
    }
    next();
  };
};
