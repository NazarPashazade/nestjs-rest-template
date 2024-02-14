import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_ENV, PORT } from '../src/modules/config/environment';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

const port = PORT || 3000;
const address = APP_ENV === 'local' ? '127.0.0.1' : '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  await app.listen(port, address, () => {
    logger.log(`API listening on ${address} ......................`, 'Bootstrap');
  });

}

bootstrap();
