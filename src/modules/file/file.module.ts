import { Module } from '@nestjs/common';

const loaders = [];

const resolvers = [];

const commandHandlers = [];

const queryHandlers = [];

const _imports = []

const _providers = [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders];

const _controllers = [];

const _exports = [];

@Module({
    imports: _imports,
    providers: _providers,
    controllers: _controllers,
    exports: _exports,
})
export class FileModule { }