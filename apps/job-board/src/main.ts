/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Job Board API')
    .setDescription('The job board API description')
    .setVersion('1.0')
    .addCookieAuth('authCookie', {
      type: 'apiKey',
      in: 'cookie',
      name: 'token', // Change this to match your actual cookie name
    })
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { deepScanRoutes: true });

  SwaggerModule.setup('api/swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.register(fastifyCookie);
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
