import { Global, Module } from '@nestjs/common';
import { Logger } from './logging/logger';

const _providers = [Logger];
const _exports = [Logger];

@Global()
@Module({
    providers: _providers,
    exports: _exports,
})
export class InfrastructureModule { }
