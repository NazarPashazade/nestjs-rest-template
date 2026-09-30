import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_ENV, NODE_ENV, PORT } from './modules/config/environment';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SeederService } from './modules/db/services/seeder.service';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import 'module-alias/register'; 
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument, SWAGGER_PATH } from './swagger';

const port = PORT || 3000;
const address = APP_ENV === 'local' ? '127.0.0.1' : '0.0.0.0';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (NODE_ENV !== 'production') {
    SwaggerModule.setup(SWAGGER_PATH, app, createSwaggerDocument(app));
  }

  const dbSeeder = app.get<SeederService>(SeederService);
  await dbSeeder.runSeedsAsync();

  await app.listen(port, address, () => {
    logger.log(`API listening on ${port} ......................`, 'Bootstrap');
  });

}

bootstrap();
