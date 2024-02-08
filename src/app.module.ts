import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/db/database.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';

const modules = [
  ConfigModule.forRoot({ isGlobal: true }),
  DatabaseModule,
  SharedModule,
  UserModule,
]

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
