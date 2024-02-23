import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RoleName } from '../../user/domain/enums/role-name';
import { JwtPayload } from '../jwt/jwt-payload';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const request = context.switchToHttp().getRequest();

        const user = request.user as JwtPayload;

        if (!user) {
            return false;
        }

        const roles = this.reflector.get<RoleName[]>('roles', context.getHandler())?.map((r) => r.toString());

        if (!roles) {
            return true;
        }

        return roles.includes(user.role);
    }
}
