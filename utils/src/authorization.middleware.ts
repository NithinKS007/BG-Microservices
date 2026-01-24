import { NextFunction, Response } from "express";
import { ForbiddenError } from "./error.handling.middleware";
import { CustomReq } from "./customReq";

/**
 * @middleware authorizeRole
 * @description Restricts access to routes based on allowed user roles.
 * @param {string[]} allowedRoles - List of permitted roles for this route.
 * @returns Express middleware that validates the user's role.
 */

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
