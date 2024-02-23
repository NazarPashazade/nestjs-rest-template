import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt/jwt-payload';
import { DbContext } from '../../db/db-context';

@Injectable()
export class AuthService {
    @Inject() protected readonly dbContext: DbContext;
    @Inject() protected readonly jwt: JwtService;

    async validateJwtPayloadAsync(payload: JwtPayload): Promise<JwtPayload> {
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
        return await this.jwt.verifyAsync<JwtPayload>(token);
    }

    // EMAIL VERIFICATION Token
    async generateEmailVerificationTokenAsync(email: string): Promise<string> {
        return await this.jwt.signAsync({ email }, { expiresIn: '2 days' });
    }

    async verifyEmailVerificationTokenAsync(token: string): Promise<string> {
        const { email } = await this.jwt.verify<{ email: string }>(token);
        return email;
    }

    // Password RESET Token
    async generatePasswordResetTokenAsync(email: string): Promise<string> {
        return await this.jwt.signAsync({ email }, { expiresIn: '60m' });
    }

    async verifyPasswordResetTokenAsync(token: string): Promise<string> {
        const { email } = await this.jwt.verify<{ email: string }>(token);
        return email;
    }
}
