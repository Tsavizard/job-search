/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new Logger('JobBoard', { timestamp: true }),
    }
  );

  const server = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'job-board',
        brokers: ['localhost:9092'],
        retry: {
          initialRetryTime: 100,
          retries: 8,
          maxRetryTime: 30000,
        },
      },
      consumer: {
        groupId: 'job-board-consumer',
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });
  server.status.subscribe((status: string) => {
    Logger.debug(status);
  });

  const config = new DocumentBuilder()
    .setTitle('Job Board API')
    .setDescription('The job board API description')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'string',
    })
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { deepScanRoutes: true });

  SwaggerModule.setup('api/swagger', app, documentFactory, {
    jsonDocumentUrl: 'api/swagger-json',
  });

  await app.register(
    fastifyCookie,
    { secret: 'fooBar' } // Add a secret key for signed cookies
  );
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
