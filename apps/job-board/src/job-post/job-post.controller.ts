import { Controller, Get } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Controller('job-posts')
export class JobPostsController {
  @Get()
  async getPosts(req: FastifyRequest, res: FastifyReply) {
    console.log(req);
    res.send('hello');
  }
}
