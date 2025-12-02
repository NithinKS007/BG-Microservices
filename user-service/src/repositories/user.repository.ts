import { Prisma, PrismaClient } from "src/generated/prisma";
import { IBaseRepository } from "../../../utils/src";

type UserModel = Prisma.UserGetPayload<{}>
type UserDelegate = PrismaClient["user"];

type CreateArgs = Prisma.UserCreateArgs;
type FindUniqueArgs = Prisma.UserFindUniqueArgs;
type FindFirstArgs = Prisma.UserFindFirstArgs;
type UpdateArgs = Prisma.UserUpdateArgs;
type DeleteArgs = Prisma.UserDeleteArgs;

export class UserRepository
  implements
    IBaseRepository<
      UserModel,
      CreateArgs,
      FindUniqueArgs,
      FindFirstArgs,
      UpdateArgs,
      DeleteArgs
    >
{
  private prisma: PrismaClient;
  private delegate: UserDelegate;

  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
    this.delegate = prisma.user;
  }

  async create(args: CreateArgs): Promise<UserModel> {
    return this.delegate.create(args);
  }

  async findById(args: FindUniqueArgs): Promise<UserModel | null> {
    return this.delegate.findUnique(args);
  }

  async findOne(args: FindFirstArgs): Promise<UserModel | null> {
    return this.delegate.findFirst(args);
  }

  async updateById(args: UpdateArgs): Promise<UserModel> {
    return this.delegate.update(args);
  }

  async deleteById(args: DeleteArgs): Promise<UserModel> {
    return this.delegate.delete(args);
  }
}
