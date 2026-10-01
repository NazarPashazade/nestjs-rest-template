import { Injectable } from '@nestjs/common';
import { ArticleCategoriesSeeder, RolesSeeder, UsersSeeder } from '../seaders';
import { Logger } from '../../infrastructure/logging/logger';

@Injectable()
export class SeederService {
    constructor(
        private readonly logger: Logger,
        private readonly rolesSeeder: RolesSeeder,
        private readonly usersSeeder: UsersSeeder,
        private readonly articleCategoriesSeeder: ArticleCategoriesSeeder,
    ) {}

    // @Transactional({ connectionName: 'default' })
    async runSeedsAsync(): Promise<void> {
        this.logger.log('Running seeders ...', 'Database');
        await this.rolesSeeder.run();
        await this.usersSeeder.run();
        await this.articleCategoriesSeeder.run();
        this.logger.log('Finished running seeders', 'Database');
    }
}
