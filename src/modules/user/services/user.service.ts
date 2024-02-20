import { Injectable } from '@nestjs/common';
import { BaseHandler } from '../../shared/queries/base-handler';
import { RoleConnection, RoleNode } from '../types/user-connection-types';

@Injectable()
export class UserService extends BaseHandler {

  async getUsers(): Promise<RoleConnection> {

    const qb = this.dbContext.roles.createQueryBuilder()

    return this.dbContext.roles.getMany(qb, RoleNode);

  }
}
