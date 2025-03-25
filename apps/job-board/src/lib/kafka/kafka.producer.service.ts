import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService extends ClientKafka implements OnModuleInit {
  producerTopics: string[];
  constructor() {
    super({});

    this.producerTopics = [
      'job-posts.created',
      'job-posts.updated',
      'job-posts.deleted',
    ];
  }

  async onModuleInit() {
    await this.connect();
  }
}
