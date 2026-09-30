import { Injectable } from '@nestjs/common';
import { BaseHandler } from '../../shared/queries/base-handler';
import { EmailVerificationService } from '../services/email-verification.service';
import { ResendVerificationInput } from '../types/resend-verification-input';
import { ResendVerificationPayload } from '../types/resend-verification-payload';

@Injectable()
export class ResendVerificationHandler extends BaseHandler {
    constructor(private readonly emailVerificationService: EmailVerificationService) {
        super();
    }

    // Always reports success so the endpoint can't be used to discover which emails are registered.
    async execute({ email }: ResendVerificationInput): Promise<ResendVerificationPayload> {
        const user = await this.dbContext.users.findOne({ where: { email } });

        if (user && !user.emailVerified) {
            await this.emailVerificationService.sendAsync(user);
        }

        return { sent: true };
    }
}
