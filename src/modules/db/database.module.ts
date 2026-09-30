
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';
import { postgresDataSource } from './postgres-connection-options';
import { RolesRepository } from '../../modules/user/repositories/roles.repository';
// import { RolesRepository } from '@modules/user/repositories/roles.repository';
import { UsersRepository } from '../../modules/user/repositories/users.repository';
import { UserDetailsRepository } from '../../modules/user/repositories/user-details.repository';
import { DbContext } from './db-context';
import { SeederService } from './services/seeder.service';
import { RolesSeeder, UsersSeeder } from './seaders';
 
const services = [SeederService];

const repositories = [
    RolesRepository,
    UsersRepository,
    UserDetailsRepository
]

const seeders = [
    RolesSeeder,
    UsersSeeder
];

const _imports = [
    TypeOrmModule.forRootAsync({
        useFactory: () => postgresDataSource,
        // TypeORM retries a failed connection by calling the factory again; re-registering throws.
        dataSourceFactory: async (options) =>
            getDataSourceByName('default') ?? addTransactionalDataSource(new DataSource(options)),
    }),
]

const _providers = [DbContext, ...services, ...seeders, ...repositories]

const _exports = [DbContext, ...services]

@Global()
@Module({
    imports: _imports,
    providers: _providers,
    exports: _exports,
})
export class DatabaseModule { }

