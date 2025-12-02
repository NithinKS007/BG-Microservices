import { IBaseRepository } from "../../../utils/src";
import { Prisma, PrismaClient } from "src/generated/prisma";

// --- Prisma Model Types ---
export type UserModel = Prisma.UserGetPayload<{}>;
export type CreateArgs = Prisma.UserCreateArgs;
export type FindUniqueArgs = Prisma.UserFindUniqueArgs;
export type FindFirstArgs = Prisma.UserFindFirstArgs;
export type UpdateArgs = Prisma.UserUpdateArgs;
export type DeleteArgs = Prisma.UserDeleteArgs;

// --- Prisma Delegate Type ---
export type UserDelegate = PrismaClient["user"];

// --- DTOs (for API or Service Layer) ---
export interface CreateUserData {
  fullName: string;
  email: string;
  password?: string;
  code?: string;
  tenantId: string;
  outletIds?: string[];
  status?: "active" | "inactive";
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  password?: string;
  status?: "active" | "inactive" | "suspended";
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
}

export interface IUserRepository
  extends IBaseRepository<
    Partial<UserModel>,
    Partial<UserModel>,
    Partial<UserModel>,
    Partial<UserModel>,
    Partial<UserModel>,
    Partial<UserModel>
  > {
  findByEmail(email: string): Promise<UserModel | null>;
}
