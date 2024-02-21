import { Injectable } from '@nestjs/common';
import { BaseHandler } from '../../shared/queries/base-handler';
import { UserConnection, UserNode } from '../types/user-connection-types';
import { User } from '../domain/models/user.model';

@Injectable()
export class UserService extends BaseHandler {

  async getUsers(): Promise<UserConnection> {
    const qb = this.dbContext.users.createQueryBuilder()
    return this.dbContext.users.getMany(qb, UserNode);
  }


  async getUserById(id: string): Promise<User> {
    const user = await this.dbContext.users.findOne(
      {
        where: { id },
        relations: ['role', 'details', 'details.avatar', 'details.coverPhoto']
      }
    );
    return user
  }
}
