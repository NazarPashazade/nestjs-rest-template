import { Injectable } from '@nestjs/common';
import { WEB_BASE_URL } from '../../config/environment';
import { MailService } from '../../infrastructure/mail/mail.service';
import { BaseHandler } from '../../shared/queries/base-handler';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordInput } from '../types/forgot-password-input';
import { ForgotPasswordPayload } from '../types/forgot-password-payload';

@Injectable()
export class ForgotPasswordHandler extends BaseHandler {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService,
    ) {
        super();
    }

    // Always reports success so the endpoint can't be used to discover which emails are registered.
    async execute({ email }: ForgotPasswordInput): Promise<ForgotPasswordPayload> {
        const user = await this.dbContext.users.findOne({ where: { email } });

        if (!user) {
            return { sent: true };
        }

        const token = await this.authService.generatePasswordResetTokenAsync(user);
        const link = `${WEB_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;

        await this.mailService.send({
            to: user.email,
            subject: 'Reset your password',
            text:
                `Hi ${user.firstName},\n\nReset your password by opening this link (valid for 60 minutes, single use):\n${link}` +
                `\n\nIf you didn't request this, you can ignore this email.`,
        });

        return { sent: true };
    }
}
