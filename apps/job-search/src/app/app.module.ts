import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostModule } from '../job-post/job-post.module';
import { ElasticSearchModule } from '../lib/elastic/elasticsearch.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/apps/job-board/envs/.env.${
        process.env.NODE_ENV
      }`,
    }),
    JobPostModule,
    ElasticSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
