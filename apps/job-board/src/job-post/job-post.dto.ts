import type { JobPost, TWorkModel } from './job-post.entity';

export class JobPostDto {
  readonly title: string;
  readonly description: string;
  readonly salary: number;
  readonly workModel: TWorkModel;
  readonly userId: string;
  readonly id: string;

  private constructor(post: JobPost) {
    this.title = post.title;
    this.description = post.description;
    this.salary = post.salary;
    this.workModel = post.workModel;
    this.userId = post.userId;
    this.id = post.id as string;
  }

  static from(post: JobPost) {
    return Object.freeze(new JobPostDto(post));
  }
}
