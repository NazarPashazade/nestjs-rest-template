// import { UsersRepository } from '@modules/user/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../user/repositories/users.repository';

@Injectable()
export class DbContext {
    @InjectRepository(UsersRepository)
    public readonly users: UsersRepository;
}