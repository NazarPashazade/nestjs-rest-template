
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresDataSource } from './postgres-connection-options';
import { RolesRepository } from '../../modules/user/repositories/roles.repository';
import { UsersRepository } from '../../modules/user/repositories/users.repository';
import { UserDetailsRepository } from '../../modules/user/repositories/user-details.repository';
import { DbContext } from './db-context';
import { SeederService } from './services/seeder.service';
import { RolesSeeder, UsersSeeder } from './seaders';

const services = [SeederService];

const repositories = [RolesRepository, UsersRepository, UserDetailsRepository]

const seeders = [RolesSeeder, UsersSeeder];


const _providers = [DbContext, ...services, ...seeders]

const _exports = [DbContext, ...services]

const _imports = [TypeOrmModule.forRoot(postgresDataSource), TypeOrmModule.forFeature(repositories)]

@Global()
@Module({
    imports: _imports,
    providers: _providers,
    exports: _exports,
})
export class DatabaseModule { }

