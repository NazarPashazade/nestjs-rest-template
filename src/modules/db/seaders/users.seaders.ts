import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { DbContext } from '../db-context';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../config/environment';
import { RoleName } from '../../user/domain/enums/role-name';
import { Gender } from '../../user/domain/enums/gender';
 
@Injectable()
export class UsersSeeder {
    constructor(private readonly dbContext: DbContext) {}

    public async run(): Promise<any> {
        const email = ADMIN_EMAIL;
        const password = ADMIN_PASSWORD;
        const passwordHash = await hash(password, await genSalt(10));

        const existingUser = await this.dbContext.users.findOne({ where:{email} });
         if (!existingUser) {
            const role = await this.dbContext.roles.findOne({ where:{name: RoleName.admin} });

            const user = this.dbContext.users.create({
                firstName: 'Super',
                lastName: 'Admin',
                email,
                password: passwordHash,
                roleId: role.id,
                emailVerified: true,
                role,
            });

            await this.dbContext.users.save(user);

            const userDetails = this.dbContext.userDetails.create({
                user,
                phoneNumber: '999999999999',
                gender: Gender.MALE,
            });

            await this.dbContext.userDetails.save(userDetails);

        } else {
            existingUser.password = passwordHash;
            await this.dbContext.users.save(existingUser);
        }
    }

}