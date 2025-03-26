/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import fastifyCookie from '@fastify/cookie';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import assert from 'node:assert';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const globalPrefix = 'api';

  const app = await ConfigureServer(globalPrefix);
  ConfigureSwagger(app);
  ConfigureKafka(app);
  const port = process.env.PORT || 3000;

  await app.startAllMicroservices();
  await app.listen(port, process.env.SERVER_HOST as string);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

async function ConfigureServer(
  globalPrefix: string
): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new Logger('JobBoard', { timestamp: true }),
    }
  );

  await app.register(
    fastifyCookie,
    { secret: 'fooBar' } // Add a secret key for signed cookies
  );

  app.setGlobalPrefix(globalPrefix);

  return app;
}

function ConfigureSwagger(app: NestFastifyApplication) {
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
}

function ConfigureKafka(app: NestFastifyApplication) {
  const configService = app.get<ConfigService>(ConfigService);
  assert(configService.get('KAFKA_BROKER'));

  const kafkaServer = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'job-board',
        brokers: [configService.get('KAFKA_BROKER') as string],
      },
      producer: {
        allowAutoTopicCreation: false,
      },
      consumer: {
        groupId: 'job-board-consumer',
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });
  kafkaServer.status.subscribe((status: string) => {
    Logger.debug(status);
  });
}
