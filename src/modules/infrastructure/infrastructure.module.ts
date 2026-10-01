import { Global, Module } from '@nestjs/common';
import { Logger } from './logging/logger';
import { MailService } from './mail/mail.service';

const _providers = [Logger, MailService];
const _exports = [Logger, MailService];

@Global()
@Module({
    providers: _providers,
    exports: _exports,
})
export class InfrastructureModule {}
