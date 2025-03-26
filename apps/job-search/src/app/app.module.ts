import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JobPostModule } from '../job-post/job-post.module';
import { ElasticSearchModule } from '../lib/elastic/elasticsearch.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/envs/.env.elastic.${process.env.NODE_ENV}`,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ElasticSearchModule,
    JobPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
