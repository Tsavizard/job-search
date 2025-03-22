import { Test, TestingModule } from '@nestjs/testing';
import {
  JobPostController,
  type TCreatePostParams,
} from './job-post.controller';
import { JobPost } from './job-post.entity';
import { JobPostService } from './job-post.service';

describe('JobPostController', () => {
  let controller: JobPostController;
  let service: JobPostService;

  const mockJobPostService = {
    listJobPosts: jest.fn(),
    getJobPost: jest.fn(),
    createJobPost: jest.fn(),
    updateJobPost: jest.fn(),
    deleteJobPost: jest.fn(),
  };

  const mockJobPost = new JobPost({
    id: '1',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    employmentType: 'on-site',
    userId: 'user1',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostController],
      providers: [
        {
          provide: JobPostService,
          useValue: mockJobPostService,
        },
      ],
    }).compile();

    controller = module.get<JobPostController>(JobPostController);
    service = module.get<JobPostService>(JobPostService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of job posts', async () => {
      const result = [mockJobPost];
      jest.spyOn(service, 'listJobPosts').mockResolvedValue(result);

      expect(await controller.findAll({ userId: 'user1' })).toBe(result);
      expect(service.listJobPosts).toHaveBeenCalledWith({ userId: 'user1' });
    });
  });

  describe('findOne', () => {
    it('should return a single job post', async () => {
      jest.spyOn(service, 'getJobPost').mockResolvedValue(mockJobPost);

      expect(await controller.findOne('1', { userId: 'user1' })).toBe(
        mockJobPost
      );
      expect(service.getJobPost).toHaveBeenCalledWith({
        id: '1',
        userId: 'user1',
      });
    });

    it('should return null when job post is not found', async () => {
      jest.spyOn(service, 'getJobPost').mockResolvedValue(null);

      expect(await controller.findOne('999', { userId: 'user1' })).toBeNull();
      expect(service.getJobPost).toHaveBeenCalledWith({
        id: '999',
        userId: 'user1',
      });
    });
  });

  describe('create', () => {
    it('should create a job post', async () => {
      const createDto: TCreatePostParams = {
        title: 'Software Engineer',
        description: 'Test description',
        salary: 50000,
        employmentType: 'on-site',
      };

      jest.spyOn(service, 'createJobPost').mockResolvedValue(mockJobPost);

      expect(await controller.create({ userId: 'user1' }, createDto)).toBe(
        mockJobPost
      );
      expect(service.createJobPost).toHaveBeenCalledWith({
        jobPostParams: createDto,
        userId: 'user1',
      });
    });

    it('should throw an error when creating a job post with invalid data', async () => {
      const createDto: TCreatePostParams = {
        title: 'Software Engineer',
        description: 'Test description',
        salary: 50000,
        // @ts-expect-error employmentType is invalid
        employmentType: 'invalid',
      };

      await expect(
        controller.create({ userId: 'user1' }, createDto)
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a job post', async () => {
      const updateDto: TCreatePostParams = {
        title: 'Updated Title',
        description: 'Updated description',
        salary: 60000,
        employmentType: 'on-site',
      };

      jest
        .spyOn(service, 'updateJobPost')
        .mockResolvedValue({ ...mockJobPost, ...updateDto } as JobPost);

      expect(
        await controller.update('1', { userId: 'user1' }, updateDto)
      ).toEqual({
        ...mockJobPost,
        ...updateDto,
      });
      expect(service.updateJobPost).toHaveBeenCalledWith({
        id: '1',
        userId: 'user1',
        jobPostParams: updateDto,
      });
    });

    it('should throw an error when updating a job post with invalid data', async () => {
      const updateDto: TCreatePostParams = {
        title: 'Updated Title',
        description: 'Updated description',
        salary: 60000,
        // @ts-expect-error employmentType is invalid
        employmentType: 'invalid',
      };

      await expect(
        controller.update('1', { userId: 'user1' }, updateDto)
      ).rejects.toThrow();
    });

    it('should throw an error when updating a job post that does not exist', async () => {
      const updateDto: TCreatePostParams = {
        title: 'Updated Title',
        description: 'Updated description',
        salary: 60000,
        employmentType: 'on-site',
      };

      jest.spyOn(service, 'updateJobPost').mockResolvedValue(null);

      await expect(
        controller.update('999', { userId: 'user1' }, updateDto)
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a job post', async () => {
      jest.spyOn(service, 'deleteJobPost').mockResolvedValue(true);

      await controller.remove('1', { userId: 'user1' });
      expect(service.deleteJobPost).toHaveBeenCalledWith({
        id: '1',
        userId: 'user1',
      });
    });
  });
});
