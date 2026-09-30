import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt/jwt-payload';
import { DbContext } from '../../db/db-context';
import { User } from '../../user/domain/models/user.model';
import { passwordFingerprint } from '../utils/password';

// Purpose-scoped tokens share JWT_SECRET with access tokens, so the claim is what stops one being used as the other.
export enum TokenPurpose {
    EmailVerification = 'email-verification',
    PasswordReset = 'password-reset',
}

type PurposeTokenPayload = { email: string; purpose: TokenPurpose; passwordFingerprint?: string };

@Injectable()
export class AuthService {
    @Inject() protected readonly dbContext: DbContext;
    @Inject() protected readonly jwt: JwtService;

    async validateJwtPayloadAsync(payload: JwtPayload): Promise<JwtPayload> {
        if (!payload.id || 'purpose' in payload) {
            throw new UnauthorizedException();
        }

        const user = await this.dbContext.users.findOne({ where: { id: payload.id } });

        if (!user || !user.emailVerified) {
            throw new UnauthorizedException();
        }

        return payload;
    }

    // JWT TOKEN
    async generateJwtTokenAsync(payload: JwtPayload): Promise<string> {
        return await this.jwt.signAsync(payload);
    }

    async verifyJwtTokenAsync(token: string): Promise<JwtPayload> {
        const payload = await this.jwt.verifyAsync<JwtPayload>(token);

        if (!payload.id || 'purpose' in payload) {
            throw new UnauthorizedException();
        }

        return payload;
    }

    // EMAIL VERIFICATION Token
    async generateEmailVerificationTokenAsync(email: string): Promise<string> {
        return await this.jwt.signAsync(
            { email, purpose: TokenPurpose.EmailVerification } satisfies PurposeTokenPayload,
            { expiresIn: '2 days' },
        );
    }

    async verifyEmailVerificationTokenAsync(token: string): Promise<string> {
        const { email } = await this.verifyPurposeTokenAsync(token, TokenPurpose.EmailVerification);
        return email;
    }

    // Password RESET Token
    async generatePasswordResetTokenAsync(user: Pick<User, 'email' | 'password'>): Promise<string> {
        return await this.jwt.signAsync(
            {
                email: user.email,
                purpose: TokenPurpose.PasswordReset,
                passwordFingerprint: passwordFingerprint(user.password),
            } satisfies PurposeTokenPayload,
            { expiresIn: '60m' },
        );
    }

    async verifyPasswordResetTokenAsync(token: string): Promise<User> {
        const payload = await this.verifyPurposeTokenAsync(token, TokenPurpose.PasswordReset);

        const user = await this.dbContext.users.findOne({ where: { email: payload.email } });

        if (!user || passwordFingerprint(user.password) !== payload.passwordFingerprint) {
            throw new BadRequestException('Token is invalid or has expired');
        }

        return user;
    }

    private async verifyPurposeTokenAsync(token: string, purpose: TokenPurpose): Promise<PurposeTokenPayload> {
        let payload: PurposeTokenPayload;

        try {
            payload = await this.jwt.verifyAsync<PurposeTokenPayload>(token);
        } catch {
            throw new BadRequestException('Token is invalid or has expired');
        }

        if (payload.purpose !== purpose || !payload.email) {
            throw new BadRequestException('Token is invalid or has expired');
        }

        return payload;
    }
}
