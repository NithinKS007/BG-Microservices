import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaAdapter } from "../../../utils/src/IBase.repository";
import { BaseRepository } from "./base.repository";

type TModel = Prisma.UserGetPayload<Prisma.UserFindUniqueArgs>;
type TCreate = Prisma.UserCreateArgs["data"];
type TUpdate = Prisma.UserUpdateArgs["data"];
type TWhere = Prisma.UserWhereInput;

export class UserRepository extends BaseRepository<TModel, TCreate, TUpdate, TWhere> {
  constructor({ prisma }: { prisma: PrismaClient | Prisma.TransactionClient }) {
    super(new PrismaAdapter(prisma.user));
  }

  findByEmail(email: string) {
    return this.findOne({ email });
  }
}
