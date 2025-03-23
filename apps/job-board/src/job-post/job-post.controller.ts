import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuardJWT } from '../lib/AuthGuard.jwt';
import { ZodValidationPipe } from '../lib/ZodValidationPipe';
import type { JobPostDto } from './job-post.dto';
import { type TWorkModel } from './job-post.entity';
import { JobPostSchema } from './job-post.schema';
import { JobPostService } from './job-post.service';
import {
  deleteSwagger,
  indexSwagger,
  postSwaggerBody,
  putSwaggerBody,
  showSwagger,
} from './job-post.swagger';

const validationPipeline = new ZodValidationPipe<TCreatePostParams>(
  JobPostSchema
);

@ApiTags('Job Posts')
@ApiBearerAuth()
@Controller('/job-posts')
@UseGuards(AuthGuardJWT)
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Get()
  @ApiOperation(indexSwagger)
  async index(@Req() { userId }: Request): Promise<JobPostDto[]> {
    return await this.jobPostService.listJobPosts({ userId });
  }

  @Get(':id')
  @ApiOperation(showSwagger)
  async show(
    @Param('id') id: string,
    @Req() { userId }: Request
  ): Promise<JobPostDto> {
    const res = await this.jobPostService.getJobPost({ id, userId });
    if (res === null) throw new NotFoundException('Job post not found.');
    return res;
  }

  @Post()
  @ApiOperation(postSwaggerBody)
  async create(
    @Req() { userId }: Request,
    @Body(validationPipeline) body: TCreatePostParams
  ): Promise<JobPostDto | null> {
    const res = await this.jobPostService.createJobPost({
      jobPostParams: body,
      userId,
    });
    if (!res || res.id === undefined)
      throw new BadRequestException('Job post creation failed.');
    return res;
  }

  @Put(':id')
  @ApiOperation(putSwaggerBody)
  async update(
    @Param('id') id: string,
    @Req() { userId }: Request,
    @Body(validationPipeline) body: TCreatePostParams
  ): Promise<JobPostDto> {
    const res = await this.jobPostService.updateJobPost({
      jobPostParams: body,
      id,
      userId,
    });
    if (res === null) throw new BadRequestException('Job post update failed.');
    return res;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation(deleteSwagger)
  async remove(
    @Param('id') id: string,
    @Req() { userId }: Request
  ): Promise<void> {
    const res = await this.jobPostService.deleteJobPost({ id, userId });
    if (!res) throw new NotFoundException('Job post deletion failed.');
  }
}

type Request = { userId: string };
export type TCreatePostParams = {
  title: string;
  description: string;
  salary: number;
  workModel: TWorkModel;
};
