import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardJWT } from '../lib/AuthGuard.jwt';
import { ZodValidationPipe } from '../lib/ZodValidationPipe';
import type {
  JobPost,
  PaginatedResponse,
  TListQuery,
  TWorkModel,
} from '../types';
import { listSchema } from './job-post.schema';
import { JobPostService } from './job-post.service';
import { listSwagger } from './job-post.swagger';
import { QueryDto } from './query.dto';

const queryValidationPipe = new ZodValidationPipe(listSchema);

@ApiBearerAuth()
@Controller('/api/job-posts')
@UseGuards(AuthGuardJWT)
@ApiTags('Job Posts Api')
export class JobPostApiController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Get()
  @ApiOperation(listSwagger)
  @ApiQuery({ type: QueryDto, explode: true })
  async list(
    @Query(queryValidationPipe)
    query: Omit<TListQuery, 'models'> & { model?: TWorkModel[] }
  ): Promise<PaginatedResponse<JobPost>> {
    const { search, salaryMax, salaryMin, model, page = 1, limit = 1 } = query;
    let models: TWorkModel[] | undefined = undefined;
    if (model) {
      models = Array.isArray(model) ? model : [model];
    }

    return await this.jobPostService.listJobPosts({
      limit,
      models,
      page,
      salaryMax,
      salaryMin,
      search,
    });
  }
}
