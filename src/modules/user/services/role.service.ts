import { Injectable } from '@nestjs/common';
import { BaseHandler } from '../../shared/queries/base-handler';
import { RoleConnection, RoleNode } from '../types/role-connection-types';

@Injectable()
export class RoleService extends BaseHandler{

  async getRoles(): Promise<RoleConnection> {

    const qb = this.dbContext.roles.createQueryBuilder()
    
    return this.dbContext.roles.getMany(qb, RoleNode);

  }
}
