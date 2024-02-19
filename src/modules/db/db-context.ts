// import { UsersRepository } from '@modules/user/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from '../user/repositories/roles.repository';
import { UserDetailsRepository } from '../user/repositories/user-details.repository';
import { UsersRepository } from '../user/repositories/users.repository';

@Injectable()
export class DbContext {
 
    @InjectRepository(RolesRepository)
    public readonly roles: RolesRepository;

    @InjectRepository(UsersRepository)
    public readonly users: UsersRepository;

    @InjectRepository(UserDetailsRepository)
    public readonly userDetails: UserDetailsRepository;

}