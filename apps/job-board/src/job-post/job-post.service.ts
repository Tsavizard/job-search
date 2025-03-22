import { Injectable, type Logger } from '@nestjs/common';
import type { JobPostDatabase } from './job-post.database';
import { JobPost, type TEmploymentType } from './job-post.entity';

@Injectable()
export class JobPostService {
  private db: JobPostDatabase;
  private readonly logger: Logger;

  constructor(db: JobPostDatabase, LoggerClass: typeof Logger) {
    this.db = db;
    this.logger = new LoggerClass(JobPostService.name, { timestamp: true });
  }

  async listJobPosts({ userId }: TFindManyJobPostsQuery): Promise<JobPost[]> {
    const res = await this.db.findAll(userId);
    if (res.ok) return res.data;

    this.logger.error({ error: res.error, userId });
    return [];
  }

  async getJobPost({
    id,
    userId,
  }: TFindOneJobPostQuery): Promise<JobPost | null> {
    const res = await this.db.findById(id, userId);
    if (res.ok) return res.data;

    this.logger.error({ error: res.error, userId, jobPostId: id });
    return null;
  }

  async createJobPost({
    userId,
    jobPostParams,
  }: {
    userId: string;
    jobPostParams: TJobPostParams;
  }): Promise<JobPost> {
    const jobPost = new JobPost({ ...jobPostParams, userId });
    const res = await this.db.create(jobPost);
    if (res.ok) {
      jobPost.save(res.id);
    } else {
      this.logger.error({ error: res.error, userId: jobPost.userId });
    }

    return jobPost;
  }

  async updateJobPost({
    id,
    userId,
    jobPostParams,
  }: {
    id: string;
    userId: string;
    jobPostParams: TJobPostParams;
  }): Promise<JobPost> {
    const jobPost = new JobPost({ ...jobPostParams, id, userId });
    const res = await this.db.update(jobPost);
    if (!res.ok)
      this.logger.error({
        error: res.error,
        userId: jobPost.userId,
        jobPostId: jobPost.id,
      });

    return jobPost;
  }

  async deleteJobPost({ id, userId }: TFindOneJobPostQuery): Promise<boolean> {
    const res = await this.db.delete(id, userId);
    if (!res.ok) this.logger.error({ error: res.error, userId, jobPostId: id });

    return res.ok;
  }
}

type TFindManyJobPostsQuery = { userId: string };
type TFindOneJobPostQuery = {
  id: string;
  userId: string;
};

export type TJobPostParams = {
  title: string;
  description: string;
  salary: number;
  employmentType: TEmploymentType;
};
