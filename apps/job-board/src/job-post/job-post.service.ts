import { Injectable } from '@nestjs/common';
import type { JobPostDatabase } from './job-post.database';

@Injectable()
export class JobPostService {
  constructor(private db: JobPostDatabase) {}
}
