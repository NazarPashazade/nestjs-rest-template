import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtConfig } from './jwt/jwt.config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthService } from './services/auth.service';
import { LoginHandler } from './handlers/login-handler';
import { AuthorizeUserController } from './controllers/auth.controller';
import { LoginService } from './services/login.service';
import { RegisterHandler } from './handlers/register-handler';
import { VerifyEmailHandler } from './handlers/verify-email-handler';
import { ResendVerificationHandler } from './handlers/resend-verification-handler';
import { EmailVerificationService } from './services/email-verification.service';
import { ForgotPasswordHandler } from './handlers/forgot-password-handler';
import { ResetPasswordHandler } from './handlers/reset-password-handler';

const handlers = [
    LoginHandler,
    RegisterHandler,
    VerifyEmailHandler,
    ResendVerificationHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
];

const services = [AuthService, LoginService, EmailVerificationService];

const _controllers = [AuthorizeUserController];

const _imports = [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JwtConfig),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 10 }]),
];

const _providers = [JwtStrategy, ...services, ...handlers];

const _exports = [AuthService];

@Module({
    imports: _imports,
    providers: _providers,
    controllers: _controllers,
    exports: _exports,
})
export class AuthModule {}
