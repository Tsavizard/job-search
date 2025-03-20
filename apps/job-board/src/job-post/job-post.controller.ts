import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

@Controller('job-posts')
export class JobPostsController {
  @Get()
  async getAllPosts() {
    return 'hello';
  }

  @Get(':id')
  async getPosts(@Param() params: any, @Query() query: any) {
    // return `hello from params ${query.foo} / ${params.id}`;
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message, oops',
      },
      HttpStatus.FORBIDDEN,
      {
        cause: 'oops',
      }
    );
  }
}
