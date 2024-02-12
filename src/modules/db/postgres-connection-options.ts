

import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import {
    // NODE_ENV,
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_USER,
} from '../config/environment';



export const postgresDataSource: DataSourceOptions = {
    type: 'postgres',
    name: 'default',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    synchronize: false,
    logging: false, //false && NODE_ENV === 'development',
    migrationsRun: true,
    entities: [path.join(__dirname, '..', '**/domain/models/*.model.{ts,js}')],
    migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
    migrationsTableName: "migrations_typeorm",
};


console.log({__dirname,postgresDataSource})


const dataSource = new DataSource(postgresDataSource)
export default dataSource