export interface IDatabase<T> {
  findAll(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<DbPaginatedQueryResult<T[]>>;
  findById(id: string, userId: string): Promise<DbQueryResult<T>>;
  create(entity: T): Promise<DbCommandResult>;
  update(entity: T): Promise<DbCommandResult>;
  delete(id: string, userId: string): Promise<DbCommandResult>;
}

export type DbQuerySuccessResult<T> = {
  ok: true;
  data: T;
};

export type DbPaginatedQuerySuccessResult<T> = DbQuerySuccessResult<T> & {
  total: number;
};

export type DbQueryErrorResult = {
  ok: false;
  error: string;
};

export type DbPaginatedQueryResult<T> =
  | DbPaginatedQuerySuccessResult<T>
  | DbQueryErrorResult;
export type DbQueryResult<T> = DbQuerySuccessResult<T> | DbQueryErrorResult;
export type DbCommandResult = { ok: boolean; id: string; error?: string };
