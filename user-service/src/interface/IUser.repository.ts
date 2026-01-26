import { DatabaseAdapter } from "../../../utils/src/IBase.repository";
import { Prisma, PrismaClient } from "../generated/prisma/client";

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
  email: String;
  name: String;
  password: String;
}

export interface UpdateUserData {
  email: String;
  name: String;
  password: String;
}

export interface IUserRepository extends DatabaseAdapter<
  Partial<UserModel>,
  Partial<UserModel>,
  Partial<UserModel>,
  Partial<UserModel>
> {
  findUserByEmail(email: string): Promise<UserModel | null>;
  createUser(data: CreateUserData): Promise<UserModel>;
  findUserById(id: string): Promise<UserModel | null>;
}
