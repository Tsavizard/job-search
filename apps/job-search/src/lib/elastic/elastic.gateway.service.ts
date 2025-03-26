import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticGatewayService<T extends DocumentData> {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly logger: Logger
  ) {}

  async search(
    index: string,
    page: number,
    pageSize: number,
    query?: Record<string, unknown>
  ): Promise<SearchResponse<T>> {
    try {
      const from = (page - 1) * pageSize;

      const res = await this.es.search<T>({
        index,
        query,
        from,
        size: pageSize,
      });

      const data = res.hits.hits.map((hit) => ({
        id: hit._id as string,
        ...hit._source,
      })) as T[];
      const total =
        typeof res.hits.total === 'number'
          ? res.hits.total
          : res.hits.total?.value || 0;

      return {
        ok: true,
        data,
        page,
        pageSize,
        pageCount: Math.ceil((total as number) / pageSize),
        total: total,
      };
    } catch (error) {
      this.logger.error('Error finding documents:', error);
      return { ok: false, error: (error as Error).message };
    }
  }

  async indexDocument(
    index: string,
    id: string,
    body: Omit<T, 'id'>
  ): Promise<OperationResult> {
    try {
      const response = await this.es.index({
        index,
        id,
        body,
      });

      if (response.result === 'created' || response.result === 'updated') {
        this.logger.debug('Document indexed successfully');
      } else if (response.result === 'noop') {
        this.logger.debug('No changes made, document already exists');
      }
      return { ok: true };
    } catch (error) {
      this.logger.error('Error indexing document:', error);
      return { ok: false, error: (error as Error).message };
    }
  }

  async deleteDocument(index: string, id: string): Promise<OperationResult> {
    try {
      const response = await this.es.delete({
        index,
        id,
      });

      if (response.result === 'deleted') {
        this.logger.debug('Document deleted successfully');
      } else if (response.result === 'not_found') {
        this.logger.warn('Document not found');
      }
      return { ok: true };
    } catch (error) {
      this.logger.error('Error deleting document:', error);
      return { ok: false, error: (error as Error).message };
    }
  }
}

export type OperationResult = { ok: true } | { ok: false; error: string };

type DocumentData = {
  id: string;
  [key: string]: unknown;
};

type SearchResponse<T> =
  | {
      ok: true;
      data: T[];
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  | { ok: false; error: string };
// type SearchSuccess<T = Record<string, unknown>> = {
//   _shards: {
//     total: number;
//     successful: number;
//     skipped: number;
//     failed: number;
//   };
//   hits: {
//     total: {
//       value: number;
//       relation: 'eq';
//     };
//     max_score: number;
//     hits: [
//       {
//         _index: string;
//         _type: '_doc';
//         _id: string;
//         _score: number;
//         _source: T;
//       }
//     ];
//   };
// };

// type SearchError = {
//   error: {
//     type: string;
//     reason: string;
//     line: number;
//     col: number;
//   };
//   status: number;
// };
