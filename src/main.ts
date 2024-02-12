import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_ENV, PORT } from '../src/modules/config/environment';

const port = PORT || 3000;
const address = APP_ENV === 'local' ? '127.0.0.1' : '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  await app.listen(port, address, () => {
    if (false) {
      console.error("A");
    } else {
      console.log(`API listening on ${address}`)
    }
  });
}

bootstrap();
