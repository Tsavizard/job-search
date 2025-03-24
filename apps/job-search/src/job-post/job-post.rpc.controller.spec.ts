import type { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { ElasticGatewayService } from '../lib/elastic/elastic.gateway.service';
import type { JobPost } from '../types';
import { JobPostRpcController } from './job-post.rpc.controller';
import { JobPostService } from './job-post.service';

describe('JobPostRpcController', () => {
  let controller: JobPostRpcController;

  const mockJobPost: JobPost = {
    id: '1',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    workModel: 'on-site',
    userId: 'user1',
  };

  const mockES = {
    indexDocument: jest.fn(),
    search: jest.fn(),
    deleteDocument: jest.fn(),
  } as unknown as jest.Mocked<ElasticGatewayService<JobPost>>;

  const mockLogger = {
    error: jest.fn(),
  } as unknown as Logger;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostRpcController],
      providers: [
        {
          provide: JobPostService,
          useFactory: () => new JobPostService(mockES, mockLogger),
        },
      ],
    }).compile();
    controller = module.get<JobPostRpcController>(JobPostRpcController);
  });

  describe('save', () => {
    it('should create a new job post', async () => {
      mockES.indexDocument.mockResolvedValue({
        ok: true,
      });
      await expect(controller.save(mockJobPost)).resolves.toBeUndefined();
    });

    it('should update an existing job post', async () => {
      mockES.indexDocument.mockResolvedValue({
        ok: true,
      });

      await expect(
        controller.save({ ...mockJobPost, title: 'new title' })
      ).resolves.toBeUndefined();
    });

    it('should throw error when an error occurs', async () => {
      mockES.indexDocument.mockResolvedValue({
        ok: false,
        error: 'Creation failed',
      });
      await expect(controller.save(mockJobPost)).rejects.toThrow();
    });

    it('should throw error when an invalid payload is given', async () => {
      await expect(
        // @ts-expect-error Testing invalid payload
        controller.save({ ...mockJobPost, foo: 'bar' })
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete an existing job post', async () => {
      mockES.deleteDocument.mockResolvedValue({ ok: true });
      await expect(controller.remove('1')).resolves.toBeUndefined();
    });

    it('should throw error when deleting non-existent post', async () => {
      mockES.deleteDocument.mockResolvedValue({
        ok: false,
        error: 'Job post not found',
      });
      await expect(controller.remove('999')).rejects.toThrow();
    });
  });
});
