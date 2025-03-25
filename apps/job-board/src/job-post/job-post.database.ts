import { Inject, Injectable } from '@nestjs/common';
import type {
  Connection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';
import assert from 'node:assert';
import { v4 as uuid } from 'uuid';
import { DATABASE_CONNECTION } from '../lib/database.module';
import type {
  DbCommandResult,
  DbPaginatedQueryResult,
  DbQueryResult,
  IDatabase,
} from '../types/database';
import { JobPost, type TWorkModel } from './job-post.entity';

@Injectable()
export class JobPostDatabase implements IDatabase<JobPost> {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly dbConnection: Connection
  ) {}

  async findAll(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<DbPaginatedQueryResult<JobPost[]>> {
    try {
      assert(
        limit >= 0,
        'Pagination limit must be greater than or equal to  0'
      );
      const offset = (page - 1) * limit;
      assert(offset >= 0, 'Pagination page must be greater than or equal to 0');

      const QUERY = `SELECT id, title, description, salary as salary, work_model, userId  FROM job_posts WHERE userId = ? LIMIT ? OFFSET ?`;
      const COUNT =
        'SELECT COUNT(*) as total_count FROM job_posts WHERE userId = ?';

      const [[rows], [jobPostCountRows]] = await Promise.all([
        this.dbConnection.execute<FindRes[]>(QUERY, [
          userId,
          limit.toString(),
          offset.toString(),
        ]),
        this.dbConnection.execute<RowDataPacket[]>(COUNT, [userId]),
      ]);

      const posts = rows.map(
        (r) =>
          new JobPost({
            id: r.id,
            title: r.title,
            description: r.description,
            salary: parseFloat((r.salary / 100).toFixed(2)),
            workModel: r.work_model,
            userId: r.userId,
          })
      );
      return { ok: true, data: posts, total: jobPostCountRows[0].total_count };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  async findById(id: string, userId: string): Promise<DbQueryResult<JobPost>> {
    try {
      const [rows] = await this.dbConnection.execute<FindRes[]>(
        'SELECT id, title, description, salary as salary, work_model, userId FROM job_posts WHERE id = ? and userId = ?',
        [id, userId]
      );
      assert(rows.length <= 1, 'JobPostDatabase: retrieved more than one');

      if (rows.length === 0) {
        return { ok: false, error: 'Job post not found' };
      }

      const post = new JobPost({
        id: rows[0].id,
        title: rows[0].title,
        description: rows[0].description,
        salary: parseFloat((rows[0].salary / 100).toFixed(2)),
        workModel: rows[0].work_model,
        userId: rows[0].userId,
      });
      return { ok: true, data: post };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  async create(jobPost: JobPost): Promise<DbCommandResult> {
    try {
      const id = uuid();
      const salaryInCents = Math.trunc(jobPost.salary * 100);
      const result = await this.dbConnection.execute<ResultSetHeader>(
        'INSERT INTO job_posts (id, title, description, salary, work_model, userId) VALUES (?, ?, ?, ?, ?, ?)',
        [
          id,
          jobPost.title,
          jobPost.description,
          salaryInCents,
          jobPost.workModel,
          jobPost.userId,
        ]
      );
      const [res] = result;
      assert(res.affectedRows <= 1, 'JobPostDatabase: inserted more than one');

      return { ok: !!res.affectedRows, id };
    } catch (error) {
      return { ok: false, id: '', error: (error as Error).message };
    }
  }

  async update(jobPost: JobPost): Promise<DbCommandResult> {
    try {
      const salaryInCents = Math.trunc(jobPost.salary * 100);
      const [res] = await this.dbConnection.execute<ResultSetHeader>(
        'UPDATE job_posts SET title = ?, description = ?, salary = ?, work_model = ? WHERE id = ? AND userId = ?',
        [
          jobPost.title,
          jobPost.description,
          salaryInCents,
          jobPost.workModel,
          jobPost.id,
          jobPost.userId,
        ]
      );

      assert(res.affectedRows <= 1, 'JobPostDatabase: Updated more than one');

      return res.affectedRows
        ? { ok: true, id: jobPost.id as string }
        : { ok: false, id: jobPost.id as string, error: 'Job post not found' };
    } catch (error) {
      return {
        ok: false,
        id: jobPost.id as string,
        error: (error as Error).message,
      };
    }
  }

  async delete(id: string, userId: string): Promise<DbCommandResult> {
    try {
      const [res] = await this.dbConnection.execute<ResultSetHeader>(
        'DELETE FROM job_posts WHERE id = ? AND userId = ?',
        [id, userId]
      );

      assert(res.affectedRows <= 1, 'JobPostDatabase: Deleted more than one');
      return res.affectedRows
        ? { ok: true, id }
        : { ok: false, id, error: 'Job post not found' };
    } catch (error) {
      return { ok: false, id, error: (error as Error).message };
    }
  }
}

type JobPostDocument = {
  id: string;
  title: string;
  description: string;
  salary: number;
  work_model: TWorkModel;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type FindRes = RowDataPacket & JobPostDocument;
