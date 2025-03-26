import { HttpService } from '@nestjs/axios';
import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern } from '@nestjs/microservices';
import { JobPostDto } from './job-post.dto';

@Controller()
export class JobPostEventsConsumer {
  private readonly jobSearchBaseUrl: string;
  private readonly isDisabled: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {
    this.jobSearchBaseUrl = configService.get(
      'JOB_SEARCH_JOB_POST_RPC_URL'
    ) as string;

    this.isDisabled = configService.get('DISABLE_CONSUMERS') === 'true';
  }

  @EventPattern('job-posts.created')
  async handleCreated(jobPostDto: JobPostDto) {
    if (this.isDisabled) return;

    try {
      return this.httpService.post(this.jobSearchBaseUrl, jobPostDto, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            this.configService.get('AUTH_JWT') as string
          }`,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to sync created job post: ${(error as Error).message}`
      );
      return null;
    }
  }

  @EventPattern('job-posts.updated')
  async handleUpdated(jobPostDto: JobPostDto) {
    if (this.isDisabled) return;

    try {
      return this.httpService.put(
        `${this.jobSearchBaseUrl}/${jobPostDto.id}`,
        jobPostDto,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              this.configService.get('AUTH_JWT') as string
            }`,
          },
        }
      );
    } catch (error) {
      this.logger.error(
        `Failed to sync updated job post: ${(error as Error).message}`
      );
      return null;
    }
  }

  @EventPattern('job-posts.deleted')
  async handleDeleted(id: string) {
    if (this.isDisabled) return;

    try {
      return this.httpService.delete(`${this.jobSearchBaseUrl}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            this.configService.get('AUTH_JWT') as string
          }`,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to sync deleted job post: ${(error as Error).message}`
      );
      return null;
    }
  }
}
