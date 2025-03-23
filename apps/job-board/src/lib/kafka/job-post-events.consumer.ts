import { HttpService } from '@nestjs/axios';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JobPostDto } from '../../job-post/job-post.dto';

@Controller()
export class JobPostEventsConsumer {
  private readonly jobSearchBaseUrl = 'http://localhost:3001/api/job-posts';

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger
  ) {}

  @MessagePattern('job-posts.created')
  async handleCreated(@Payload() jobPostDto: JobPostDto) {
    try {
      this.logger.debug(
        'Consuming create event: ' + JSON.stringify(Object.keys(jobPostDto))
      );
      return this.httpService.post(this.jobSearchBaseUrl, jobPostDto);
    } catch (error) {
      this.logger.error(
        `Failed to sync created job post: ${(error as Error).message}`
      );
      return null;
    }
  }

  @MessagePattern('job-posts.updated')
  async handleUpdated(@Payload() jobPostDto: JobPostDto) {
    try {
      return this.httpService.put(
        `${this.jobSearchBaseUrl}/${jobPostDto.id}`,
        jobPostDto
      );
    } catch (error) {
      this.logger.error(
        `Failed to sync updated job post: ${(error as Error).message}`
      );
      return null;
    }
  }

  @MessagePattern('job-posts.deleted')
  async handleDeleted(@Payload() id: string) {
    try {
      return this.httpService.delete(`${this.jobSearchBaseUrl}/${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to sync deleted job post: ${(error as Error).message}`
      );
      return null;
    }
  }
}
