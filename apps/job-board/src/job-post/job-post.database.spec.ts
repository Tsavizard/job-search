import {
  Connection,
  ResultSetHeader,
  type RowDataPacket,
} from 'mysql2/promise';
import type {
  DbPaginatedQuerySuccessResult,
  DbQueryErrorResult,
  DbQuerySuccessResult,
} from '../types/database';
import { JobPostDatabase } from './job-post.database';
import { JobPost } from './job-post.entity';

describe('JobPostDatabase', () => {
  let jobPostDb: JobPostDatabase;
  let mockConnection: jest.Mocked<Connection>;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<Connection>;
    jobPostDb = new JobPostDatabase(mockConnection);
  });

  describe('findAll', () => {
    it('should return all job posts for a user', async () => {
      const mockRows: RowDataPacket[] = [
        {
          id: '1',
          title: 'Developer',
          description: 'Coding job',
          salary: 1000,
          work_model: 'on-site',
          userId: 'user1',
          createdAt: new Date().toISOString(),
          update: new Date().toISOString(),
          constructor: {
            name: 'RowDataPacket',
          },
        },
      ];
      mockConnection.execute
        .mockResolvedValueOnce([mockRows, []])
        .mockResolvedValueOnce([[{ total_count: 1 }] as RowDataPacket[], []]);

      const result = await jobPostDb.findAll('user1');
      expect(result.ok).toBe(true);
      expect(
        (result as DbPaginatedQuerySuccessResult<JobPost[]>).data
      ).toHaveLength(1);
      expect(
        (result as DbPaginatedQuerySuccessResult<JobPost[]>).data?.[0]
      ).toBeInstanceOf(JobPost);

      expect(
        (result as DbPaginatedQuerySuccessResult<JobPost[]>).total
      ).toEqual(1);
      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [
        'user1',
      ]);
    });
  });

  describe('findById', () => {
    it('should return a job post by id', async () => {
      const mockRow: RowDataPacket = {
        id: '1',
        title: 'Developer',
        description: 'Coding job',
        salary: 1000,
        work_model: 'on-site',
        userId: 'user1',
        createdAt: new Date(),
        update: new Date(),
        constructor: { name: 'RowDataPacket' },
      };
      mockConnection.execute.mockResolvedValueOnce([[mockRow], []]);

      const result = await jobPostDb.findById('1', 'user1');

      expect(result.ok).toBe(true);
      expect((result as DbQuerySuccessResult<JobPost>).data).toBeInstanceOf(
        JobPost
      );
      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [
        '1',
        'user1',
      ]);
    });

    it('should return ok false if job post not found', async () => {
      mockConnection.execute.mockResolvedValueOnce([[], []]);

      const result = await jobPostDb.findById('1', 'user1');

      expect(result.ok).toBe(false);
      expect((result as DbQuerySuccessResult<JobPost>).data).toBeUndefined();
      expect(typeof (result as DbQueryErrorResult).error).toBe('string');
    });
  });

  describe('create', () => {
    it('should create a new job post', async () => {
      const jobPost = new JobPost({
        title: 'Developer',
        description: 'Coding job',
        salary: 1000,
        workModel: 'on-site',
        userId: 'user1',
      });
      mockConnection.execute.mockResolvedValueOnce([
        { affectedRows: 1 } as ResultSetHeader,
        [],
      ]);

      const result = await jobPostDb.create(jobPost);

      expect(result.ok).toBe(true);
      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [
        expect.any(String),
        jobPost.title,
        jobPost.description,
        100000,
        jobPost.workModel,
        jobPost.userId,
      ]);
    });
  });

  describe('update', () => {
    it('should update an existing job post', async () => {
      const jobPost = new JobPost({
        id: '1',
        title: 'Senior Developer',
        description: 'Updated job',
        salary: 2000,
        workModel: 'on-site',
        userId: 'user1',
      });
      mockConnection.execute.mockResolvedValueOnce([
        { affectedRows: 1 } as ResultSetHeader,
        [],
      ]);

      const result = await jobPostDb.update(jobPost);

      expect(result.ok).toBe(true);
      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [
        jobPost.title,
        jobPost.description,
        200000,
        jobPost.workModel,
        jobPost.id,
        jobPost.userId,
      ]);
    });
  });

  describe('delete', () => {
    it('should delete a job post', async () => {
      mockConnection.execute.mockResolvedValueOnce([
        { affectedRows: 1 } as ResultSetHeader,
        [],
      ]);

      const result = await jobPostDb.delete('1', 'user1');

      expect(result.ok).toBe(true);
      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [
        '1',
        'user1',
      ]);
    });

    it('should return error if job post not found', async () => {
      mockConnection.execute.mockResolvedValueOnce([
        { affectedRows: 0 } as ResultSetHeader,
        [],
      ]);

      const result = await jobPostDb.delete('1', 'user1');

      expect(result.ok).toBe(false);
      expect(result.error).toBe('Job post not found');
    });
  });
});
