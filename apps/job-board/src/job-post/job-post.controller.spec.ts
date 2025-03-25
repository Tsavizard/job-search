import type { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { JobPostEventsProducer } from './job-post-events.producer';
import {
  JobPostController,
  type TCreatePostParams,
} from './job-post.controller';
import type { JobPostDatabase } from './job-post.database';
import { JobPostDto } from './job-post.dto';
import { JobPost } from './job-post.entity';
import { JobPostService } from './job-post.service';

describe('JobPostController', () => {
  let controller: JobPostController;

  const mockJobPostDatabase = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<JobPostDatabase>;

  const mockJobPost = new JobPost({
    id: '1',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    workModel: 'on-site',
    userId: 'user1',
  });
  const mockJobPostDto = JobPostDto.from(mockJobPost);
  const mockJobPost2 = new JobPost({
    id: '2',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    workModel: 'on-site',
    userId: 'user1',
  });
  const mockJobPostDto2 = JobPostDto.from(mockJobPost2);

  const mockLogger = {
    error: jest.fn(),
  } as unknown as Logger;

  const mockKafka = {
    emitCreated: jest.fn(),
    emitUpdated: jest.fn(),
    emitDeleted: jest.fn(),
  } as unknown as JobPostEventsProducer;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostController],
      providers: [
        {
          provide: JobPostService,
          useFactory: () =>
            new JobPostService(mockJobPostDatabase, mockLogger, mockKafka),
        },
      ],
    }).compile();
    controller = module.get<JobPostController>(JobPostController);
  });

  describe('index', () => {
    it('should return empty array when no posts exist', async () => {
      mockJobPostDatabase.findAll.mockResolvedValue({
        ok: true,
        data: [],
        total: 0,
      });
      const result = await controller.index({ userId: 'user1' }, 1, 100);
      expect(result).toEqual({
        data: [],
        meta: { limit: 100, page: 1, total: 0, totalPages: 0 },
      });
    });

    it('should return multiple job posts', async () => {
      const mockPosts = [mockJobPost, mockJobPost2];
      mockJobPostDatabase.findAll.mockResolvedValue({
        ok: true,
        data: mockPosts,
        total: 1,
      });
      const result = await controller.index({ userId: 'user1' }, 1, 100);
      expect(result.data).toEqual([mockJobPostDto, mockJobPostDto2]);
      expect(result.data).toHaveLength(2);
      expect(result.meta).toStrictEqual({
        limit: 100,
        page: 1,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('show', () => {
    it('should return a job post when it exists', async () => {
      mockJobPostDatabase.findById.mockResolvedValue({
        ok: true,
        data: mockJobPost,
      });
      const result = await controller.show('1', { userId: 'user1' });
      expect(result).toEqual(mockJobPostDto);
    });

    it('should throw error when post does not exist', async () => {
      mockJobPostDatabase.findById.mockResolvedValue({
        ok: false,
        error: 'Job post not found',
      });
      await expect(
        controller.show('999', { userId: 'user1' })
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new job post', async () => {
      const createParams: TCreatePostParams = {
        title: 'New Job',
        description: 'Description',
        salary: 60000,
        workModel: 'remote',
      };

      mockJobPostDatabase.create.mockResolvedValue({
        ok: true,
        id: '3',
      });
      const result = await controller.create({ userId: 'user1' }, createParams);
      expect(result).not.toBeNull();
      expect(result?.id).toBe('3');
      expect(result?.title).toBe(createParams.title);
      expect(result?.description).toBe(createParams.description);
      expect(result?.salary).toBe(createParams.salary);
      expect(result?.workModel).toBe(createParams.workModel);
      expect(result?.userId).toBe('user1');
    });

    it('should throw error when an error occurs', async () => {
      mockJobPostDatabase.create.mockResolvedValue({
        ok: false,
        id: '',
        error: 'Creation failed',
      });
      await expect(
        controller.create({ userId: 'user1' }, {
          title: 'New Job',
          description: 'Description',
          salary: 60000,
          workModel: 'remote',
        } as TCreatePostParams)
      ).rejects.toThrow();
    });

    it('should throw error when an invalid payload is given', async () => {
      await expect(
        controller.create(
          { userId: 'user1' },
          {
            // @ts-expect-error Testing invalid payload
            foo: 'bar',
          }
        )
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an existing job post', async () => {
      mockJobPostDatabase.update.mockResolvedValue({
        ok: true,
        id: '1',
      });

      const result = await controller.update(
        '1',
        { userId: 'user1' },
        {
          title: 'Updated Title',
          description: 'Description',
          salary: 60000,
          workModel: 'remote',
        }
      );
      expect(result.title).toBe('Updated Title');
    });

    it('should throw error when post does not exist', async () => {
      mockJobPostDatabase.update.mockResolvedValue({
        ok: false,
        id: '999',
        error: 'Job post not found',
      });
      await expect(
        controller.update(
          '999',
          { userId: 'user1' },
          {
            title: 'New Title',
            description: 'Description',
            salary: 60000,
            workModel: 'remote',
          }
        )
      ).rejects.toThrow();
    });

    it('should throw error when an invalid payload is given', async () => {
      await expect(
        controller.update(
          '999',
          { userId: 'user1' },
          {
            title: 'New Title',
            description: 'Description',
            // @ts-expect-error Testing invalid payload
            foo: 'bar',
            workModel: 'remote',
          }
        )
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete an existing job post', async () => {
      mockJobPostDatabase.delete.mockResolvedValue({
        ok: true,
        id: '1',
      });

      const result = await controller.remove('1', { userId: 'user1' });
      expect(result).toBeUndefined();
    });

    it('should throw error when deleting non-existent post', async () => {
      mockJobPostDatabase.delete.mockResolvedValue({
        ok: false,
        id: '999',
        error: 'Job post not found',
      });
      await expect(
        controller.remove('999', { userId: 'user1' })
      ).rejects.toThrow();
    });
  });
});
