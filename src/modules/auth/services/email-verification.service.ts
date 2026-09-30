import { Injectable } from '@nestjs/common';
import { WEB_BASE_URL } from '../../config/environment';
import { MailService } from '../../infrastructure/mail/mail.service';
import { User } from '../../user/domain/models/user.model';
import { AuthService } from './auth.service';

@Injectable()
export class EmailVerificationService {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService,
    ) {}

    async sendAsync(user: Pick<User, 'email' | 'firstName'>): Promise<void> {
        const token = await this.authService.generateEmailVerificationTokenAsync(user.email);
        const link = `${WEB_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;

        await this.mailService.send({
            to: user.email,
            subject: 'Verify your email address',
            text: `Hi ${user.firstName},\n\nConfirm your email address by opening this link (valid for 2 days):\n${link}`,
        });
    }
}
