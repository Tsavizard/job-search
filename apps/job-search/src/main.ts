import fastifyCookie from '@fastify/cookie';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await ConfigureServer();
  ConfigureSwagger(app);

  const port = process.env.PORT || 3001;
  const host = process.env.HOST as string;
  await app.listen(port, host);

  Logger.log(`🚀 Application is running on: http://${host}:${port}`);
}

bootstrap();

async function ConfigureServer(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new Logger('JobSearch', { timestamp: true }),
    }
  );

  await app.register(
    fastifyCookie,
    { secret: 'fooBar' } // Add a secret key for signed cookies
  );

  return app;
}

function ConfigureSwagger(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .setTitle('Job Search API')
    .setDescription('The job search API description')
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
}
