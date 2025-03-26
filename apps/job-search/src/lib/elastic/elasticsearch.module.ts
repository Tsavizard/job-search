import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticGatewayService } from './elastic.gateway.service';
import { ElasticIndexManagerService } from './elastic.index.manager.service';
import { ElasticInitService } from './elastic.init.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_HOST') as string,
        auth: {
          username: configService.get('ELASTICSEARCH_USER') as string,
          password: configService.get('ELASTICSEARCH_PASSWORD') as string,
        },
      }),
    }),
  ],
  providers: [
    ElasticGatewayService,
    ElasticIndexManagerService,
    Logger,
    ElasticInitService,
  ],
  exports: [
    ElasticsearchModule,
    ElasticGatewayService,
    ElasticIndexManagerService,
  ],
})
export class ElasticSearchModule {}
