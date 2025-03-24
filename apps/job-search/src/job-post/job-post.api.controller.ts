import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardJWT } from '../lib/AuthGuard.jwt';
import { ZodValidationPipe } from '../lib/ZodValidationPipe';
import type { JobPost, PaginatedResponse, TListQuery } from '../types';
import { listSchema } from './job-post.schema';
import { JobPostService } from './job-post.service';
import { listSwagger } from './job-post.swagger';
import { QueryDto } from './query.dto';

const queryValidationPipe = new ZodValidationPipe(listSchema);

@ApiTags('Job Posts')
@ApiBearerAuth()
@Controller('/api/job-posts')
@UseGuards(AuthGuardJWT)
export class JobPostApiController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Get()
  @ApiOperation(listSwagger)
  @ApiQuery(QueryDto)
  async list(
    @Query(queryValidationPipe) query: TListQuery
  ): Promise<PaginatedResponse<JobPost>> {
    const { search, salaryMax, salaryMin, model, page = 1, limit = 1 } = query;
    return await this.jobPostService.listJobPosts({
      limit,
      model,
      page,
      salaryMax,
      salaryMin,
      search,
    });
  }
}
