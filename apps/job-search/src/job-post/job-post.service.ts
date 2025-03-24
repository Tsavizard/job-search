import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ElasticSearchService } from '../lib/elastic/elasticsearch.service';
import type { JobPost, PaginatedResponse, TListQuery } from '../types';

@Injectable()
export class JobPostService {
  index = 'job-posts';

  constructor(
    private readonly elasticSearchService: ElasticSearchService<JobPost>,
    @Inject(Logger) private readonly logger: Logger
  ) {}

  async listJobPosts({
    page = 1,
    limit = 1,
    search,
    ...filters
  }: TListQuery): Promise<PaginatedResponse<JobPost>> {
    const res = await this.elasticSearchService.search(
      this.index,
      {
        search,
        ...filters,
      },
      page,
      limit
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
