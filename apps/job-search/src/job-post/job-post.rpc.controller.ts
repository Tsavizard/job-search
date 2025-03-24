import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuardJWT } from '../lib/AuthGuard.jwt';
import { ZodValidationPipe } from '../lib/ZodValidationPipe';
import type { JobPost } from '../types';
import { JobPostSchema } from './job-post.schema';
import { JobPostService } from './job-post.service';
import { deleteSwagger, saveSwagger } from './job-post.swagger';

const bodyValidationPipe = new ZodValidationPipe<JobPost>(JobPostSchema);

@ApiTags('Job Posts')
@ApiBearerAuth()
@Controller('/rpc/job-posts')
@UseGuards(AuthGuardJWT)
export class JobPostRpcController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @ApiOperation(saveSwagger)
  async save(@Body(bodyValidationPipe) body: JobPost): Promise<void> {
    const res = await this.jobPostService.indexJobPost(body);
    if (!res) throw new BadRequestException('Job post creation failed.');
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation(deleteSwagger)
  async remove(@Param('id') id: string): Promise<void> {
    const res = await this.jobPostService.deleteJobPost({ id });
    if (!res) throw new NotFoundException('Job post deletion failed.');
  }
}
