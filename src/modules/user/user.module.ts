import { Module } from '@nestjs/common';

const services = [];

const _providers = [...services];

const _exports = [...services]

@Module({
    imports: [],
    providers: _providers,
    exports: _exports,
})
export class UserModule { }