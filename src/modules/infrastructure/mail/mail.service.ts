import { Injectable, OnModuleInit } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { MAIL_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from '../../config/environment';
import { Logger } from '../logging/logger';
import { MailMessage } from './mail-message';

// Without SMTP_HOST, mail is written to the log so the app runs with no mail setup.
@Injectable()
export class MailService implements OnModuleInit {
    private readonly transporter?: Transporter;

    constructor(private readonly logger: Logger) {
        if (SMTP_HOST) {
            this.transporter = createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: SMTP_PORT === 465,
                auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
            });
        }
    }

    onModuleInit(): void {
        if (!this.transporter) {
            this.logger.warn('SMTP_HOST is not set: emails will be written to the log, not sent', MailService.name);
            return;
        }

        this.logger.log(`Sending emails via ${SMTP_HOST}:${SMTP_PORT} as ${MAIL_FROM}`, MailService.name);

        // Not awaited, so a down mail server doesn't block startup; it only surfaces bad credentials or IP blocks early.
        this.transporter
            .verify()
            .then(() => this.logger.log('SMTP connection verified', MailService.name))
            .catch((error) => this.logger.error(error, MailService.name));
    }

    async send({ to, subject, text, html }: MailMessage): Promise<void> {
        if (!this.transporter) {
            this.logger.log(`To: ${to}\nSubject: ${subject}\n\n${text}`, MailService.name);
            return;
        }

        const info = await this.transporter.sendMail({ from: MAIL_FROM, to, subject, text, html });

        this.logger.log(`Email sent to ${to} ("${subject}"), messageId: ${info.messageId}`, MailService.name);
    }
}
