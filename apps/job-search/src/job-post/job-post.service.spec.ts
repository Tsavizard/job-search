import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { ElasticSearchService } from '../lib/elastic/elasticsearch.service';
import type { JobPost } from '../types';
import { JobPostService } from './job-post.service';

describe('JobPostService', () => {
  let service: JobPostService;
  let mockES: jest.Mocked<ElasticSearchService<JobPost>>;
  const userId = 'test-user-id';
  const jobPostId = 'test-post-id';
  const mockJobPost: JobPost = {
    id: jobPostId,
    title: 'Test Job',
    description: 'Test Description',
    salary: 50000,
    workModel: 'remote',
    userId,
  };
  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    mockES = {
      indexDocument: jest.fn(),
      search: jest.fn(),
      deleteDocument: jest.fn(),
    } as unknown as jest.Mocked<ElasticSearchService<JobPost>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JobPostService,
          useFactory: () =>
            new JobPostService(mockES, mockLogger as unknown as Logger),
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
      mockES.search.mockResolvedValue({
        ok: true,
        data: [mockJobPost],
        total: 1,
        page: 1,
        pageCount: 1,
        pageSize: 10,
      });
      const result = await service.listJobPosts({ page: 1, limit: 10 });
      expect(result.data).toStrictEqual([mockJobPost]);
      expect(result.meta).toStrictEqual({
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      });
    });

    it('should return empty array on error', async () => {
      mockES.search.mockResolvedValue({
        ok: false,
        error: new Error('Elastic Error').message,
      });
      const result = await service.listJobPosts({ page: 1, limit: 10 });
      expect(result).toStrictEqual({
        data: [],
        meta: { limit: 10, page: 1, total: 0, totalPages: 0 },
      });
    });
  });

  describe('indexJobPost', () => {
    it('should return true on job post indexing success', async () => {
      mockES.indexDocument.mockResolvedValue({ ok: true });
      const result = await service.indexJobPost(mockJobPost);
      expect(result).toBe(true);
    });

    it('should return false error', async () => {
      mockES.indexDocument.mockResolvedValue({
        ok: false,
        error: new Error('Elastic Error').message,
      });
      const result = await service.indexJobPost(mockJobPost);
      expect(result).toBe(false);
    });
  });

  describe('deleteJobPost', () => {
    it('should return true on successful deletion', async () => {
      mockES.deleteDocument.mockResolvedValue({ ok: true });
      const result = await service.deleteJobPost({ id: jobPostId });
      expect(result).toBe(true);
    });

    it('should return false on deletion error', async () => {
      mockES.deleteDocument.mockResolvedValue({
        ok: false,
        error: new Error('Elastic Error').message,
      });
      const result = await service.deleteJobPost({ id: jobPostId });
      expect(result).toBe(false);
    });
  });
});
