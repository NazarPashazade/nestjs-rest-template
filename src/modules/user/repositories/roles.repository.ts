import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../domain/models/role.model';
import { BaseRelayRepository } from '../../shared/repositories/base-relay-repository';

@Injectable()
export class RolesRepository extends BaseRelayRepository<Role> {
    constructor(private dataSource: DataSource) {
        super(Role, dataSource.createEntityManager());
    }
}


