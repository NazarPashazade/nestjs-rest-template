import { Injectable } from '@nestjs/common';
import { DbContext } from '../db-context';

@Injectable()
export class RolesSeeder {
    constructor(private readonly dbContext: DbContext) { }

    public async run(): Promise<any> {
        const roleNames = ['manager', 'member'];

        const tasks = roleNames.map(async (name) => {
            const existingRole = await this.dbContext.roles.findOne({ where: { name } })

            if (existingRole) {
                await Promise.resolve();
            } else {
                await this.dbContext.roles.insert({ name });
            }
        });
        await Promise.all(tasks);
    }
}