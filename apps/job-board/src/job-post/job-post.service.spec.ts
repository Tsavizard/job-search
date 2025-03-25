import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { JobPostEventsProducer } from './job-post-events.producer';
import type { JobPostDatabase } from './job-post.database';
import { JobPostDto } from './job-post.dto';
import { JobPost } from './job-post.entity';
import { JobPostService } from './job-post.service';

describe('JobPostService', () => {
  let service: JobPostService;
  let mockDb: jest.Mocked<JobPostDatabase>;

  const userId = 'test-user-id';
  const jobPostId = 'test-post-id';
  const mockJobPost = new JobPost({
    id: jobPostId,
    title: 'Test Job',
    description: 'Test Description',
    salary: 50000,
    workModel: 'remote',
    userId,
  });
  const mockJobPostDto = JobPostDto.from(mockJobPost);
  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    mockDb = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<JobPostDatabase>;

    const mockKafka = {
      emitCreated: jest.fn(),
      emitUpdated: jest.fn(),
      emitDeleted: jest.fn(),
    } as unknown as JobPostEventsProducer;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JobPostService,
          useFactory: () =>
            new JobPostService(
              mockDb,
              mockLogger as unknown as Logger,
              mockKafka
            ),
        },
      ],
    }).compile();

    service = module.get<JobPostService>(JobPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listJobPosts', () => {
    it('should return array of job posts on success', async () => {
      mockDb.findAll.mockResolvedValue({
        ok: true,
        data: [mockJobPost],
        total: 1,
      });
      const result = await service.listJobPosts({ userId, page: 1, limit: 10 });
      expect(result.data).toStrictEqual([mockJobPostDto]);
      expect(result.meta).toStrictEqual({
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      });
    });

    it('should return empty array on error', async () => {
      mockDb.findAll.mockResolvedValue({
        ok: false,
        error: new Error('DB Error').message,
      });
      const result = await service.listJobPosts({ userId, page: 1, limit: 10 });
      expect(result).toStrictEqual({
        data: [],
        meta: { limit: 10, page: 1, total: 0, totalPages: 0 },
      });
    });
  });

  describe('getJobPost', () => {
    it('should return job post on success', async () => {
      mockDb.findById.mockResolvedValue({ ok: true, data: mockJobPost });
      const result = await service.getJobPost({ id: jobPostId, userId });
      expect(result).toEqual(mockJobPostDto);
    });

    it('should return null on error', async () => {
      mockDb.findById.mockResolvedValue({
        ok: false,
        error: new Error('DB Error').message,
      });
      const result = await service.getJobPost({ id: jobPostId, userId });
      expect(result).toBeNull();
    });
  });

  describe('createJobPost', () => {
    it('should create and return job post with id on success', async () => {
      mockDb.create.mockResolvedValue({ ok: true, id: jobPostId });
      const result = await service.createJobPost({
        userId,
        jobPostParams: {
          title: 'Test Job',
          description: 'Test Description',
          salary: 50000,
          workModel: 'remote',
        },
      });
      expect(result?.id).toBe(jobPostId);
    });

    it('should return job post without id on error', async () => {
      mockDb.create.mockResolvedValue({
        ok: false,
        id: jobPostId,
        error: new Error('DB Error').message,
      });
      const result = await service.createJobPost({
        userId,
        jobPostParams: {
          title: 'Test Job',
          description: 'Test Description',
          salary: 50000,
          workModel: 'remote',
        },
      });
      expect(result?.id).toBeUndefined();
    });
  });

  describe('updateJobPost', () => {
    it('should return updated job post', async () => {
      mockDb.update.mockResolvedValue({ ok: true, id: jobPostId });
      const result = await service.updateJobPost({
        id: jobPostId,
        userId,
        jobPostParams: {
          title: 'Updated Job',
          description: 'Updated Description',
          salary: 60000,
          workModel: 'hybrid',
        },
      });
      expect(result).toBeInstanceOf(JobPostDto);
      expect(result?.title).toBe('Updated Job');
    });
  });

  describe('deleteJobPost', () => {
    it('should return true on successful deletion', async () => {
      mockDb.delete.mockResolvedValue({ ok: true, id: jobPostId });
      const result = await service.deleteJobPost({ id: jobPostId, userId });
      expect(result).toBe(true);
    });

    it('should return false on deletion error', async () => {
      mockDb.delete.mockResolvedValue({
        ok: false,
        id: jobPostId,
        error: new Error('DB Error').message,
      });
      const result = await service.deleteJobPost({ id: jobPostId, userId });
      expect(result).toBe(false);
    });
  });
});
