import { Global, Module } from '@nestjs/common';

const services = [];

const providers = [...services];

@Global()
@Module({
    imports: [],
    providers,
    exports: [ ...services],
})
export class SharedModule { }