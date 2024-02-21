import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

const services = [RoleService, UserService];

const _controllers = [RoleController, UserController];

const _providers = [...services];

const _exports = [...services]

@Module({
    imports: [],
    providers: _providers,
    exports: _exports,
    controllers: _controllers
})
export class UserModule { }