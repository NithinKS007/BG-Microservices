export interface IBaseRepository<
  TDomain,
  TCreateArgs,
  TFindUniqueArgs,
  TFindFirstArgs,
  TUpdateArgs,
  TDeleteArgs
> {
  create(args: TCreateArgs): Promise<TDomain>;
  findById(args: TFindUniqueArgs): Promise<TDomain | null>;
  findOne(args: TFindFirstArgs): Promise<TDomain | null>;
  updateById(args: TUpdateArgs): Promise<TDomain>;
  deleteById(args: TDeleteArgs): Promise<TDomain>;
}
