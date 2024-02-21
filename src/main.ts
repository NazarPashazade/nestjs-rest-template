import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_ENV, PORT } from '../src/modules/config/environment';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SeederService } from '../src/modules/db/services/seeder.service';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import 'module-alias/register';

const port = PORT || 3000;
const address = APP_ENV === 'local' ? '127.0.0.1' : '0.0.0.0';

async function bootstrap() {
  initializeTransactionalContext() // Initialize cls-hooked
  patchTypeORMRepositoryWithBaseRepository() // patch Repository with BaseRepository.

  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const dbSeeder = app.get<SeederService>(SeederService);
  await dbSeeder.runSeedsAsync();

  await app.listen(port, address, () => {
    logger.log(`API listening on ${port} ......................`, 'Bootstrap');
  });

}

bootstrap();
