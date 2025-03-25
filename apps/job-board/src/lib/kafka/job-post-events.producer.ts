import { Injectable, Logger } from '@nestjs/common';
import { JobPostDto } from '../../job-post/job-post.dto';
import { KafkaClient } from './kafka.client';

@Injectable()
export class JobPostEventsProducer {
  private readonly logger = new Logger(JobPostEventsProducer.name);

  constructor(private readonly client: KafkaClient) {}

  async emitCreated(jobPost: JobPostDto) {
    try {
      const res = await this.client.producer.send({
        topic: 'job-posts.created',
        messages: [
          {
            key: jobPost.id,
            value: JSON.stringify(jobPost),
          },
        ],
      });
      this.logger.debug(
        `Emitting job.created event for job ${jobPost.id}`,
        res
      );
    } catch (error) {
      this.logger.error(
        `Failed to emit job.created event: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async emitUpdated(jobPost: JobPostDto) {
    try {
      this.logger.debug(`Emitting job.updated event for job ${jobPost.id}`);
      await this.client.emit('job-posts.updated', {
        key: jobPost.id,
        value: jobPost,
      });
    } catch (error) {
      this.logger.error(
        `Failed to emit job.updated event: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async emitDeleted(id: string) {
    try {
      this.logger.debug(`Emitting job.deleted event for job ${id}`);
      await this.client.emit('job-posts.deleted', {
        key: id,
        value: { id },
      });
    } catch (error) {
      this.logger.error(
        `Failed to emit job.deleted event: ${(error as Error).message}`
      );
      throw error;
    }
  }
}
