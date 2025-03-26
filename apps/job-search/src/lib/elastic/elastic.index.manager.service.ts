import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { OperationResult, TIndexSchema } from '../../types/elastic';

@Injectable()
export class ElasticIndexManagerService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly logger: Logger
  ) {}

  async createIndex(schema: TIndexSchema): Promise<OperationResult> {
    try {
      const indexExists = await this.es.indices.exists({ index: schema.index });

      if (indexExists) {
        this.logger.log(`Index '${schema.index}' already exists`);
        return { ok: true };
      }

      const response = await this.es.indices.create(schema);

      this.logger.log(`Index '${schema.index}' created successfully`);
      return { ok: true };
    } catch (error) {
      this.logger.error(`Error creating index '${schema.index}':`, error);
      return { ok: false, error: (error as Error).message };
    }
  }

  async deleteIndex(indexName: string): Promise<OperationResult> {
    try {
      const indexExists = await this.es.indices.exists({ index: indexName });

      if (!indexExists) {
        this.logger.log(`Index '${indexName}' does not exist`);
        return { ok: true };
      }

      await this.es.indices.delete({ index: indexName });
      this.logger.log(`Index '${indexName}' deleted successfully`);
      return { ok: true };
    } catch (error) {
      this.logger.error(`Error deleting index '${indexName}':`, error);
      return { ok: false, error: (error as Error).message };
    }
  }
}
