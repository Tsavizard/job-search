/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new Logger('JobSearch', { timestamp: true }),
    }
  );

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

  SwaggerModule.setup('/swagger', app, documentFactory, {
    jsonDocumentUrl: '/swagger-json',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
