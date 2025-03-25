import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { JobPostEventsConsumer } from './job-post-events.consumer';
import { JobPostEventsProducer } from './job-post-events.producer';
import { KafkaClient } from './kafka.client';

@Module({
  imports: [HttpModule],
  providers: [
    KafkaClient,
    JobPostEventsProducer,
    {
      provide: Logger,
      useFactory: () => {
        return new Logger('KafkaModule', { timestamp: true });
      },
    },
  ],
  controllers: [JobPostEventsConsumer],
  exports: [JobPostEventsProducer],
})
export class KafkaModule {}
