import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostModule } from '../job-post/job-post.module';
import { DatabaseModule } from '../lib/Database';
import { UserModule } from '../user/user.module';
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
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
