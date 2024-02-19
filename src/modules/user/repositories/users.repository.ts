import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../domain/models/user.model';
import { BaseRelayRepository } from '../../shared/repositories/base-relay-repository';

@Injectable()
 export class UsersRepository extends BaseRelayRepository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
}
