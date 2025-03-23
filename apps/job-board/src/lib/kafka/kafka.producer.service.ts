import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Injectable()
export class KafkaProducerService extends ClientKafka implements OnModuleInit {
  producerTopics: string[];
  constructor() {
    super({
      client: {
        clientId: 'job-board',
        brokers: ['localhost:9092'],
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
        allowAutoTopicCreation: true,
      },
      consumer: {
        groupId: 'job-board-consumer',
      },
    });

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
