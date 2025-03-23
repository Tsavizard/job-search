import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from '../lib/Database';
import { KafkaModule } from '../lib/kafka/kafka.module';
import { JobPostController } from './job-post.controller';
import { JobPostDatabase } from './job-post.database';
import { JobPostService } from './job-post.service';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [JobPostController],
  providers: [
    JobPostDatabase,
    {
      provide: Logger,
      useFactory: () => {
        return new Logger(JobPostService.name, { timestamp: true });
      },
    },
    JobPostService,
  ],
})
export class JobPostModule {}
