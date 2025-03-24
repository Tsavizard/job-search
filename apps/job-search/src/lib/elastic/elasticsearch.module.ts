import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticGatewayService } from './elastic.gateway.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE') as string,
        auth: {
          username: configService.get('ELASTICSEARCH_USER') as string,
          password: configService.get('ELASTICSEARCH_PASSWORD') as string,
        },
      }),
    }),
  ],
  providers: [
    ElasticGatewayService,
    {
      provide: Logger,
      useFactory: () => {
        return new Logger(ElasticGatewayService.name, { timestamp: true });
      },
    },
  ],
  exports: [ElasticsearchModule, ElasticGatewayService],
})
export class ElasticSearchModule {}
