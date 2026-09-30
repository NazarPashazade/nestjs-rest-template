import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { BaseHandler } from '../../shared/queries/base-handler';
import { AuthService } from '../services/auth.service';
import { ResetPasswordInput } from '../types/reset-password-input';
import { ResetPasswordPayload } from '../types/reset-password-payload';
import { hashPassword } from '../utils/password';

@Injectable()
export class ResetPasswordHandler extends BaseHandler {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Transactional()
    async execute({ token, password }: ResetPasswordInput): Promise<ResetPasswordPayload> {
        const user = await this.authService.verifyPasswordResetTokenAsync(token);

        user.password = await hashPassword(password);
        // The reset link was delivered to this mailbox, which proves the user owns it.
        user.verifyEmail();

        await this.dbContext.users.save(user);

        return { success: true };
    }
}
