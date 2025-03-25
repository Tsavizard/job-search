import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostModule } from '../job-post/job-post.module';
import { DatabaseModule } from '../lib/database.module';
import { KafkaModule } from '../lib/kafka.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.cwd()}/envs/.env.mysql.${process.env.NODE_ENV}`,
        `${process.cwd()}/envs/.env.kafka.${process.env.NODE_ENV}`,
        `${process.cwd()}/apps/job-board/envs/.env.${process.env.NODE_ENV}`,
      ],
      isGlobal: true,
    }),
    DatabaseModule,
    KafkaModule,
    JobPostModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
