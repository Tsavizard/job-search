import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { JobPostEventsConsumer } from './job-post-events.consumer';
import { JobPostEventsService } from './job-post-events.service';
import { KafkaProducerService } from './kafka.producer.service';

@Module({
  imports: [HttpModule],
  providers: [
    KafkaProducerService,
    JobPostEventsService,
    {
      provide: Logger,
      useFactory: () => {
        return new Logger('KafkaModule', { timestamp: true });
      },
    },
  ],
  controllers: [JobPostEventsConsumer],
  exports: [JobPostEventsService],
})
export class KafkaModule {}
