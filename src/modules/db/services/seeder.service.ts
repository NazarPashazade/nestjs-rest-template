import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { RolesSeeder } from '../seaders/roles.seader';
import { UsersSeeder } from '../seaders/users.seaders';
  
@Injectable()
export class SeederService {
    constructor(
        // private readonly logger: Logger,
        private readonly rolesSeeder: RolesSeeder,
        private readonly usersSeeder: UsersSeeder,
    ) {}

    @Transactional()
    async runSeedsAsync(): Promise<void> {
        console.log('Running seeders ...')
        // this.logger.log('Running seeders ...', 'Database');
        await this.rolesSeeder.run();
        await this.usersSeeder.run();

        // this.logger.log('Finished running seeders', 'Database');
    }
}