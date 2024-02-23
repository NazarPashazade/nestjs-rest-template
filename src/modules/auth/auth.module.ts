import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from './jwt/jwt.config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthService } from './services/auth.service';
import { LoginHandler } from './handlers/login-handler';
import { AuthorizeUserController } from './controllers/auth.controller';
import { LoginService } from './services/login.service';

const handlers = [LoginHandler]

const services = [AuthService, LoginService];

const _controllers = [AuthorizeUserController];

const _imports = [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JwtConfig),
]

const _providers = [JwtStrategy, ...services, ...handlers]

const _exports = [AuthService];

@Module({
    imports: _imports,
    providers: _providers,
    controllers: _controllers,
    exports: _exports,
})
export class AuthModule { }
