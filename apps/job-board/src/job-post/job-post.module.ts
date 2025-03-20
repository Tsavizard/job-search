import { Module } from '@nestjs/common';
import { JobPostsController } from './job-post.controller';
import { JobPostService } from './job-post.service';

@Module({
  controllers: [JobPostsController],
  providers: [JobPostService],
})
export class JobPostModule {}
