import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticIndexManagerService } from './elastic.index.manager.service';
import { schemas } from './schemas';

@Injectable()
export class ElasticInitService implements OnModuleInit {
  constructor(
    private readonly indexManager: ElasticIndexManagerService,
    private readonly logger: Logger
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing Elasticsearch indices');

    const results = await Promise.all(
      schemas.map((schema) => this.indexManager.createIndex(schema))
    );

    if (results.every((r) => r.ok)) {
      this.logger.log('Elasticsearch indices initialized successfully');
    } else {
        const errors = results.filter((r) => !r.ok).map((r) => r.error);
      this.logger.error('Failed to initialize Elasticsearch indices', errors);
    }
  }
}
