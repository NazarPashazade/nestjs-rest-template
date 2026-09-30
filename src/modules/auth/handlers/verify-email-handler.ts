import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { BaseHandler } from '../../shared/queries/base-handler';
import { AuthService } from '../services/auth.service';
import { VerifyEmailInput } from '../types/verify-email-input';
import { VerifyEmailPayload } from '../types/verify-email-payload';

@Injectable()
export class VerifyEmailHandler extends BaseHandler {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Transactional()
    async execute({ token }: VerifyEmailInput): Promise<VerifyEmailPayload> {
        const email = await this.authService.verifyEmailVerificationTokenAsync(token);

        const user = await this.dbContext.users.findOne({ where: { email } });

        if (!user) {
            throw new BadRequestException('Token is invalid or has expired');
        }

        if (!user.emailVerified) {
            user.verifyEmail();
            await this.dbContext.users.save(user);
        }

        return { success: true };
    }
}
