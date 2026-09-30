import { Injectable } from '@nestjs/common';
import { Logger } from '../logging/logger';
import { MailMessage } from './mail-message';

// Development transport: writes mail to the log. Replace the body of send() with a real provider (SMTP, SES, ...).
@Injectable()
export class MailService {
    constructor(private readonly logger: Logger) {}

    async send({ to, subject, text }: MailMessage): Promise<void> {
        this.logger.log(`To: ${to}\nSubject: ${subject}\n\n${text}`, MailService.name);
    }
}
