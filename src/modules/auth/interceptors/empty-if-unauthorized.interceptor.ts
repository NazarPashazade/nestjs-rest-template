import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../jwt/jwt-payload';
import { RoleName } from '../../user/domain/enums/role-name';

@Injectable()
export class EmptyIfUnauthorizedInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector, private authService: AuthService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const authorizationHeader: string = request.headers['authorization'];

        if (!authorizationHeader) {
            return null;
        }

        let user: JwtPayload;

        try {
            const token = authorizationHeader.split(' ')[1];

            user = await this.authService.verifyJwtTokenAsync(token);
        } catch (error) {
            return null;
        }

        const roles = this.reflector.get<RoleName[]>('roles', context.getHandler())?.map((r) => r.toString());
        if (roles && !roles.includes(user.role)) {
            return null;
        }

        return next.handle();
    }
}
