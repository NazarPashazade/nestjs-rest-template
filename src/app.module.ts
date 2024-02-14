import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/db/database.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';
import { FileModule } from './modules/file/file.module';

const modules = [
  ConfigModule.forRoot({ isGlobal: true }),
  InfrastructureModule,
  DatabaseModule,
  SharedModule,
  UserModule,
  FileModule
]

const _imports = [...modules]
const _providers = [AppService]
const _controllers = [AppController]

@Module({
  imports: _imports,
  controllers: _controllers,
  providers: _providers,
})
export class AppModule { }
