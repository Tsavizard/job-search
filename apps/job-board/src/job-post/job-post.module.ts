import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostDatabase } from './job-post.database';
import { JobPostService } from './job-post.service';

@Module({
  controllers: [JobPostController],
  providers: [JobPostService, JobPostDatabase],
})
export class JobPostModule {}
