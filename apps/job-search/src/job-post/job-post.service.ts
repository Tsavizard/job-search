import { Inject, Injectable, Logger } from '@nestjs/common';
import { ElasticGatewayService } from '../lib/elastic/elastic.gateway.service';
import type { JobPost, PaginatedResponse, TListQuery } from '../types';
import { generateJobPostsQuery } from './job-post.list.query';

@Injectable()
export class JobPostService {
  index = 'job-posts'; // TODO: use constants

  constructor(
    @Inject(ElasticGatewayService)
    private readonly elasticSearchService: ElasticGatewayService<JobPost>,
    @Inject(Logger) private readonly logger: Logger
  ) {}

  async listJobPosts({
    page = 1,
    limit = 1,
    ...filters
  }: TListQuery): Promise<PaginatedResponse<JobPost>> {
    const res = await this.elasticSearchService.search(
      this.index,
      page,
      limit,
      Object.keys(filters).length !== 0
        ? generateJobPostsQuery(filters)
        : undefined
    );
    if (res.ok) {
      const { data, total, pageCount, page: currentPage, pageSize } = res;
      return {
        data,
        meta: {
          total,
          page: currentPage,
          limit: pageSize,
          totalPages: pageCount,
        },
      };
    }

    this.logger.error({ error: res.error });
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async indexJobPost({ id, ...post }: JobPost): Promise<boolean> {
    const res = await this.elasticSearchService.indexDocument(
      this.index,
      id,
      post
    );
    return res.ok;
  }

  async deleteJobPost({ id }: { id: string }): Promise<boolean> {
    const res = await this.elasticSearchService.deleteDocument(this.index, id);
    return res.ok;
  }
}
