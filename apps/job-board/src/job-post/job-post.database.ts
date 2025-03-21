import { Injectable } from '@nestjs/common';
import type {
  Connection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';
import assert from 'node:assert';
import type {
  DbCommandResult,
  DbQueryResult,
  IDatabase,
} from '../types/database';
import { JobPost, type TEmploymentType } from './job-post.entity';

@Injectable()
export class JobPostDatabase implements IDatabase<JobPost> {
  constructor(private dbConnection: Connection) {}

  async findAll(userId: string): Promise<DbQueryResult<JobPost[]>> {
    try {
      const QUERY =
        'SELECT id, title, description, salary/100 as salary, company FROM job_posts WHERE userId = ?';
      const [rows] = await this.dbConnection.execute<FindRes[]>(QUERY, [
        userId,
      ]);

      const posts = rows.map(
        (r) =>
          new JobPost({
            id: r.id,
            title: r.title,
            description: r.description,
            salary: r.salary,
            employmentType: r.employmentType,
            userId: r.userId,
          })
      );
      return { ok: true, data: posts };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  async findById(
    id: string,
    userId: string
  ): Promise<DbQueryResult<JobPost | null>> {
    try {
      const [rows] = await this.dbConnection.execute<FindRes[]>(
        'SELECT id, title, description, salary/100 as salary, company FROM job_posts WHERE id = ? and userId = ?',
        [id, userId]
      );
      assert(rows.length <= 1, 'JobPostDatabase: retrieved more than one');

      const post =
        rows.length === 0
          ? null
          : new JobPost({
              id: rows[0].id,
              title: rows[0].title,
              description: rows[0].description,
              salary: rows[0].salary,
              employmentType: rows[0].employmentType,
              userId: rows[0].userId,
            });
      return { ok: true, data: post };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  async create(jobPost: JobPost): Promise<DbCommandResult> {
    try {
      const salaryInCents = Math.round(jobPost.salary * 100);
      const [res] = await this.dbConnection.execute<ResultSetHeader>(
        'INSERT INTO job_posts (title, description, salary, employmentType, userId) VALUES (?, ?, ?, ?, ?)',
        [
          jobPost.title,
          jobPost.description,
          salaryInCents,
          jobPost.employmentType,
          jobPost.userId,
        ]
      );

      assert(res.affectedRows <= 1, 'JobPostDatabase: inserted more than one');

      return { ok: !!res.affectedRows, id: res.insertId?.toString() };
    } catch (error) {
      return { ok: false, id: '', error: (error as Error).message };
    }
  }

  async update(jobPost: JobPost): Promise<DbCommandResult> {
    try {
      const salaryInCents = Math.round(jobPost.salary * 100);
      const [res] = await this.dbConnection.execute<ResultSetHeader>(
        'UPDATE job_posts SET title = ?, description = ?, salary = ?, employmentType = ? WHERE id = ? AND userId = ? RETURNING id',
        [
          jobPost.title,
          jobPost.description,
          salaryInCents,
          jobPost.employmentType,
          jobPost.id,
          jobPost.userId,
        ]
      );

      // TODO: remove console.log
      console.log(res);
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
        'DELETE FROM job_posts WHERE id = ? AND userId = ? RETURNING id',
        [id, userId]
      );

      // TODO: remove console.log
      console.log(res);

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
  employmentType: TEmploymentType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type FindRes = RowDataPacket & JobPostDocument;
