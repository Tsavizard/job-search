import type { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { ElasticSearchService } from '../lib/elastic/elasticsearch.service';
import type { JobPost } from '../types';
import { JobPostApiController } from './job-post.api.controller';
import { JobPostService } from './job-post.service';

describe('JobPostApiController', () => {
  let controller: JobPostApiController;

  const mockJobPost: JobPost = {
    id: '1',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    workModel: 'on-site',
    userId: 'user1',
  };
  const mockJobPost2: JobPost = {
    id: '2',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 80000,
    workModel: 'remote',
    userId: 'user1',
  };

  const mockES = {
    indexDocument: jest.fn(),
    search: jest.fn(),
    deleteDocument: jest.fn(),
  } as unknown as jest.Mocked<ElasticSearchService<JobPost>>;

  const mockLogger = {
    error: jest.fn(),
  } as unknown as Logger;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostApiController],
      providers: [
        {
          provide: JobPostService,
          useFactory: () => new JobPostService(mockES, mockLogger),
        },
      ],
    }).compile();
    controller = module.get<JobPostApiController>(JobPostApiController);
  });

  describe('list', () => {
    it('should return empty array when no posts exist', async () => {
      mockES.search.mockResolvedValue({
        ok: true,
        data: [],
        total: 0,
        page: 1,
        pageCount: 0,
        pageSize: 100,
      });
      const result = await controller.list({ limit: 50, page: 1 });
      expect(result).toEqual({
        data: [],
        meta: { limit: 100, page: 1, total: 0, totalPages: 0 },
      });
    });

    it('should return multiple job posts', async () => {
      const mockPosts = [mockJobPost, mockJobPost2];
      mockES.search.mockResolvedValue({
        ok: true,
        data: mockPosts,
        total: 2,
        page: 1,
        pageCount: 1,
        pageSize: 100,
      });
      const result = await controller.list({ limit: 50, page: 1 });
      expect(result.data).toEqual([mockJobPost, mockJobPost2]);
      expect(result.data).toHaveLength(2);
      expect(result.meta).toStrictEqual({
        limit: 100,
        page: 1,
        total: 2,
        totalPages: 1,
      });
    });
  });
});
