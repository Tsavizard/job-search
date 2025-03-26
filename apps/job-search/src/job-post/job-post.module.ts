import { Logger, Module } from '@nestjs/common';
import { ElasticSearchModule } from '../lib/elastic/elasticsearch.module';
import { JobPostApiController } from './job-post.api.controller';
import { JobPostRpcController } from './job-post.rpc.controller';
import { JobPostService } from './job-post.service';

@Module({
  imports: [ElasticSearchModule],
  controllers: [JobPostRpcController, JobPostApiController],
  providers: [JobPostService, Logger],
})
export class JobPostModule {}
