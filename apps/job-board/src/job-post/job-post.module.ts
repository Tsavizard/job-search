import { Module } from '@nestjs/common';
import { JobPostsController } from './job-post.controller';
import { JobPostDatabase } from './job-post.database';
import { JobPostService } from './job-post.service';

@Module({
  controllers: [JobPostsController],
  providers: [JobPostService, JobPostDatabase],
})
export class JobPostModule {}
