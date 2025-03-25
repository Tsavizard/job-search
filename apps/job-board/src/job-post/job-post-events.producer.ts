import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import {
  JOB_POST_EVENTS_PRODUCER_LOGGER,
  MESSAGE_CLIENT,
} from '../lib/constants';
import { JobPostDto } from './job-post.dto';

@Injectable()
export class JobPostEventsProducer {
  private readonly isDisabled: boolean;

  constructor(
    @Inject(MESSAGE_CLIENT) private readonly client: ClientProxy,
    @Inject(JOB_POST_EVENTS_PRODUCER_LOGGER) private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {
    this.isDisabled = this.configService.get('DISABLE_PRODUCERS') === 'true';
  }

  async emitCreated(jobPostDto: JobPostDto) {
    if (this.isDisabled) return;

    try {
      this.client.emit('job-posts.created', JSON.stringify(jobPostDto));
      this.logger.debug(`Emitted job.created event for job ${jobPostDto.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to emit job.created event: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async emitUpdated(jobPostDto: JobPostDto) {
    if (this.isDisabled) return;

    try {
      this.client.emit('job-posts.updated', JSON.stringify(jobPostDto));
      this.logger.debug(`Emitted job.updated event for job ${jobPostDto.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to emit job.updated event: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async emitDeleted(id: string) {
    if (this.isDisabled) return;

    try {
      this.client.emit('job-posts.deleted', id);
      this.logger.debug(`Emitted job.deleted event for job ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to emit job.deleted event: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async onApplicationBootstrap() {
    await this.client.connect();
  }
}
