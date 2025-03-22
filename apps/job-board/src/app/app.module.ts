import { Module } from '@nestjs/common';
import { JobPostModule } from '../job-post/job-post.module';
import { DatabaseModule } from '../lib/Database';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [JobPostModule, UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
