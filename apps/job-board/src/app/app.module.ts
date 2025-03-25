import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostModule } from '../job-post/job-post.module';
import { DatabaseModule } from '../lib/Database';
import { KafkaModule } from '../lib/kafka/kafka.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.cwd()}/envs/.env.mysql.${process.env.NODE_ENV}`,
        `${process.cwd()}/envs/.env.kafka.${process.env.NODE_ENV}`,
      ],
    }),
    JobPostModule,
    UserModule,
    DatabaseModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
