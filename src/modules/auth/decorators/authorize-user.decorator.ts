import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomAuthGuard } from '../guards/custom-auth.guard';
import { EmptyIfUnauthorizedInterceptor } from '../interceptors/empty-if-unauthorized.interceptor';

export type ResolverAuthOptions = { resolveNullIfUnauthorized?: boolean };

export const AuthorizeUser = (options: ResolverAuthOptions = {}): ReturnType<typeof applyDecorators> => {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];

    if (options.resolveNullIfUnauthorized) {
        decorators.push(UseInterceptors(EmptyIfUnauthorizedInterceptor));
    } else {
        decorators.push(UseGuards(CustomAuthGuard));
    }

    return applyDecorators(...decorators);
};
