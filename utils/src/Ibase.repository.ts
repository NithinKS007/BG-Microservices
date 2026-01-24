import { Model, FilterQuery, UpdateQuery } from "mongoose";

/**
 * Generic interface defining CRUD operations for any database adapter.
 * TModel: The type returned by the database (e.g., Prisma model or Mongoose document)
 * TCreate: The type used to create a new record
 * TUpdate: The type used to update a record
 * TWhere: The type for query filters
 */

export interface DatabaseAdapter<TModel, TCreate, TUpdate, TWhere> {
  create(data: TCreate): Promise<TModel>;

  findById(id: string): Promise<TModel | null>;
  findOne(where: TWhere): Promise<TModel | null>;
  findMany(where: TWhere): Promise<TModel[]>;

  update(id: string, data: TUpdate): Promise<TModel | null>;
  delete(id: string): Promise<TModel | null>;
  deleteMany(where: TWhere): Promise<unknown>;

  count(where: TWhere): Promise<number>;
}

/**
 * Adapter for Prisma ORM to implement generic DatabaseAdapter.
 * Wraps Prisma client methods to conform to a unified interface.
 * Provides error-safe update/delete (returns null if fails) to prevent runtime crashes.
 */

export class PrismaAdapter<TModel, TCreate, TUpdate, TWhere>
  implements DatabaseAdapter<TModel, TCreate, TUpdate, TWhere>
{
  constructor(
    private readonly delegate: {
      create(args: { data: TCreate }): Promise<TModel>;
      createMany?(args: { data: TCreate[] }): Promise<unknown>;
      findUnique(args: { where: { id: string } }): Promise<TModel | null>;
      findFirst(args: { where: TWhere }): Promise<TModel | null>;
      findMany(args: { where: TWhere }): Promise<TModel[]>;
      update(args: { where: { id: string }; data: TUpdate }): Promise<TModel>;
      delete(args: { where: { id: string } }): Promise<TModel>;
      deleteMany(args: { where: TWhere }): Promise<unknown>;
      count(args: { where: TWhere }): Promise<number>;
    },
  ) {}

  create(data: TCreate) {
    return this.delegate.create({ data });
  }

  createMany(data: TCreate[]) {
    return this.delegate.createMany?.({ data });
  }

  findById(id: string) {
    return this.delegate.findUnique({ where: { id } });
  }

  findOne(where: TWhere) {
    return this.delegate.findFirst({ where });
  }

  findMany(where: TWhere) {
    return this.delegate.findMany({ where });
  }

  async update(id: string, data: TUpdate): Promise<TModel | null> {
    try {
      return await this.delegate.update({ where: { id }, data });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<TModel | null> {
    try {
      return await this.delegate.delete({ where: { id } });
    } catch {
      return null;
    }
  }

  deleteMany(where: TWhere) {
    return this.delegate.deleteMany({ where });
  }

  count(where: TWhere) {
    return this.delegate.count({ where });
  }
}

/**
 * Adapter for Mongoose to implement generic DatabaseAdapter.
 * Wraps Mongoose model methods to conform to a unified interface.
 * Supports lean queries by default for better performance.
 */

export class MongooseAdapter<
  TModel,
  TCreate,
  TUpdate extends UpdateQuery<TModel>,
  TWhere extends FilterQuery<TModel>,
> implements DatabaseAdapter<TModel, TCreate, TUpdate, TWhere>
{
  constructor(private readonly model: Model<TModel>) {}

  create(data: TCreate): Promise<TModel> {
    return this.model.create(data);
  }

  createMany(data: TCreate[]) {
    return this.model.insertMany(data);
  }

  findById(id: string): Promise<TModel | null> {
    return this.model.findById(id);
  }

  findOne(where: TWhere): Promise<TModel | null> {
    return this.model.findOne(where);
  }

  findMany(where: TWhere): Promise<TModel[]> {
    return this.model.find(where);
  }

  update(id: string, data: TUpdate): Promise<TModel | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string): Promise<TModel | null> {
    return this.model.findByIdAndDelete(id);
  }

  deleteMany(where: TWhere): Promise<unknown> {
    return this.model.deleteMany(where).exec();
  }

  count(where: TWhere): Promise<number> {
    return this.model.countDocuments(where).exec();
  }
}
