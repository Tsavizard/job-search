import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';

@Module({
  controllers: [JobPostController],
  providers: [JobPostService]
})
export class JobPostModule {}
