import { Module } from '@nestjs/common';

const services = [];

const providers = [...services];

@Module({
    imports: [],
    providers,
    exports: [...services],
})
export class UserModule { }