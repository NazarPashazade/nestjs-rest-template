import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { RolesSeeder, UsersSeeder } from '../seaders';
import { Logger } from '../../infrastructure/logging/logger';

@Injectable()
export class SeederService {
    constructor(
        private readonly logger: Logger,
        private readonly rolesSeeder: RolesSeeder,
        private readonly usersSeeder: UsersSeeder,
    ) { }

    @Transactional()
    async runSeedsAsync(): Promise<void> {
        this.logger.log('Running seeders ...', 'Database');
        await this.rolesSeeder.run();
        await this.usersSeeder.run();
        this.logger.log('Finished running seeders', 'Database');
    }
}