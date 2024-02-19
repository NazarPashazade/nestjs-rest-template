import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './controller/role.controller';

const services = [RoleService];

const _controllers = [RoleController];

const _providers = [...services];

const _exports = [...services]

@Module({
    imports: [],
    providers: _providers,
    exports: _exports,
    controllers: _controllers
})
export class UserModule { }