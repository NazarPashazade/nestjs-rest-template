
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresDataSource } from './postgres-connection-options';
import { RolesSeeder } from './seaders/roles.seader';
import { UsersSeeder } from './seaders/users.seaders';
import { RolesRepository } from '../../modules/user/repositories/roles.repository';
import { UsersRepository } from '../../modules/user/repositories/users.repository';
import { UserDetailsRepository } from '../../modules/user/repositories/user-details.repository';
import { DbContext } from './db-context';
import { SeederService } from './services/seeder.service';

const services = [SeederService];

const repositories = [RolesRepository, UsersRepository, UserDetailsRepository]

const seeders = [RolesSeeder, UsersSeeder,];

const _providers = [DbContext, ...services, ...seeders]

const _exports = [DbContext, ...services, ...seeders]

@Global()
@Module({
    imports: [TypeOrmModule.forRoot(postgresDataSource), TypeOrmModule.forFeature(repositories)],
    providers: _providers,
    exports: [],
})
export class DatabaseModule { }

