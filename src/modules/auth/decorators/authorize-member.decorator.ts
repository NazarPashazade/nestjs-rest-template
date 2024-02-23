import { applyDecorators } from '@nestjs/common';
import { AuthorizeRoles } from './authorize-roles.decorator';
import { ResolverAuthOptions } from './authorize-user.decorator';
import { RoleName } from '../../user/domain/enums/role-name';

export const AuthorizeMember = (options: ResolverAuthOptions = {}): ReturnType<typeof applyDecorators> => {
    return applyDecorators(AuthorizeRoles([RoleName.member], options));
};
