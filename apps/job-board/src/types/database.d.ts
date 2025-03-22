export interface IDatabase<T> {
  findAll(userId: string): Promise<DbQueryResult<T[]>>;
  findById(id: string, userId: string): Promise<DbQueryResult<T | null>>;
  create(entity: T): Promise<DbCommandResult>;
  update(entity: T): Promise<DbCommandResult>;
  delete(id: string, userId: string): Promise<DbCommandResult>;
}

export type DbQuerySuccessResult<T> = {
  ok: true;
  data: T;
};

export type DbQueryErrorResult = {
  ok: false;
  error: string;
};

export type DbQueryResult<T> = DbQuerySuccessResult<T> | DbQueryErrorResult;
export type DbCommandResult = { ok: boolean; id: string; error?: string };
