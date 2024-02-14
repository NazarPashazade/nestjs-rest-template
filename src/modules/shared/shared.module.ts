import { winstonConfig } from '../infrastructure/logging/winston.config';
import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

const services = [];

const _imports = [WinstonModule.forRoot(winstonConfig)]

const _providers = [...services];

const _exports = [...services];

@Global()
@Module({
    imports: _imports,
    providers: _providers,
    exports: _exports,
})
export class SharedModule { }