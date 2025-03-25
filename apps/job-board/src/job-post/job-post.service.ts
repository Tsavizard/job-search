import { Inject, Injectable, Logger } from '@nestjs/common';
import { JobPostEventsProducer } from '../lib/kafka/job-post-events.producer';
import type { PaginatedResponse } from '../types';
import { JobPostDatabase } from './job-post.database';
import { JobPostDto } from './job-post.dto';
import { JobPost, type TWorkModel } from './job-post.entity';

@Injectable()
export class JobPostService {
  constructor(
    private readonly db: JobPostDatabase,
    @Inject(Logger) private readonly logger: Logger,
    private readonly eventsService: JobPostEventsProducer
  ) {}

  async listJobPosts({
    userId,
    page,
    limit,
  }: TFindManyJobPostsQuery): Promise<PaginatedResponse<JobPostDto>> {
    const res = await this.db.findAll(userId, page, limit);
    if (res.ok) {
      const { data, total } = res;
      return {
        data: data.map((post) => JobPostDto.from(post)),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    this.logger.error({ error: res.error, userId });
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async getJobPost({
    id,
    userId,
  }: TFindOneJobPostQuery): Promise<JobPostDto | null> {
    const res = await this.db.findById(id, userId);
    if (res.ok) return JobPostDto.from(res.data);

    this.logger.error({ error: res.error, userId, jobPostId: id });
    return null;
  }

  async createJobPost({
    userId,
    jobPostParams,
  }: {
    userId: string;
    jobPostParams: TJobPostParams;
  }): Promise<JobPostDto | null> {
    const jobPost = new JobPost({ ...jobPostParams, userId });
    const res = await this.db.create(jobPost);
    if (res.ok) {
      jobPost.save(res.id);
      const dto = JobPostDto.from(jobPost);
      await this.eventsService.emitCreated(dto);
      return dto;
    }

    this.logger.error({ error: res.error, userId: jobPost.userId });
    return null;
  }

  async updateJobPost({
    id,
    userId,
    jobPostParams,
  }: {
    id: string;
    userId: string;
    jobPostParams: TJobPostParams;
  }): Promise<JobPostDto | null> {
    const jobPost = new JobPost({ ...jobPostParams, id, userId });
    const res = await this.db.update(jobPost);
    if (res.ok) {
      const dto = JobPostDto.from(jobPost);
      await this.eventsService.emitUpdated(dto);
      return dto;
    }

    this.logger.error({
      error: res.error,
      userId: jobPost.userId,
      jobPostId: jobPost.id,
    });

    return null;
  }

  async deleteJobPost({ id, userId }: TFindOneJobPostQuery): Promise<boolean> {
    const res = await this.db.delete(id, userId);
    if (res.ok) {
      await this.eventsService.emitDeleted(id);
    }
    if (!res.ok) this.logger.error({ error: res.error, userId, jobPostId: id });

    return res.ok;
  }
}

type TFindManyJobPostsQuery = { page: number; limit: number; userId: string };
type TFindOneJobPostQuery = {
  id: string;

  userId: string;
};

export type TJobPostParams = {
  title: string;
  description: string;
  salary: number;
  workModel: TWorkModel;
};
