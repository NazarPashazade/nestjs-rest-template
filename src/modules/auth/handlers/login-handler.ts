import { BaseHandler } from '../../shared/queries/base-handler';
import { AuthService } from '../services/auth.service';
import { LoginInput } from '../types/login-input';
import { LoginService } from '../services/login.service';
import { Inject, Injectable } from '@nestjs/common';
import { LoginPayload } from '../types/login-payload';

@Injectable()
export class LoginHandler extends BaseHandler {
    @Inject() private readonly authService: AuthService
    @Inject() private readonly loginService: LoginService

    async execute({ email, password }: LoginInput): Promise<LoginPayload> {

        const user = await this.dbContext.users.findOne({
            where: { email },
            relations: ['details', 'details.avatar', 'details.coverPhoto', 'role'],
        });

        await this.loginService.checkValidations(password, user);

        const jwtPayload = await this.loginService.generateJwtPayload(user);

        const accessToken = await this.authService.generateJwtTokenAsync(jwtPayload);

        return { accessToken };
    }
}
