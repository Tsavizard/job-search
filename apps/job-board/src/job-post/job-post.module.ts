import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import {
  JOB_POST_EVENTS_PRODUCER_LOGGER,
  JOB_POST_SERVICE_LOGGER,
} from '../lib/constants';
import { DatabaseModule } from '../lib/database.module';
import { JobPostEventsConsumer } from './job-post-events.consumer';
import { JobPostEventsProducer } from './job-post-events.producer';
import { JobPostController } from './job-post.controller';
import { JobPostDatabase } from './job-post.database';
import { JobPostService } from './job-post.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [JobPostController, JobPostEventsConsumer],
  providers: [
    {
      provide: JOB_POST_EVENTS_PRODUCER_LOGGER,
      useFactory: async () =>
        new Logger(JobPostEventsProducer.name, { timestamp: true }),
    },
    JobPostEventsProducer,
    JobPostDatabase,
    Logger,
    {
      provide: JOB_POST_SERVICE_LOGGER,
      useFactory: async () =>
        new Logger(JobPostService.name, { timestamp: true }),
    },

    JobPostService,
  ],
})
export class JobPostModule {}
