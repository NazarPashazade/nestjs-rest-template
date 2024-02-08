
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresDataSource } from './postgres-connection-options';

const services = [];

const providers = [...services];

const repositories = []

 
@Global()
@Module({
    imports: [TypeOrmModule.forRoot(postgresDataSource), TypeOrmModule.forFeature(repositories)],
    providers,
    exports: [...services],
})
export class DatabaseModule { }

